
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Mail, 
  Send,
  Save,
  Lock
} from "lucide-react";

interface SmtpSettings {
  host: string;
  port: string;
  user: string;
  password: string;
  senderEmail: string;
  useTls: boolean;
}

export default function SmtpSettings() {
  const [settings, setSettings] = useState<SmtpSettings>({
    host: "",
    port: "587",
    user: "",
    password: "",
    senderEmail: "",
    useTls: true
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/settings/smtp', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao buscar configurações SMTP');
      }
      
      const data = await response.json();
      if (data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Erro ao buscar configurações SMTP:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações SMTP",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/settings/smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar configurações SMTP');
      }

      toast({
        title: "Configurações salvas",
        description: "As configurações SMTP foram salvas com sucesso"
      });
    } catch (error) {
      console.error('Erro ao salvar configurações SMTP:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações SMTP",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/settings/smtp/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "Teste bem-sucedido",
          description: "Conexão SMTP estabelecida com sucesso"
        });
      } else {
        toast({
          title: "Falha no teste",
          description: data.error || "Não foi possível conectar ao servidor SMTP",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro ao testar SMTP:', error);
      toast({
        title: "Erro",
        description: "Não foi possível realizar o teste de conexão SMTP",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Configurações SMTP</h1>
        <p className="text-gray-400">Configure seu servidor de e-mail para envio de campanhas</p>
      </header>
      
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="host" className="text-white mb-2 block">Servidor SMTP (Host)</Label>
            <Input
              id="host"
              value={settings.host}
              onChange={(e) => setSettings({...settings, host: e.target.value})}
              placeholder="Ex: smtp.gmail.com"
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
          
          <div>
            <Label htmlFor="port" className="text-white mb-2 block">Porta</Label>
            <Input
              id="port"
              value={settings.port}
              onChange={(e) => setSettings({...settings, port: e.target.value})}
              placeholder="Ex: 587"
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
          
          <div>
            <Label htmlFor="user" className="text-white mb-2 block">Usuário</Label>
            <Input
              id="user"
              value={settings.user}
              onChange={(e) => setSettings({...settings, user: e.target.value})}
              placeholder="Seu nome de usuário"
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="text-white mb-2 block">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="password"
                type="password"
                value={settings.password}
                onChange={(e) => setSettings({...settings, password: e.target.value})}
                placeholder="••••••••"
                className="pl-10 bg-gray-700 text-white border-gray-600"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="senderEmail" className="text-white mb-2 block">E-mail do Remetente</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="senderEmail"
                type="email"
                value={settings.senderEmail}
                onChange={(e) => setSettings({...settings, senderEmail: e.target.value})}
                placeholder="seu@email.com"
                className="pl-10 bg-gray-700 text-white border-gray-600"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-8">
            <input
              type="checkbox"
              id="useTls"
              checked={settings.useTls}
              onChange={(e) => setSettings({...settings, useTls: e.target.checked})}
              className="h-4 w-4 rounded border-gray-600 text-neon-purple focus:ring-neon-purple"
            />
            <Label htmlFor="useTls" className="text-white">Usar TLS/SSL</Label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            onClick={handleTestConnection}
            variant="outline"
            disabled={isTesting}
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            <Send className="h-4 w-4 mr-2" />
            {isTesting ? "Testando..." : "Testar Conexão"}
          </Button>
          
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-neon-purple hover:bg-neon-purple/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
        <h3 className="text-white font-medium mb-2 flex items-center">
          <Settings className="h-4 w-4 mr-2 text-gray-400" />
          Dicas de Configuração
        </h3>
        <ul className="text-gray-400 text-sm space-y-1 pl-6 list-disc">
          <li>Para o Gmail, use SMTP: smtp.gmail.com, Porta: 587</li>
          <li>Para o Outlook/Hotmail, use SMTP: smtp-mail.outlook.com, Porta: 587</li>
          <li>Para serviços como SendGrid, MailGun ou outros, consulte a documentação específica</li>
          <li>Certifique-se de que seu provedor permite o envio via SMTP</li>
          <li>Algumas contas podem precisar de configurações de "App Passwords" ou autenticação de 2 fatores</li>
        </ul>
      </div>
    </div>
  );
}
