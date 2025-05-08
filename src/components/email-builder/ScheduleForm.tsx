
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScheduleFormProps {
  showSchedule: boolean;
  scheduleDate: string;
  setScheduleDate: (date: string) => void;
  setShowSchedule: (show: boolean) => void;
  isSaving: boolean;
  handleSend: (isScheduled: boolean) => Promise<void>;
}

export function ScheduleForm({
  showSchedule,
  scheduleDate,
  setScheduleDate,
  setShowSchedule,
  isSaving,
  handleSend
}: ScheduleFormProps) {
  if (!showSchedule) return null;

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 space-y-4 animate-fade-in">
      <h3 className="text-white text-lg font-medium">Agendar Envio</h3>
      <div>
        <Label htmlFor="schedule-date" className="text-white mb-2 block">Data e Hora</Label>
        <Input
          id="schedule-date"
          type="datetime-local"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          className="bg-gray-700 text-white border-gray-600"
          min={new Date().toISOString().slice(0, 16)}
        />
      </div>
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          className="text-white bg-gray-700 hover:bg-gray-600 border-gray-600"
          onClick={() => setShowSchedule(false)}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => handleSend(true)}
          className="bg-purple-700 text-white hover:bg-purple-600"
          disabled={isSaving || !scheduleDate}
        >
          Confirmar Agendamento
        </Button>
      </div>
    </div>
  );
}
