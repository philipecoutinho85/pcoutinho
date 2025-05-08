import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, Mail, User, Users, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase, deleteLeadByEmail } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Lead {
  id: string | null;
  name: string;
  email: string;
  createdAt: string;
}

// Mock data para quando a API falhar
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@example.com",
    createdAt: "2025-04-20T10:30:00Z"
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao.santos@example.com",
    createdAt: "2025-04-18T14:45:00Z"
  },
  {
    id: "3",
    name: "Ana Oliveira",
    email: "ana.oliveira@example.com",
    createdAt: "2025-04-15T09:15:00Z"
  }
];

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    setApiError(false);
    try {
      // Tenta buscar do Supabase
      try {
        console.log("Iniciando busca de leads no Supabase...");
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar leads do Supabase:', error);
          throw error;
        }

        if (data) {
          console.log("Dados recebidos do Supabase:", data);
          const formattedLeads = data.map(lead => ({
            id: lead.id || lead.uid || String(lead.lead_id),
            name: lead.name || lead.nome || "",
            email: lead.email || "",
            createdAt: lead.created_at || lead.timestamp || new Date().toISOString()
          }));
          setLeads(formattedLeads);
          setApiError(false);
          return;
        }
      } catch (supabaseError) {
        console.error('Erro ao buscar leads do Supabase:', supabaseError);

        // Tenta buscar da API como fallback
        try {
          const token = localStorage.getItem('auth_token');
          
          const response = await fetch('/api/leads', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Falha ao buscar leads');
          }
          
          const data = await response.json();
          setLeads(data.leads || []);
          setApiError(false);
        } catch (apiError) {
          console.error('Erro ao buscar leads da API:', apiError);
          
          // Tenta pegar do localStorage como último fallback
          const fallbackLeads = JSON.parse(localStorage.getItem('fallbackLeads') || '[]');
          if (fallbackLeads.length > 0) {
            setLeads(fallbackLeads);
            setApiError(false);
          } else {
            // Se tudo falhar, usa dados mock
            setApiError(true);
            setLeads(mockLeads);
            
            toast({
              title: "Erro ao carregar dados",
              description: "Não foi possível acessar a lista de leads. Usando dados de demonstração. (Código: LEAD_FETCH_ERROR)",
              variant: "destructive"
            });
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteLead = (lead: Lead) => {
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const deleteLead = async () => {
    if (!leadToDelete) return;
    
    setIsDeleting(true);
    
    try {
      if (apiError) {
        // Se estamos usando dados mock, simulamos a exclusão
        setLeads(prev => prev.filter(lead => lead.id !== leadToDelete.id));
        toast({
          title: "Lead removido",
          description: "O lead foi removido com sucesso (modo demonstração).",
        });
        setDeleteDialogOpen(false);
        return;
      }
      
      // Como vimos que o ID é null nos logs, vamos excluir pelo email que é único
      const { success, error } = await deleteLeadByEmail(leadToDelete.email);
      
      if (!success) {
        throw error;
      }
      
      // Atualiza a lista local apenas removendo o lead excluído
      setLeads(prev => prev.filter(lead => lead.email !== leadToDelete.email));
      
      toast({
        title: "Lead removido",
        description: "O lead foi removido com sucesso.",
      });
      
    } catch (error) {
      console.error('Erro ao excluir lead:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o lead. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    }
  };

  const handleExportCSV = async () => {
    try {
      if (apiError) {
        // Se estamos em modo de dados mockados, oferecemos download direto
        const csvContent = "data:text/csv;charset=utf-8," + 
          "ID,Nome,Email,Data de Inscrição\n" +
          mockLeads.map(lead => {
            const date = new Date(lead.createdAt).toLocaleDateString('pt-BR');
            return `${lead.id},"${lead.name}",${lead.email},${date}`;
          }).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "leads.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Exportação concluída",
          description: "Dados de demonstração exportados com sucesso."
        });
        return;
      }
      
      // Export from real data
      const csvContent = "data:text/csv;charset=utf-8," + 
        "ID,Nome,Email,Data de Inscrição\n" +
        leads.map(lead => {
          const date = new Date(lead.createdAt).toLocaleDateString('pt-BR');
          return `${lead.id},"${lead.name}",${lead.email},${date}`;
        }).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "leads.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportação concluída",
        description: "Leads exportados com sucesso."
      });
    } catch (error) {
      console.error('Erro ao exportar leads:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os leads. (Código: EXPORT_ERROR)",
        variant: "destructive"
      });
    }
  };

  const handleCreateCampaign = () => {
    window.location.href = '/admin/email-builder';
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + 
           date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Gerencie seus leads e campanhas</p>
      </header>

      {apiError && (
        <Alert variant="destructive" className="mb-6 bg-amber-900/40 border-amber-700 text-amber-200">
          <AlertTitle>Aviso: Usando dados de demonstração</AlertTitle>
          <AlertDescription>
            Não foi possível conectar ao servidor. Os dados exibidos são apenas para demonstração.
            Verifique sua conexão ou a disponibilidade do servidor.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 mb-1">Total de Leads</p>
              <h2 className="text-3xl font-bold text-white">{leads.length}</h2>
            </div>
            <div className="bg-purple-700/20 p-4 rounded-full">
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Lista de Leads</h2>
        <div className="flex gap-3">
          <Button
            onClick={handleExportCSV}
            className="bg-gray-700 hover:bg-gray-600"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button
            onClick={handleCreateCampaign}
            className="bg-purple-700 hover:bg-purple-600"
          >
            <Mail className="mr-2 h-4 w-4" />
            Criar Campanha
          </Button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">
            Carregando leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum lead cadastrado ainda</p>
            <p className="text-sm mt-2">Os leads aparecerão aqui quando as pessoas se inscreverem no seu site</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">Nome</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Data de Inscrição</TableHead>
                  <TableHead className="text-gray-300 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium text-white">
                      {lead.name || "Não informado"}
                    </TableCell>
                    <TableCell className="text-white">{lead.email}</TableCell>
                    <TableCell className="text-gray-400">
                      {formatDate(lead.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => confirmDeleteLead(lead)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Diálogo de confirmação para exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o lead {leadToDelete?.name || leadToDelete?.email}?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={deleteLead}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
