
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface InvalidInviteCardProps {
  onGoToSystem: () => void;
}

export function InvalidInviteCard({ onGoToSystem }: InvalidInviteCardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Convite Inválido</h2>
          <p className="text-slate-600 mb-4">
            Este convite não existe, já foi utilizado ou expirou.
          </p>
          <Button onClick={onGoToSystem} className="w-full">
            Ir para o Sistema
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
