
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Mail, Calendar } from 'lucide-react';

interface InviteInfoProps {
  companyName: string;
  email: string;
  expiresAt: string;
}

export function InviteInfo({ companyName, email, expiresAt }: InviteInfoProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle>Convite para se juntar à empresa</CardTitle>
        <CardDescription>
          Você foi convidado para fazer parte da {companyName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <Mail className="w-4 h-4 text-slate-500" />
          <span className="text-sm">{email}</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-sm">
            Expira em {new Date(expiresAt).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
