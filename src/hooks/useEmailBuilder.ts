
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export type EmailElement = {
  name: string;
  icon: React.ReactNode;
  template: string;
};

export function useEmailBuilder() {
  const [campaignName, setCampaignName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("<h1>Olá!</h1><p>Digite seu conteúdo aqui...</p>");
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const { toast } = useToast();

  const addElement = (template: string) => {
    setContent(prevContent => prevContent + template);
  };

  const handleSend = async (isScheduled = false) => {
    if (!campaignName || !subject || !content) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Salvar no Supabase
      const { data, error } = await supabase
        .from('campaigns')
        .insert([
          { 
            name: campaignName, 
            subject, 
            content,
            scheduled_for: isScheduled ? scheduleDate : null,
            status: isScheduled ? 'scheduled' : 'sent'
          }
        ])
        .select();

      if (error) throw error;
      
      toast({
        title: "Campanha criada",
        description: isScheduled ? "Sua campanha foi agendada com sucesso" : "Sua campanha foi criada com sucesso"
      });

      // Limpar os campos após o envio
      setCampaignName("");
      setSubject("");
      setContent("<h1>Olá!</h1><p>Digite seu conteúdo aqui...</p>");
    } catch (error) {
      console.error('Erro ao enviar campanha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a campanha",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
      setShowSchedule(false);
    }
  };

  return {
    campaignName,
    setCampaignName,
    subject,
    setSubject,
    content,
    setContent,
    showPreview,
    setShowPreview,
    isSaving,
    showSchedule,
    setShowSchedule,
    scheduleDate,
    setScheduleDate,
    addElement,
    handleSend
  };
}
