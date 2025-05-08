
import { useState, useEffect } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { 
  Settings, 
  LogIn, 
  Users, 
  Mail, 
  MailCheck,
  ChevronDown,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { testSupabaseConnection } from "@/lib/supabase";

const AdminLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'connected'|'error'|'checking'>('checking');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    // Verificar estado da conexão Supabase
    const checkSupabaseConnection = async () => {
      const { success } = await testSupabaseConnection();
      
      if (!success) {
        setOfflineMode(true);
        setSupabaseStatus('error');
        toast({
          title: "Erro de conexão com Supabase",
          description: "Operando em modo offline com dados de demonstração",
          variant: "destructive"
        });
      } else {
        setSupabaseStatus('connected');
        setOfflineMode(false);
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };
    
    checkSupabaseConnection();
    
    // Verificar se estamos em modo offline
    if (localStorage.getItem('offline_mode') === 'true') {
      setOfflineMode(true);
      toast({
        title: "Modo demonstração ativo",
        description: "Sistema operando com dados locais para demonstração"
      });
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('offline_mode');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso"
    });
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // O useEffect já redireciona para o login
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside 
        className={`bg-gray-800 text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } fixed h-full z-10`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className={`font-bold ${isSidebarOpen ? 'block' : 'hidden'}`}>
            Admin Panel
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-700"
          >
            <ChevronDown 
              className={`h-5 w-5 transition-transform ${isSidebarOpen ? 'rotate-0' : 'rotate-90'}`} 
            />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                <Users className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Leads</span>}
              </Link>
            </li>
            
            <li>
              <Link
                to="/admin/email-builder"
                className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                <Mail className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Construtor de E-mails</span>}
              </Link>
            </li>
            
            <li>
              <Link
                to="/admin/automations"
                className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                <MailCheck className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Automações</span>}
              </Link>
            </li>
            
            <li>
              <Link
                to="/admin/smtp"
                className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                <Send className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Configurações SMTP</span>}
              </Link>
            </li>
            
            <li>
              <Link
                to="/admin/settings"
                className="flex items-center p-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                <Settings className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Configurações</span>}
              </Link>
            </li>

            <li className="pt-4 mt-6 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-2 rounded-md hover:bg-gray-700 transition-colors text-red-400 hover:text-red-300"
              >
                <LogIn className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Sair</span>}
              </button>
            </li>
          </ul>
        </nav>
        
        {offlineMode && isSidebarOpen && (
          <div className="absolute bottom-0 left-0 w-full p-4 bg-amber-800/30">
            <p className="text-amber-200 text-xs text-center">Modo Demonstração</p>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
        {offlineMode && (
          <div className="bg-amber-900/20 border-l-4 border-amber-500 p-4 m-6 rounded">
            <Alert variant="destructive" className="bg-transparent border-0">
              <AlertTitle>Modo demonstração ativado</AlertTitle>
              <AlertDescription>
                O sistema está operando com dados locais para fins de demonstração.
                Algumas funcionalidades podem estar limitadas.
              </AlertDescription>
            </Alert>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
