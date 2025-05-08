
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Diretório para armazenar os dados
const DATA_DIR = path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');
const CAMPAIGNS_FILE = path.join(DATA_DIR, 'campaigns.json');
const TEMPLATES_FILE = path.join(DATA_DIR, 'templates.json');
const AUTOMATIONS_FILE = path.join(DATA_DIR, 'automations.json');

// Garantir que o diretório de dados existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Inicializar arquivos se não existirem
const initializeFile = (filePath, defaultContent) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent), 'utf8');
  }
};

// Inicializar arquivos com dados padrão
initializeFile(LEADS_FILE, []);
initializeFile(CAMPAIGNS_FILE, []);
initializeFile(TEMPLATES_FILE, []);
initializeFile(AUTOMATIONS_FILE, [{ 
  id: 'welcome-email',
  name: 'E-mail de Boas-Vindas',
  trigger: 'new-lead',
  active: true,
  emailTemplate: {
    subject: 'Bem-vindo à nossa comunidade!',
    content: '<h1>Olá {{name}},</h1><p>Obrigado por se inscrever em nossa newsletter.</p>'
  }
}]);

// Configuração do administrador com senha hash
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

initializeFile(ADMIN_FILE, {
  email: process.env.ADMIN_EMAIL || 'admin@seudominio.com.br',
  passwordHash: hashPassword(DEFAULT_PASSWORD),
  createdAt: new Date().toISOString()
});

// Middleware
app.use(cors()); // Habilita CORS para permitir requisições do frontend
app.use(bodyParser.json()); // Parse de requisições JSON

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Acesso não autorizado' });
  
  // Em um sistema real, você usaria JWT ou outro método seguro
  // Para este exemplo, usamos uma verificação simples
  if (token === process.env.API_SECRET || token === 'temp-secret-key') {
    next();
  } else {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// Rota de login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validação básica
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
  }
  
  try {
    // Ler dados do administrador
    const adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));
    
    // Verificar credenciais
    if (email === adminData.email && hashPassword(password) === adminData.passwordHash) {
      // Em um sistema real, você geraria um JWT ou outro token seguro
      return res.status(200).json({ 
        success: true, 
        token: process.env.API_SECRET || 'temp-secret-key',
        user: { email: adminData.email }
      });
    } else {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de recuperação de senha
app.post('/api/recover-password', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'E-mail é obrigatório' });
  }
  
  try {
    // Ler dados do administrador
    const adminData = JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));
    
    if (email === adminData.email) {
      // Em um sistema real, você enviaria um e-mail com um link de recuperação
      console.log(`Solicitação de recuperação de senha para: ${email}`);
      return res.status(200).json({ 
        success: true, 
        message: 'Se este e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.'
      });
    } else {
      // Por segurança, não informamos se o e-mail existe ou não
      return res.status(200).json({ 
        success: true, 
        message: 'Se este e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.'
      });
    }
  } catch (error) {
    console.error('Erro na recuperação de senha:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de inscrição (antigo /subscribe, agora apenas para capturar leads)
app.post('/subscribe', async (req, res) => {
  const { email, name } = req.body;

  // Validação básica
  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório' });
  }

  try {
    // Ler leads existentes
    let leads = [];
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    }
    
    // Verificar se o lead já existe
    const existingLead = leads.find(lead => lead.email === email);
    if (existingLead) {
      return res.status(200).json({ 
        success: true, 
        message: 'Inscrição já realizada',
        alreadySubscribed: true
      });
    }
    
    // Adicionar novo lead
    const newLead = {
      id: crypto.randomUUID(),
      email,
      name: name || '',
      createdAt: new Date().toISOString()
    };
    
    leads.push(newLead);
    
    // Salvar leads atualizados
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads), 'utf8');
    
    // Verificar se existe automação de boas-vindas ativa
    const automations = JSON.parse(fs.readFileSync(AUTOMATIONS_FILE, 'utf8'));
    const welcomeAutomation = automations.find(auto => 
      auto.active && auto.trigger === 'new-lead'
    );
    
    if (welcomeAutomation) {
      // Em um sistema real, você enviaria o e-mail de boas-vindas aqui
      console.log(`Enviando e-mail de boas-vindas para: ${email}`);
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Inscrição realizada com sucesso',
      leadId: newLead.id
    });
  } catch (error) {
    console.error('Erro ao processar inscrição:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    });
  }
});

// --- ROTAS PROTEGIDAS (REQUEREM AUTENTICAÇÃO) ---

// Obter todos os leads
app.get('/api/leads', authenticateToken, (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    res.status(200).json({ success: true, leads });
  } catch (error) {
    console.error('Erro ao obter leads:', error);
    res.status(500).json({ error: 'Erro ao obter leads' });
  }
});

// Exportar leads como CSV
app.get('/api/leads/export', authenticateToken, (req, res) => {
  try {
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    
    // Criar cabeçalho CSV
    let csv = 'ID,Nome,Email,Data de Inscrição\n';
    
    // Adicionar dados
    leads.forEach(lead => {
      const createdAt = new Date(lead.createdAt).toLocaleDateString('pt-BR');
      csv += `${lead.id},"${lead.name}",${lead.email},${createdAt}\n`;
    });
    
    // Configurar resposta como download de arquivo
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Erro ao exportar leads:', error);
    res.status(500).json({ error: 'Erro ao exportar leads' });
  }
});

// Obter todas as campanhas
app.get('/api/campaigns', authenticateToken, (req, res) => {
  try {
    const campaigns = JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf8'));
    res.status(200).json({ success: true, campaigns });
  } catch (error) {
    console.error('Erro ao obter campanhas:', error);
    res.status(500).json({ error: 'Erro ao obter campanhas' });
  }
});

// Criar nova campanha
app.post('/api/campaigns', authenticateToken, (req, res) => {
  const { name, subject, content, sendAt } = req.body;
  
  if (!name || !subject || !content) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }
  
  try {
    const campaigns = JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf8'));
    
    const newCampaign = {
      id: crypto.randomUUID(),
      name,
      subject,
      content,
      sendAt: sendAt || null,
      status: sendAt ? 'scheduled' : 'draft',
      createdAt: new Date().toISOString()
    };
    
    campaigns.push(newCampaign);
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns), 'utf8');
    
    res.status(201).json({ success: true, campaign: newCampaign });
  } catch (error) {
    console.error('Erro ao criar campanha:', error);
    res.status(500).json({ error: 'Erro ao criar campanha' });
  }
});

// Enviar campanha agora
app.post('/api/campaigns/:id/send', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  try {
    // Em um sistema real, aqui você enviaria os e-mails
    // Para este exemplo, apenas atualizamos o status
    const campaigns = JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf8'));
    const leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    
    const campaignIndex = campaigns.findIndex(c => c.id === id);
    if (campaignIndex === -1) {
      return res.status(404).json({ error: 'Campanha não encontrada' });
    }
    
    campaigns[campaignIndex].status = 'sent';
    campaigns[campaignIndex].sentAt = new Date().toISOString();
    campaigns[campaignIndex].sentToCount = leads.length;
    
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns), 'utf8');
    
    console.log(`Campanha ${id} enviada para ${leads.length} leads`);
    res.status(200).json({ success: true, message: `Campanha enviada para ${leads.length} leads` });
  } catch (error) {
    console.error('Erro ao enviar campanha:', error);
    res.status(500).json({ error: 'Erro ao enviar campanha' });
  }
});

// Obter templates de e-mail
app.get('/api/templates', authenticateToken, (req, res) => {
  try {
    const templates = JSON.parse(fs.readFileSync(TEMPLATES_FILE, 'utf8'));
    res.status(200).json({ success: true, templates });
  } catch (error) {
    console.error('Erro ao obter templates:', error);
    res.status(500).json({ error: 'Erro ao obter templates' });
  }
});

// Obter automações
app.get('/api/automations', authenticateToken, (req, res) => {
  try {
    const automations = JSON.parse(fs.readFileSync(AUTOMATIONS_FILE, 'utf8'));
    res.status(200).json({ success: true, automations });
  } catch (error) {
    console.error('Erro ao obter automações:', error);
    res.status(500).json({ error: 'Erro ao obter automações' });
  }
});

// Atualizar automação
app.put('/api/automations/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { active, name, emailTemplate } = req.body;
  
  try {
    const automations = JSON.parse(fs.readFileSync(AUTOMATIONS_FILE, 'utf8'));
    const automationIndex = automations.findIndex(a => a.id === id);
    
    if (automationIndex === -1) {
      return res.status(404).json({ error: 'Automação não encontrada' });
    }
    
    // Atualizar propriedades
    if (active !== undefined) automations[automationIndex].active = active;
    if (name) automations[automationIndex].name = name;
    if (emailTemplate) automations[automationIndex].emailTemplate = emailTemplate;
    
    fs.writeFileSync(AUTOMATIONS_FILE, JSON.stringify(automations), 'utf8');
    res.status(200).json({ success: true, automation: automations[automationIndex] });
  } catch (error) {
    console.error('Erro ao atualizar automação:', error);
    res.status(500).json({ error: 'Erro ao atualizar automação' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Admin padrão: ${process.env.ADMIN_EMAIL || 'admin@seudominio.com.br'}`);
  console.log('Por favor, altere a senha padrão assim que possível!');
});
