
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';

interface AcceptInviteCardProps {
  userEmail: string;
  onAccept: () => void;
  isAccepting: boolean;
}

export function AcceptInviteCard({ userEmail, onAccept, isAccepting }: AcceptInviteCardProps) {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Pronto para aceitar!</h3>
        <p className="text-slate-600 mb-4">
          Você está logado como {userEmail}. Clique para aceitar o convite.
        </p>
        <Button 
          onClick={onAccept} 
          className="w-full"
          disabled={isAccepting}
        >
          {isAccepting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Aceitando convite...
            </>
          ) : (
            'Aceitar Convite'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
