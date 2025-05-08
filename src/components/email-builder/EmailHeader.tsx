
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailHeaderProps {
  campaignName: string;
  setCampaignName: (value: string) => void;
  subject: string;
  setSubject: (value: string) => void;
}

export function EmailHeader({ 
  campaignName, 
  setCampaignName, 
  subject, 
  setSubject 
}: EmailHeaderProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4">
      <div>
        <Label htmlFor="campaign-name" className="text-white mb-2 block">Nome da Campanha</Label>
        <Input
          id="campaign-name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          placeholder="Ex: Newsletter de Julho"
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>

      <div>
        <Label htmlFor="subject" className="text-white mb-2 block">Assunto do E-mail</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ex: Novidades da semana"
          className="bg-gray-700 text-white border-gray-600"
        />
      </div>
    </div>
  );
}
