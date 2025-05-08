
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface EmailFormProps {
  defaultName?: string;
  defaultEmail?: string;
  language?: 'pt' | 'en';
}

export function EmailForm({ defaultName, defaultEmail, language = 'pt' }: EmailFormProps) {
  const [name, setName] = useState(defaultName || '');
  const [email, setEmail] = useState(defaultEmail || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Tradução de textos baseado no idioma
  const texts = {
    nameLabel: language === 'pt' ? 'Nome (Opcional)' : 'Name (Optional)',
    emailLabel: language === 'pt' ? 'Email' : 'Email',
    namePlaceholder: language === 'pt' ? 'Seu nome' : 'Your name',
    emailPlaceholder: language === 'pt' ? 'Seu melhor e-mail' : 'Your best email',
    submitButton: language === 'pt' ? 'Quero liderar o futuro' : 'I want to lead the future',
    loadingButton: language === 'pt' ? 'Enviando...' : 'Sending...',
    successMessage: language === 'pt' ? 'Sucesso!' : 'Success!',
    successDescription: language === 'pt' ? 'Obrigado! Em breve você receberá nossos insights exclusivos.' : 'Thank you! You will soon receive our exclusive insights.',
    errorEmptyEmail: language === 'pt' ? 'Por favor, insira seu e-mail' : 'Please enter your email',
    errorGeneric: language === 'pt' ? 'Ocorreu um erro. Tente novamente mais tarde.' : 'An error occurred. Please try again later.',
    spamPromise: language === 'pt' ? 'Prometemos: nada de spam. Apenas conhecimento de valor para quem quer liderar a próxima revolução digital.' : 'We promise: no spam. Only valuable knowledge for those who want to lead the next digital revolution.'
  };

  // Adicione esta função dentro do componente para cadastrar o lead no Supabase
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      setError(texts.errorEmptyEmail);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Enviar para API local
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, name }),
        });
        
        if (!response.ok) {
          throw new Error('Falha ao enviar dados para API');
        }
      } catch (apiError) {
        console.warn('API local indisponível, tentando Supabase como fallback', apiError);
      }
      
      // Enviar para Supabase como fallback ou método principal
      try {
        const { error } = await supabase
          .from('leads')
          .insert([
            { 
              email, 
              name: name || null,
              created_at: new Date().toISOString() 
            }
          ]);
        
        if (error) throw error;
      } catch (supabaseError) {
        console.error('Erro ao salvar lead no Supabase:', supabaseError);
        // Salvar no localStorage como último recurso
        const fallbackLeads = JSON.parse(localStorage.getItem('fallbackLeads') || '[]');
        fallbackLeads.push({
          id: `local_${Date.now()}`,
          email,
          name: name || '',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('fallbackLeads', JSON.stringify(fallbackLeads));
      }
      
      // Mostrar toast de sucesso
      toast({
        title: texts.successMessage,
        description: texts.successDescription,
        duration: 5000, // Auto-dismiss after 5 seconds
      });
      
      // Limpar campos
      setName('');
      setEmail('');
      setError('');
      
    } catch (err) {
      console.error('Erro ao processar inscrição:', err);
      setError(texts.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded bg-black/70 border border-white/20 text-white placeholder-gray-500"
          placeholder={texts.namePlaceholder}
        />
        
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded bg-black/70 border border-white/20 text-white placeholder-gray-500"
          placeholder={texts.emailPlaceholder}
        />
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button 
          disabled={isLoading} 
          type="submit" 
          className="w-full py-3 rounded bg-neon-yellow hover:bg-neon-yellow/90 text-black font-medium transition-colors"
        >
          {isLoading ? texts.loadingButton : texts.submitButton}
        </button>
        
        <p className="text-center text-sm text-gray-400 mt-2">
          {language === 'pt' ? 'Prometemos: nada de spam. Apenas conhecimento de valor' : 'We promise: no spam. Only valuable knowledge'}
          <br />
          {language === 'pt' ? 'para quem quer liderar a próxima revolução digital.' : 'for those who want to lead the next digital revolution.'}
        </p>
      </form>
    </div>
  );
}
