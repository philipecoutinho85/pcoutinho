
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com as credenciais corretas do projeto LP-Pcoutinho
const supabaseUrl = 'https://ytbkksaqzqcknumztvqw.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0Ymtrc2FxenFja251bXp0dnF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNTU0OTksImV4cCI6MjA2MTczMTQ5OX0.gy4to1e9XwkGRYORJ16SNm4btcZFcjyKmrZ4LOWl2YY';

// Criação do cliente Supabase com opções avançadas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  global: {
    fetch: (url, options) => {
      // Adicionando logs para depuração
      console.log('Fazendo requisição para Supabase:', url);
      return fetch(url, options);
    }
  }
});

// Função auxiliar para validar a conexão
export const testSupabaseConnection = async () => {
  try {
    // Verifica se a tabela 'leads' existe
    const { error } = await supabase
      .from('leads')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Erro na conexão com Supabase:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (err) {
    console.error('Exceção ao testar conexão Supabase:', err);
    return { success: false, error: err };
  }
};

// Função para excluir um lead pelo email (já que parece que o id é null)
export const deleteLeadByEmail = async (email: string) => {
  try {
    console.log(`Tentando excluir lead com email: ${email}`);
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('email', email);
    
    if (error) {
      console.error('Erro ao excluir lead do Supabase:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (err) {
    console.error('Exceção ao excluir lead:', err);
    return { success: false, error: err };
  }
};
