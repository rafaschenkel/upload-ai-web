import { FileVideo, Upload } from 'lucide-react';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react';
import { getFFmpeg } from '@/lib/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { api } from '@/lib/api';

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success';

interface IVideoInputProps {
  onVideoUploaded: (id: string) => void;
}

const statusMessages = {
  converting: 'Convertendo...',
  uploading: 'Enviando...',
  generating: 'Transcrevendo...',
  success: 'Sucesso!'
};

export default function VideoInputForm(props: IVideoInputProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null); // armazena o arquivo enviado
  const [status, setStatus] = useState<Status>('waiting');
  const promptInputRef = useRef<HTMLTextAreaElement>(null); // recebe o valor digitado no textarea

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget; // recebe um array dos arquivos enviados, mesmo que seja enviado apenas um arquivo

    if (!files) return; // caso não seja enviado nenhum arquivo sai da função

    const fileSelected = files[0]; // recupera o arquivo enviado na primeira posição do array

    setVideoFile(fileSelected); // seta o novo arquivo enviado na variável videoFile
  } // função que seta o novo arquivo enviado

  async function convertVideoToAudio(video: File) {
    // função que faz a conversão do arquivo de video em audio utilizando webAssemble e a lib FFmpeg
    console.log('Converted started.');

    const ffmpeg = await getFFmpeg();

    await ffmpeg.writeFile('input.mp4', await fetchFile(video));

    ffmpeg.on('progress', progress => {
      console.log('Convert in progress: ' + Math.round(progress.progress * 100));
    });

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3'
    ]);

    const data = await ffmpeg.readFile('output.mp3');

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg'
    });

    console.log('Converted finished.');

    return audioFile;
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const prompt = promptInputRef.current?.value; // recebe o valor digitado no textarea caso ele exista

    if (!videoFile) return; // se nao videoFile for null, sai da função e nao faz o submit

    setStatus('converting');
    // Converter video em audio
    const audioFile = await convertVideoToAudio(videoFile);

    const data = new FormData(); // Instância uma variável no formato application/form-data

    data.append('file', audioFile); // adiciona ao form-data um arquivo para ser enviado na requisição

    setStatus('uploading');

    const response = await api.post('/videos', data); // faz o envio do arquivo de audio para o backend

    setStatus('generating');

    const videoId = response.data.video.id;

    await api.post(`/videos/${videoId}/transcription`, {
      prompt
    }); // gera a transcrição do audio

    setStatus('success');

    props.onVideoUploaded(videoId);
  }

  const videoPreviewURL = useMemo(() => {
    if (!videoFile) return null; // se videoFile for null recebe null

    return URL.createObjectURL(videoFile); // criar uma url de caminho para o arquivo enviado
  }, [videoFile]); // função que só é executada caso o videoFile seja alterado ( usuário altere o arquivo enviado, caso não seja enviado nenhum arquivo ele altera o valor para null )

  return (
    <form onSubmit={handleUploadVideo} className="space-y-6">
      <label
        htmlFor="video"
        className="border rounded-lg aspect-video cursor-pointer text-muted-foreground flex flex-col items-center justify-center text-sm gap-2 hover:bg-primary/10 relative"
      >
        {videoPreviewURL ? ( // caso existe um preview, ira mostra-lo, senão será mostrado apenas a mensagem de 'Carregar video'
          <video
            src={videoPreviewURL}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Carregar vídeo
          </>
        )}
      </label>
      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          disabled={status !== 'waiting'}
          id="transcription_prompt"
          className="h-20 resize-none leading-relaxed"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
          ref={promptInputRef}
        ></Textarea>
      </div>

      <Button
        data-success={status === 'success'}
        disabled={status !== 'waiting'}
        type="submit"
        className="w-full data-[success=true]:bg-emerald-400"
      >
        {status === 'waiting' ? (
          <>
            Carregar video <Upload className="w-4 h-4 ml-2" />
          </>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  );
}
