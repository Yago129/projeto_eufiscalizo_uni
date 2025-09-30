import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInspections } from '@/contexts/InspectionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InspectionCard } from '@/components/InspectionCard';
import { Plus, BarChart3, Clock, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NewInspectionForm } from '@/components/NewInspectionForm';
import { FeedbackDialog } from '@/components/FeedbackDialog';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { inspections, addFeedback } = useInspections();
  const [feedbackInspectionId, setFeedbackInspectionId] = useState<string | null>(null);
  
  // Filter inspections for current user
  const userInspections = inspections.filter(inspection => inspection.studentId === user?.id);
  
  const stats = {
    total: userInspections.length,
    recebida: userInspections.filter(i => i.status === 'recebida').length,
    em_processo: userInspections.filter(i => i.status === 'em_processo').length,
    concluida: userInspections.filter(i => i.status === 'concluida').length,
  };

  const handleAddFeedback = (inspectionId: string) => {
    setFeedbackInspectionId(inspectionId);
  };

  const handleFeedbackSubmit = (rating: number, comment: string) => {
    if (feedbackInspectionId) {
      addFeedback(feedbackInspectionId, rating, comment);
      setFeedbackInspectionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">EuFiscalizo</h1>
            <p className="text-sm text-muted-foreground">
              Bem-vindo, {user?.name} • {user?.curso}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Fiscalização
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nova Fiscalização</DialogTitle>
                  <DialogDescription>
                    Reporte um problema encontrado na universidade
                  </DialogDescription>
                </DialogHeader>
                <NewInspectionForm />
              </DialogContent>
            </Dialog>
            
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/60 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Fiscalizações enviadas
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recebidas</CardTitle>
              <Clock className="h-4 w-4 text-pending" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recebida}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando processo
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Processo</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.em_processo}</div>
              <p className="text-xs text-muted-foreground">
                Em andamento
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.concluida}</div>
              <p className="text-xs text-muted-foreground">
                Problemas resolvidos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Inspections */}
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle>Minhas Fiscalizações</CardTitle>
            <CardDescription>
              Acompanhe o status das suas fiscalizações enviadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Todas ({stats.total})</TabsTrigger>
                <TabsTrigger value="recebida">Recebidas ({stats.recebida})</TabsTrigger>
                <TabsTrigger value="em_processo">Em Processo ({stats.em_processo})</TabsTrigger>
                <TabsTrigger value="concluida">Concluídas ({stats.concluida})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6 mt-6">
                {userInspections.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">Você ainda não enviou nenhuma fiscalização</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Enviar primeira fiscalização
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Nova Fiscalização</DialogTitle>
                          <DialogDescription>
                            Reporte um problema encontrado na universidade
                          </DialogDescription>
                        </DialogHeader>
                        <NewInspectionForm />
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {userInspections.map((inspection) => (
                      <InspectionCard
                        key={inspection.id}
                        inspection={inspection}
                        showActions={true}
                        userRole="student"
                        onAddFeedback={handleAddFeedback}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {(['recebida', 'em_processo', 'concluida'] as const).map((status) => (
                <TabsContent key={status} value={status} className="space-y-6 mt-6">
                  <div className="grid gap-6">
                    {userInspections
                      .filter(inspection => inspection.status === status)
                      .map((inspection) => (
                        <InspectionCard
                          key={inspection.id}
                          inspection={inspection}
                          showActions={true}
                          userRole="student"
                          onAddFeedback={handleAddFeedback}
                        />
                      ))}
                  </div>
                  {userInspections.filter(inspection => inspection.status === status).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhuma fiscalização com este status</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Feedback Dialog */}
      <FeedbackDialog
        isOpen={!!feedbackInspectionId}
        onClose={() => setFeedbackInspectionId(null)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
}