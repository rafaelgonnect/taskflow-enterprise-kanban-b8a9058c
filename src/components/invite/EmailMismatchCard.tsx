
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EmailMismatchCardProps {
  userEmail: string;
  inviteEmail: string;
  onLoginWithOtherAccount: () => void;
}

export function EmailMismatchCard({ userEmail, inviteEmail, onLoginWithOtherAccount }: EmailMismatchCardProps) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Email não confere</h3>
        <p className="text-slate-600 mb-4">
          Você está logado como {userEmail}, mas o convite é para {inviteEmail}.
        </p>
        <Button onClick={onLoginWithOtherAccount} className="w-full">
          Fazer login com outra conta
        </Button>
      </CardContent>
    </Card>
  );
}
