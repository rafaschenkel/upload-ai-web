import { Button } from './components/ui/button';
import { Github, Wand2 } from 'lucide-react';
import { Separator } from './components/ui/separator';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './components/ui/select';
import { Slider } from './components/ui/slider';
import VideoInputForm from './components/video-input-form';
import { PromptSelect } from './components/prompt-select';
import { useState } from 'react';
import { useCompletion } from 'ai/react';

export function App() {
  const [temperature, setTemperature] = useState(0.5);
  const [videoId, setVideoId] = useState<string | null>(null);

  const { input, setInput, handleInputChange, handleSubmit, completion, isLoading } = useCompletion(
    {
      api: 'http://localhost:3333/ai/complete',
      body: {
        videoId,
        temperature
      },
      headers: {
        'Content-type': 'application/json'
      }
    }
  );

  return (
    <div className="min-h-screen flex flex-col max-w-6xl mx-auto">
      <header className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 💜 no NLW da Rocketseat
          </span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant={'outline'} className="text-violet-500 hover:bg-violet-700">
            <Github className="w-4 h-4 mr-2" />
            Github
          </Button>
        </div>
      </header>
      <main className="p-6 flex gap-6 flex-1">
        <div className="flex flex-col gap-4 flex-1">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              placeholder="Insira o prompt para a IA..."
              className="p-3 resize-none leading-relaxed"
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              placeholder="Resultado gerado pela IA..."
              className="p-3 resize-none leading-relaxed"
              readOnly
              value={completion}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável transcription no seu prompt para adicionar o
            conteúdo da <code className="text-violet-500 font-bold">{'{transcrição}'}</code> do
            vídeo selecionado.
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoId} />

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput} />
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                Você poderá customizar essa opção em breve.
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="flex justify-between">
                Temperatura <span>{temperature}</span>
              </Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={value => setTemperature(value[0])}
              />
              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Valores mais altos tendem a deixar o resultado mais criativo, porém com possíveis
                erros.
              </span>
            </div>

            <Separator />

            <Button disabled={isLoading} type="submit" className="w-full">
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
