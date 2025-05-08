
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Credenciais fixas para esse protótipo
    const validEmail = "philipecoutinhor@gmail.com";
    const validPassword = "30061985";

    try {
      // Na versão final, isso seria substituído por uma chamada à API
      if (email === validEmail && password === validPassword) {
        // Simular um token de autenticação
        const mockToken = "auth_token_" + Math.random().toString(36).substring(2);
        
        // Salvar token no localStorage
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('user_email', email);
        
        toast({
          title: "Login bem-sucedido",
          description: "Redirecionando para o painel..."
        });
        
        // Redirecionar para o dashboard
        navigate('/admin/dashboard');
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Credenciais inválidas",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível processar seu login",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular o envio de um e-mail de recuperação
      // Em uma implementação real, isso seria uma chamada à API
      
      // Aguardar um pouco para simular o processamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verificar se é o e-mail autorizado
      if (email === "philipecoutinhor@gmail.com") {
        toast({
          title: "Recuperação solicitada",
          description: "Se o e-mail existir em nossa base, você receberá instruções para redefinir sua senha."
        });
      } else {
        toast({
          title: "Recuperação solicitada",
          description: "Se o e-mail existir em nossa base, você receberá instruções para redefinir sua senha."
        });
      }
      
      // Voltar para o modo de login
      setRecoveryMode(false);
    } catch (error) {
      console.error("Erro ao solicitar recuperação:", error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível processar sua solicitação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-black/70 backdrop-blur-md p-8 rounded-xl border border-neon-purple/30 shadow-lg animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">Área Administrativa</h1>
          <p className="text-gray-400 mt-2">
            {recoveryMode 
              ? "Insira seu e-mail para recuperar sua senha" 
              : "Entre com suas credenciais para acessar o painel"}
          </p>
        </div>

        <form onSubmit={recoveryMode ? handleRecoveryRequest : handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="pl-10 bg-white/10 border-neon-purple/30 text-white placeholder:text-white/50"
              />
            </div>
          </div>
          
          {!recoveryMode && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10 bg-white/10 border-neon-purple/30 text-white placeholder:text-white/50"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-neon-purple hover:bg-neon-purple/90 text-white font-medium py-5 rounded-lg transition-all duration-200"
          >
            {loading 
              ? "Processando..." 
              : recoveryMode 
                ? "Enviar instruções" 
                : "Entrar"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setRecoveryMode(!recoveryMode)}
            className="text-neon-purple hover:text-neon-purple/80 text-sm"
          >
            {recoveryMode 
              ? "Voltar para o login" 
              : "Esqueceu sua senha?"}
          </button>
        </div>
      </div>
    </div>
  );
}
