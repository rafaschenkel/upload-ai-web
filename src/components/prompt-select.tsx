import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { api } from '@/lib/api';

interface IPrompts {
  id: string;
  title: string;
  template: string;
}

interface IPromptSelectProps {
  onPromptSelected: (template: string) => void;
}

export function PromptSelect(props: IPromptSelectProps) {
  // recebe a função por props
  const [prompts, setPrompts] = useState<IPrompts[] | null>(null);

  function handlePromptSelected(promptID: string) {
    const selectPrompt = prompts?.find(prompt => prompt.id === promptID); // busca o prompt pelo id informado

    if (!selectPrompt) return;

    props.onPromptSelected(selectPrompt.template); // envia para a função o templete do prompt
  }

  useEffect(() => {
    api.get('/prompts').then(response => {
      setPrompts(response.data);
    });
  }, []); // faz a chamada para a api assim que o componente é carregado, buscando os prompts do bd

  return (
    <Select onValueChange={handlePromptSelected}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um prompt..." />
      </SelectTrigger>
      <SelectContent>
        {prompts?.map(prompt => {
          return (
            <SelectItem disabled={prompt.title === 'Em breve'} key={prompt.id} value={prompt.id}>
              {prompt.title}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
