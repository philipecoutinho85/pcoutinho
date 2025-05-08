
import { useEmailBuilder } from "@/hooks/useEmailBuilder";
import { EmailHeader } from "@/components/email-builder/EmailHeader";
import { ContentBlocks } from "@/components/email-builder/ContentBlocks";
import { EmailEditor } from "@/components/email-builder/EmailEditor";
import { EmailActions } from "@/components/email-builder/EmailActions";
import { EmailPreview } from "@/components/email-builder/EmailPreview";
import { ScheduleForm } from "@/components/email-builder/ScheduleForm";

export default function EmailBuilder() {
  const {
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
  } = useEmailBuilder();

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Construtor de E-mails</h1>
        <p className="text-gray-400">Crie e envie campanhas de e-mail para seus leads</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Painel de edição */}
        <div className="lg:col-span-2 space-y-6">
          <EmailHeader 
            campaignName={campaignName}
            setCampaignName={setCampaignName}
            subject={subject}
            setSubject={setSubject}
          />

          <div className="space-y-6">
            <ContentBlocks addElement={addElement} />
            
            <EmailEditor 
              content={content}
              setContent={setContent}
            />
          </div>

          <EmailActions 
            showPreview={showPreview}
            setShowPreview={setShowPreview}
            showSchedule={showSchedule}
            setShowSchedule={setShowSchedule}
            isSaving={isSaving}
            handleSend={handleSend}
            campaignName={campaignName}
            subject={subject}
          />

          <ScheduleForm 
            showSchedule={showSchedule}
            scheduleDate={scheduleDate}
            setScheduleDate={setScheduleDate}
            setShowSchedule={setShowSchedule}
            isSaving={isSaving}
            handleSend={handleSend}
          />
        </div>

        {/* Prévia */}
        <EmailPreview 
          subject={subject}
          content={content}
          showPreview={showPreview}
        />
      </div>
    </div>
  );
}
