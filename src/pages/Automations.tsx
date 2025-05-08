
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailCheck, Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  active: boolean;
  emailTemplate: {
    subject: string;
    content: string;
  };
}

// Dados de exemplo para quando não houver conexão com o Supabase
const mockAutomations: Automation[] = [
  {
    id: "1",
    name: "Boas-vindas",
    trigger: "new-lead",
    active: true,
    emailTemplate: {
      subject: "Bem-vindo(a) à nossa comunidade!",
      content: "Olá {name},\n\nObrigado por se juntar à nossa comunidade! Estamos muito felizes em tê-lo(a) conosco.\n\nEm breve você receberá conteúdos exclusivos sobre liderança e inovação."
    }
  },
  {
    id: "2",
    name: "Follow-up",
    trigger: "after-7-days",
    active: false,
    emailTemplate: {
      subject: "Como está sendo sua experiência?",
      content: "Olá {name},\n\nComo está sendo sua experiência com nosso conteúdo até agora? Estamos aqui para ajudar em sua jornada de aprendizado."
    }
  }
];

export default function Automations() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    setIsLoading(true);
    try {
      // Tenta buscar do Supabase primeiro
      try {
        const { data, error } = await supabase
          .from('automations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setAutomations(data);
          return;
        }
      } catch (supabaseError) {
        console.error('Erro ao buscar automações do Supabase:', supabaseError);
      }
      
      // Se não conseguir dados do Supabase, usa dados mockados
      setAutomations(mockAutomations);
      
    } catch (error) {
      console.error('Erro ao buscar automações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as automações. Usando dados de exemplo.",
        variant: "destructive"
      });
      setAutomations(mockAutomations);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAutomation = async (automation: Automation) => {
    try {
      const updatedAutomation = {...automation, active: !automation.active};
      
      try {
        const { error } = await supabase
          .from('automations')
          .update({ active: !automation.active })
          .eq('id', automation.id);
        
        if (error) throw error;
      } catch (supabaseError) {
        console.error('Erro ao atualizar automação no Supabase:', supabaseError);
      }

      setAutomations(prevAutomations => prevAutomations.map(a => 
        a.id === automation.id ? { ...a, active: !a.active } : a
      ));

      toast({
        title: "Automação atualizada",
        description: `Automação ${!automation.active ? 'ativada' : 'desativada'} com sucesso`
      });
    } catch (error) {
      console.error('Erro ao atualizar automação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a automação",
        variant: "destructive"
      });
    }
  };

  const handleEditAutomation = (automation: Automation) => {
    setEditingAutomation({...automation});
  };

  const handleSaveAutomation = async () => {
    if (!editingAutomation) return;

    setIsSaving(true);
    try {
      try {
        const { error } = await supabase
          .from('automations')
          .update({
            name: editingAutomation.name,
            emailTemplate: editingAutomation.emailTemplate
          })
          .eq('id', editingAutomation.id);
        
        if (error) throw error;
      } catch (supabaseError) {
        console.error('Erro ao salvar automação no Supabase:', supabaseError);
      }

      setAutomations(prevAutomations => prevAutomations.map(a => 
        a.id === editingAutomation.id ? editingAutomation : a
      ));

      toast({
        title: "Automação salva",
        description: "Configurações da automação salvas com sucesso"
      });
      
      setEditingAutomation(null);
    } catch (error) {
      console.error('Erro ao salvar automação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a automação",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateAutomation = async () => {
    const newAutomation: Omit<Automation, 'id'> = {
      name: "Nova Automação",
      trigger: "new-lead",
      active: false,
      emailTemplate: {
        subject: "Novo assunto",
        content: "Conteúdo do email aqui. Use {name} para incluir o nome do lead."
      }
    };

    try {
      let newId = String(Date.now());
      
      try {
        const { data, error } = await supabase
          .from('automations')
          .insert([newAutomation])
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          setAutomations(prev => [data[0], ...prev]);
          toast({
            title: "Automação criada",
            description: "Nova automação criada com sucesso"
          });
          return;
        }
      } catch (supabaseError) {
        console.error('Erro ao criar automação no Supabase:', supabaseError);
      }
      
      // Fallback para criação local se Supabase falhar
      setAutomations(prev => [{
        id: newId,
        ...newAutomation
      }, ...prev]);
      
      toast({
        title: "Automação criada",
        description: "Nova automação criada localmente"
      });
    } catch (error) {
      console.error('Erro ao criar automação:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a automação",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Automações</h1>
        <p className="text-gray-400">Configure suas automações de e-mail</p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <div></div>
        <Button
          onClick={handleCreateAutomation}
          className="bg-purple-700 hover:bg-purple-600 text-white"
        >
          Nova Automação
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">
          <p>Carregando automações...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {automations.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
              <MailCheck className="h-12 w-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">Nenhuma automação configurada</p>
              <p className="text-gray-500 text-sm mt-2">Crie sua primeira automação para enviar e-mails automaticamente a seus leads</p>
            </div>
          ) : (
            automations.map(automation => (
              <div 
                key={automation.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 ${
                      automation.active 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      <MailCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white">{automation.name}</h3>
                      <p className="text-gray-400 mt-1">
                        Gatilho: {automation.trigger === 'new-lead' ? 'Novo lead cadastrado' : automation.trigger}
                      </p>
                      <div className="mt-3 flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${
                          automation.active ? 'bg-green-500' : 'bg-gray-500'
                        }`}></div>
                        <span className={`text-sm ${
                          automation.active ? 'text-green-500' : 'text-gray-500'
                        }`}>
                          {automation.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="border-gray-600 text-white bg-gray-700 hover:bg-gray-600"
                      onClick={() => handleEditAutomation(automation)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configurar
                    </Button>
                    <Button
                      variant={automation.active ? "destructive" : "outline"}
                      className={automation.active 
                        ? "" 
                        : "border-gray-600 bg-green-600/20 text-green-500 hover:bg-green-600/30"
                      }
                      onClick={() => handleToggleAutomation(automation)}
                    >
                      {automation.active ? 'Desativar' : 'Ativar'}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal de edição */}
      {editingAutomation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 w-full max-w-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-4">Configurar Automação</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="automation-name" className="text-white mb-2 block">Nome da Automação</Label>
                <Input
                  id="automation-name"
                  value={editingAutomation.name}
                  onChange={(e) => setEditingAutomation({
                    ...editingAutomation,
                    name: e.target.value
                  })}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              
              <div>
                <Label htmlFor="email-subject" className="text-white mb-2 block">Assunto do E-mail</Label>
                <Input
                  id="email-subject"
                  value={editingAutomation.emailTemplate.subject}
                  onChange={(e) => setEditingAutomation({
                    ...editingAutomation,
                    emailTemplate: {
                      ...editingAutomation.emailTemplate,
                      subject: e.target.value
                    }
                  })}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              
              <div>
                <Label htmlFor="email-content" className="text-white mb-2 block">Conteúdo do E-mail</Label>
                <div className="bg-gray-700 rounded-lg border border-gray-600 p-3 h-64">
                  <textarea
                    id="email-content"
                    value={editingAutomation.emailTemplate.content}
                    onChange={(e) => setEditingAutomation({
                      ...editingAutomation,
                      emailTemplate: {
                        ...editingAutomation.emailTemplate,
                        content: e.target.value
                      }
                    })}
                    className="w-full h-full bg-transparent text-white resize-none focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Você pode usar {"{"}name{"}"} para incluir o nome do lead.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  className="border-gray-600 text-white bg-gray-700 hover:bg-gray-600"
                  onClick={() => setEditingAutomation(null)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveAutomation}
                  className="bg-purple-700 hover:bg-purple-600 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
