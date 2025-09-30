import { Inspection } from '@/types/inspection';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, MessageSquare, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InspectionCardProps {
  inspection: Inspection;
  onUpdateStatus?: (id: string, status: Inspection['status']) => void;
  onAddFeedback?: (id: string) => void;
  showActions?: boolean;
  userRole?: 'student' | 'admin';
}

export function InspectionCard({ 
  inspection, 
  onUpdateStatus, 
  onAddFeedback,
  showActions = false,
  userRole = 'student'
}: InspectionCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{inspection.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {inspection.location}
            </div>
          </div>
          <StatusBadge status={inspection.status} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{inspection.description}</p>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline">{inspection.category}</Badge>
          {userRole === 'admin' && (
            <Badge variant="secondary">{inspection.studentName}</Badge>
          )}
        </div>

        {inspection.imageUrl && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={inspection.imageUrl} 
              alt="Evidência da fiscalização"
              className="w-full h-32 object-cover"
            />
          </div>
        )}

        {inspection.adminResponse && (
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 mt-0.5 text-primary" />
              <div>
                <p className="text-sm font-medium mb-1">Resposta da Administração:</p>
                <p className="text-sm text-muted-foreground">{inspection.adminResponse}</p>
              </div>
            </div>
          </div>
        )}

        {inspection.feedback && (
          <div className="bg-success-light p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Star className="w-4 h-4 mt-0.5 text-success" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">Feedback do Aluno:</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < inspection.feedback!.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{inspection.feedback.comment}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {format(inspection.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
        </div>

        {showActions && userRole === 'admin' && (
          <div className="flex gap-2">
            {inspection.status === 'recebida' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onUpdateStatus?.(inspection.id, 'em_processo')}
              >
                Iniciar Processo
              </Button>
            )}
            {inspection.status === 'em_processo' && (
              <Button 
                size="sm"
                onClick={() => onUpdateStatus?.(inspection.id, 'concluida')}
              >
                Marcar como Concluída
              </Button>
            )}
          </div>
        )}

        {showActions && userRole === 'student' && inspection.status === 'concluida' && !inspection.feedback && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onAddFeedback?.(inspection.id)}
          >
            Avaliar Solução
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}