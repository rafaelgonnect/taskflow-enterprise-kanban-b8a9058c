
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useUpdateCompany } from '@/hooks/useUpdateCompany';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Building2, Save, ArrowLeft, Users, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

export default function CompanySettings() {
  const navigate = useNavigate();
  const { selectedCompany } = useCompanyContext();
  const { user } = useAuth();
  const updateCompanyMutation = useUpdateCompany();
  
  const [formData, setFormData] = useState({
    name: selectedCompany?.name || '',
    description: selectedCompany?.description || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  if (!selectedCompany) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Nenhuma empresa selecionada</h2>
          <p className="text-slate-600 mb-4">Selecione uma empresa para acessar as configurações.</p>
          <Button onClick={() => navigate('/')}>Voltar ao Dashboard</Button>
        </div>
      </div>
    );
  }

  const isOwner = selectedCompany.owner_id === user?.id;

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Nome da empresa é obrigatório');
      return;
    }

    setIsLoading(true);
    try {
      await updateCompanyMutation.mutateAsync({
        id: selectedCompany.id,
        name: formData.name,
        description: formData.description,
      });
      
      toast.success('Empresa atualizada com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar empresa: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Configurações da Empresa</h1>
            <p className="text-slate-600">Gerencie as informações e configurações da sua empresa</p>
          </div>
        </div>

        <div className="grid gap-6 max-w-4xl">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>
                Informações gerais sobre a empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome da empresa"
                    disabled={!isOwner || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Criação</Label>
                  <Input
                    value={new Date(selectedCompany.created_at).toLocaleDateString('pt-BR')}
                    disabled
                    className="bg-slate-50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição da Empresa</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descrição da empresa"
                  disabled={!isOwner || isLoading}
                />
              </div>

              {isOwner && (
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>Salvando...</>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {!isOwner && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                  <p className="font-medium">Apenas o proprietário pode editar estas informações</p>
                  <p>Você não tem permissão para alterar as configurações desta empresa.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estatísticas da Empresa */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>
                Informações gerais sobre a empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900">-</p>
                    <p className="text-sm text-blue-700">Usuários</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-900">-</p>
                    <p className="text-sm text-green-700">Tarefas</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Building2 className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-900">-</p>
                    <p className="text-sm text-purple-700">Departamentos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Proprietário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Proprietário
              </CardTitle>
              <CardDescription>
                Informações sobre o proprietário da empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-medium text-slate-900">ID: {selectedCompany.owner_id}</p>
                <p className="text-sm text-slate-600 mt-1">
                  {isOwner ? 'Você é o proprietário desta empresa' : 'Você não é o proprietário desta empresa'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
