
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Mail } from "lucide-react";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [email, setEmail] = useState(() => localStorage.getItem('user_email') || 'admin@seudominio.com.br');
  const { toast } = useToast();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!currentPassword) {
      toast({
        title: "Campo obrigatório",
        description: "A senha atual é obrigatória",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas diferentes",
        description: "A nova senha e a confirmação não conferem",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    
    // Aqui seria feita a chamada para a API para alterar a senha
    // Para o exemplo, vamos apenas simular uma resposta de sucesso
    
    setTimeout(() => {
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso"
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsUpdating(false);
    }, 1500);
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-gray-400">Gerencie as configurações da sua conta</p>
      </header>

      <div className="grid grid-cols-1 gap-8 max-w-xl">
        {/* Informações do usuário */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Informações do Usuário</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="user-email" className="text-white mb-2 block">E-mail do Administrador</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="user-email"
                  type="email"
                  value={email}
                  disabled
                  className="pl-10 bg-gray-700/50 text-gray-400 border-gray-600 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                O e-mail de administrador não pode ser alterado nesta versão.
              </p>
            </div>
          </div>
        </div>
        
        {/* Alterar senha */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Alterar Senha</h2>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="current-password" className="text-white mb-2 block">Senha Atual</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-700 text-white border-gray-600"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowCurrent(!showCurrent)}
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="new-password" className="text-white mb-2 block">Nova Senha</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-700 text-white border-gray-600"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowNew(!showNew)}
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="confirm-password" className="text-white mb-2 block">Confirmar Nova Senha</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-700 text-white border-gray-600"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="bg-neon-purple hover:bg-neon-purple/90 mt-2"
              disabled={isUpdating}
            >
              {isUpdating ? 'Atualizando...' : 'Alterar Senha'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
