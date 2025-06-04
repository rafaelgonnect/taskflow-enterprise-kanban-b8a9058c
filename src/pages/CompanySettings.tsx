
import { Layout } from '@/components/Layout';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCompanyContext } from '@/contexts/CompanyContext';
import { useUpdateCompany } from '@/hooks/useUpdateCompany';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditLogsDialog } from '@/components/AuditLogsDialog';
import { toast } from 'sonner';

interface CompanyFormData {
  name: string;
  description: string;
}

export default function CompanySettings() {
  const { selectedCompany } = useCompanyContext();
  const { mutate: updateCompany, isPending } = useUpdateCompany();
  const [showAuditLogs, setShowAuditLogs] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormData>({
    defaultValues: {
      name: selectedCompany?.name || '',
      description: selectedCompany?.description || '',
    }
  });

  const onSubmit = (data: CompanyFormData) => {
    if (!selectedCompany) return;

    updateCompany({
      id: selectedCompany.id,
      name: data.name,
      description: data.description,
    }, {
      onSuccess: () => {
        toast.success('Configurações da empresa atualizadas com sucesso!');
      },
      onError: (error) => {
        console.error('Erro ao atualizar empresa:', error);
        toast.error('Erro ao atualizar configurações da empresa');
      }
    });
  };

  if (!selectedCompany) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-muted-foreground">Nenhuma empresa selecionada</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Configurações da Empresa</h1>
          <p className="text-muted-foreground">
            Gerencie as informações e configurações da sua empresa
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Atualize as informações básicas da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nome da Empresa
                  </label>
                  <Input
                    {...register('name', { required: 'Nome da empresa é obrigatório' })}
                    placeholder="Nome da empresa"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Descrição
                  </label>
                  <Textarea
                    {...register('description')}
                    placeholder="Descrição da empresa"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Auditoria</CardTitle>
              <CardDescription>
                Visualize os logs de auditoria da empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                onClick={() => setShowAuditLogs(true)}
              >
                Ver Logs de Auditoria
              </Button>
            </CardContent>
          </Card>
        </div>

        <AuditLogsDialog 
          open={showAuditLogs} 
          onOpenChange={setShowAuditLogs}
          companyId={selectedCompany.id}
        />
      </div>
    </Layout>
  );
}
