import { Button } from './components/ui/button';
import { Github, FileVideo, Upload, Wand2 } from 'lucide-react';
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

export function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Desenvolvido com 🤍 no NLW da Rocketseat
          </span>

          <Separator orientation="vertical" className="h-6" />

          <Button variant={'outline'} className="text-red-500 hover:bg-red-700">
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
            />
            <Textarea
              placeholder="Resultado gerado pela IA..."
              className="p-3 resize-none leading-relaxed"
              readOnly
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Lembre-se: você pode utilizar a variável transcription no seu prompt para adicionar o
            conteúdo da <code className="text-red-500 font-bold">{'{transcrição}'}</code> do vídeo
            selecionado.
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <form className="space-y-6">
            <label
              htmlFor="video"
              className="border rounded-lg aspect-video cursor-pointer text-muted-foreground flex flex-col items-center justify-center text-sm gap-2 hover:bg-primary/10"
            >
              <FileVideo className="w-4 h-4" />
              Carregar vídeo
            </label>
            <input type="file" id="video" accept="video/mp4" className="sr-only" />

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
              <Textarea
                id="transcription_prompt"
                className="h-20 resize-none leading-relaxed"
                placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
              ></Textarea>
            </div>

            <Button type="submit" className="w-full">
              Carregar Vídeo <Upload className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <Separator />

          <form className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prompt..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Título do YouTube</SelectItem>
                  <SelectItem value="description">Descrição do YouTube</SelectItem>
                  <SelectItem disabled value="more-options">
                    Mais opções em breve
                  </SelectItem>
                </SelectContent>
              </Select>
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
              <Label>Temperatura</Label>
              <Slider min={0} max={1} step={0.1} />
              <span className="block text-xs text-muted-foreground italic leading-relaxed">
                Valores mais altos tendem a deixar o resultado mais criativo, porém com possíveis
                erros.
              </span>
            </div>

            <Separator />

            <Button type="submit" className="w-full">
              Executar
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  );
}
