
import { useState } from 'react';
import { useCreateCompany } from '@/hooks/useCompanies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CompanyCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyCreationModal({ isOpen, onClose }: CompanyCreationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createCompanyMutation = useCreateCompany();

  const [companyData, setCompanyData] = useState({
    name: '',
    description: '',
  });

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyData.name.trim()) {
      setError('Nome da empresa é obrigatório');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Iniciando processo de criação da empresa...');
      await createCompanyMutation.mutateAsync({
        name: companyData.name.trim(),
        description: companyData.description.trim() || undefined,
      });
      
      toast.success('Empresa criada com sucesso! Bem-vindo ao TaskFlow SaaS!');
      onClose();
    } catch (error: any) {
      console.error('Erro completo na criação da empresa:', error);
      const errorMessage = error.message || 'Erro desconhecido ao criar empresa';
      setError(errorMessage);
      toast.error('Erro ao criar empresa: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={() => {}} onEscapeKeyDown={() => {}}>
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Building2 className="h-12 w-12 text-blue-600" />
              <CheckCircle className="h-6 w-6 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
            </div>
          </div>
          <DialogTitle className="text-2xl">Bem-vindo ao TaskFlow SaaS!</DialogTitle>
          <DialogDescription>
            Para começar a usar o sistema, você precisa criar sua empresa. Você se tornará o administrador dela e poderá convidar outros usuários.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleCreateCompany} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa *</Label>
            <Input
              id="companyName"
              type="text"
              placeholder="Ex: Minha Empresa Ltda"
              value={companyData.name}
              onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyDescription">Descrição da Empresa (opcional)</Label>
            <Input
              id="companyDescription"
              type="text"
              placeholder="Breve descrição da sua empresa"
              value={companyData.description}
              onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">🎉 O que acontece a seguir:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Você se tornará o administrador da empresa</li>
              <li>Poderá criar departamentos e gerenciar usuários</li>
              <li>Terá acesso completo ao sistema de tarefas</li>
              <li>Poderá convidar outros colaboradores</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando empresa...
              </>
            ) : (
              'Criar Empresa e Continuar'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
