
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Database, Loader2 } from 'lucide-react';

const DatabaseReset = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [deletedCounts, setDeletedCounts] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();

  const handleReset = async () => {
    if (!password.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, digite a senha de confirmação',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Calling reset-database function...');
      
      const { data, error } = await supabase.functions.invoke('reset-database', {
        body: { password: password.trim() }
      });

      if (error) {
        console.error('Error calling reset function:', error);
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao resetar base de dados',
          variant: 'destructive',
        });
        return;
      }

      if (data.error) {
        toast({
          title: 'Erro',
          description: data.error,
          variant: 'destructive',
        });
        return;
      }

      console.log('Reset successful:', data);
      setDeletedCounts(data.deletedCounts || {});
      setResetComplete(true);
      setPassword('');
      
      toast({
        title: 'Sucesso!',
        description: 'Base de dados resetada com sucesso',
      });

    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: 'Erro',
        description: 'Erro inesperado ao resetar base de dados',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewReset = () => {
    setResetComplete(false);
    setDeletedCounts({});
    setPassword('');
  };

  if (resetComplete) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Database className="w-6 h-6" />
              Reset Concluído!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                A base de dados foi resetada com sucesso. Todos os dados foram removidos.
              </AlertDescription>
            </Alert>

            {Object.keys(deletedCounts).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Registros removidos por tabela:</h3>
                <div className="bg-slate-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                  {Object.entries(deletedCounts).map(([table, count]) => (
                    <div key={table} className="flex justify-between text-sm">
                      <span>{table}:</span>
                      <span className="font-mono">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleNewReset} variant="outline" className="flex-1">
                Fazer Novo Reset
              </Button>
              <Button onClick={() => window.location.href = '/'} className="flex-1">
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-6 h-6" />
            Reset da Base de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>ATENÇÃO:</strong> Esta ação irá apagar TODOS os dados da base de dados de forma permanente. 
              Esta operação não pode ser desfeita!
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="password">
              Digite a senha de confirmação para continuar:
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha de confirmação"
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={handleReset} 
            disabled={isLoading || !password.trim()}
            variant="destructive"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resetando Base de Dados...
              </>
            ) : (
              <>
                <Database className="w-4 h-4 mr-2" />
                Resetar Base de Dados
              </>
            )}
          </Button>

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/'}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseReset;
