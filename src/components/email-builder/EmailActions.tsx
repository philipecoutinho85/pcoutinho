
import { Button } from "@/components/ui/button";
import { CalendarClock, Send } from "lucide-react";

interface EmailActionsProps {
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  showSchedule: boolean;
  setShowSchedule: (show: boolean) => void;
  isSaving: boolean;
  handleSend: (isScheduled: boolean) => Promise<void>;
  campaignName: string;
  subject: string;
}

export function EmailActions({
  showPreview,
  setShowPreview,
  showSchedule,
  setShowSchedule,
  isSaving,
  handleSend,
  campaignName,
  subject
}: EmailActionsProps) {
  return (
    <div className="flex space-x-3 justify-end">
      <Button
        variant="outline"
        className="text-white bg-gray-700 hover:bg-gray-600 border-gray-600"
        onClick={() => setShowPreview(!showPreview)}
      >
        {showPreview ? "Ocultar Prévia" : "Ver Prévia"}
      </Button>
      <Button
        variant="outline"
        className="text-white bg-gray-700 hover:bg-gray-600 border-gray-600"
        onClick={() => setShowSchedule(!showSchedule)}
        disabled={isSaving}
      >
        <CalendarClock className="mr-2 h-4 w-4" />
        Agendar Envio
      </Button>
      <Button
        onClick={() => handleSend(false)}
        className="bg-purple-700 text-white hover:bg-purple-600"
        disabled={isSaving || !campaignName || !subject}
      >
        <Send className="mr-2 h-4 w-4" />
        Enviar Agora
      </Button>
    </div>
  );
}
