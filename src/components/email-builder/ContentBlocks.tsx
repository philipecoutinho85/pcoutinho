
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Image as ImageIcon, 
  SquareTerminal 
} from "lucide-react";
import { EmailElement } from "@/hooks/useEmailBuilder";

interface ContentBlocksProps {
  addElement: (template: string) => void;
}

export function ContentBlocks({ addElement }: ContentBlocksProps) {
  // Elementos disponíveis para o construtor
  const elements: EmailElement[] = [
    { name: "Título", icon: <FileText className="h-5 w-5" />, template: "<h1>Seu título aqui</h1>" },
    { name: "Texto", icon: <FileText className="h-5 w-5" />, template: "<p>Seu parágrafo aqui</p>" },
    { name: "Imagem", icon: <ImageIcon className="h-5 w-5" />, template: "<img src=\"https://via.placeholder.com/600x300\" alt=\"Imagem\" style=\"max-width:100%;height:auto;\">" },
    { name: "Botão", icon: <SquareTerminal className="h-5 w-5" />, template: "<a href=\"#\" style=\"display:inline-block;padding:10px 20px;background:#9966ff;color:white;text-decoration:none;border-radius:5px;margin:10px 0;\">Clique Aqui</a>" },
    { name: "Espaçamento", icon: <FileText className="h-5 w-5" />, template: "<div style=\"height:20px;width:100%;\"></div>" },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <Label className="text-white text-lg">Blocos de Conteúdo</Label>
      </div>
      
      <div className="grid grid-cols-5 gap-3 mb-6">
        {elements.map((element, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => addElement(element.template)}
            className="flex flex-col justify-center items-center h-20 bg-white text-gray-800 hover:bg-gray-100 hover:border-neon-purple"
          >
            <div className="text-purple-600 mb-1">{element.icon}</div>
            <span className="text-gray-800 text-xs">{element.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
