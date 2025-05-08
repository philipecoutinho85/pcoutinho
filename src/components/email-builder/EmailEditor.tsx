
import { Label } from "@/components/ui/label";

interface EmailEditorProps {
  content: string;
  setContent: (content: string) => void;
}

export function EmailEditor({ content, setContent }: EmailEditorProps) {
  return (
    <div className="mb-4">
      <Label className="text-white mb-2 block">Conteúdo do E-mail</Label>
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-3 h-64 overflow-y-auto">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full bg-transparent text-white resize-none focus:outline-none"
        />
      </div>
    </div>
  );
}
