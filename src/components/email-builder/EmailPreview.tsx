
import { Mail } from "lucide-react";

interface EmailPreviewProps {
  subject: string;
  content: string;
  showPreview: boolean;
}

export function EmailPreview({ subject, content, showPreview }: EmailPreviewProps) {
  return (
    <div className={`bg-gray-800 rounded-xl border border-gray-700 overflow-hidden transition-all ${
      showPreview ? 'block' : 'hidden lg:block'
    }`}>
      <div className="bg-gray-700 p-4 border-b border-gray-600">
        <div className="flex items-center space-x-3">
          <Mail className="text-purple-600 h-5 w-5" />
          <h3 className="text-white font-medium">Visualização do E-mail</h3>
        </div>
      </div>
      <div className="p-4 h-[calc(100%-56px)] overflow-auto bg-white rounded-b-xl">
        <div className="bg-white p-4 rounded">
          <div className="text-black mb-4">
            <div><strong>Assunto:</strong> {subject || "Sem assunto"}</div>
            <div><strong>De:</strong> Seu Nome &lt;contato@seudominio.com&gt;</div>
            <div><strong>Para:</strong> Seus Leads</div>
          </div>
          <hr className="my-4 border-gray-200" />
          <div 
            className="email-preview text-black" 
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
