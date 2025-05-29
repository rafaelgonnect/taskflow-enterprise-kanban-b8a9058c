
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UserPlus } from 'lucide-react';

interface InviteSignupFormProps {
  email: string;
  companyName: string;
  onSubmit: (email: string, password: string, fullName: string) => Promise<void>;
  isSubmitting: boolean;
}

export function InviteSignupForm({ email, companyName, onSubmit, isSubmitting }: InviteSignupFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await onSubmit(email, password, fullName);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-6 h-6 text-green-600" />
        </div>
        <CardTitle>Criar Conta para {companyName}</CardTitle>
        <CardDescription>
          Complete seu cadastro para aceitar o convite e fazer parte da empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email (do convite)</label>
            <Input
              type="email"
              value={email}
              readOnly
              className="bg-gray-50 cursor-not-allowed"
              title="Este email é do convite e não pode ser alterado"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email do convite (não pode ser alterado)
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium">Nome Completo *</label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={errors.fullName ? 'border-red-500' : ''}
              placeholder="Seu nome completo"
            />
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium">Senha *</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={errors.password ? 'border-red-500' : ''}
              placeholder="Crie uma senha (mín. 6 caracteres)"
              minLength={6}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Confirmar Senha *</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={errors.confirmPassword ? 'border-red-500' : ''}
              placeholder="Confirme sua senha"
              minLength={6}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-medium mb-1">🎉 Próximo passo:</p>
            <p>Após criar sua conta, você será automaticamente adicionado à empresa <strong>{companyName}</strong>.</p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando conta...
              </>
            ) : (
              'Criar Conta e Aceitar Convite'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
