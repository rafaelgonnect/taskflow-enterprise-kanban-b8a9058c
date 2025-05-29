
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface AuthFormProps {
  email: string;
  onSubmit: (email: string, password: string, fullName?: string, isLogin?: boolean) => Promise<void>;
  isSubmitting: boolean;
}

export function AuthForm({ email, onSubmit, isSubmitting }: AuthFormProps) {
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password, fullName, isLogin);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? 'Fazer Login' : 'Criar Conta'}</CardTitle>
        <CardDescription>
          {isLogin 
            ? 'Entre com sua conta para aceitar o convite' 
            : 'Crie uma conta para aceitar o convite'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              required
              readOnly
              className="bg-gray-50 cursor-not-allowed"
              title="Este email não pode ser alterado pois é o email do convite"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email do convite (não pode ser alterado)
            </p>
          </div>
          
          {!isLogin && (
            <div>
              <label className="text-sm font-medium">Nome Completo</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isLogin ? 'Entrando...' : 'Criando conta...'}
              </>
            ) : (
              isLogin ? 'Entrar' : 'Criar Conta'
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isLogin 
                ? 'Não tem conta? Criar uma nova' 
                : 'Já tem conta? Fazer login'
              }
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
