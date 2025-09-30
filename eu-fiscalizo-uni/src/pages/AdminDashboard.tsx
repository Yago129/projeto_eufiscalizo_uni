import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInspections } from '@/contexts/InspectionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InspectionCard } from '@/components/InspectionCard';
import { BarChart3, Search, Filter, Users, Clock, AlertTriangle, CheckCircle, LogOut } from 'lucide-react';
import { InspectionStatus } from '@/types/inspection';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { inspections, updateInspectionStatus } = useInspections();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<InspectionStatus | 'all'>('all');

  const stats = {
    total: inspections.length,
    recebidas: inspections.filter(i => i.status === 'recebida').length,
    em_processo: inspections.filter(i => i.status === 'em_processo').length,
    concluidas: inspections.filter(i => i.status === 'concluida').length,
  };

  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = inspection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || inspection.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(inspections.map(i => i.category)));

  const handleStatusUpdate = (id: string, status: InspectionStatus) => {
    let adminResponse = '';
    
    if (status === 'em_processo') {
      adminResponse = 'Fiscalização recebida e direcionada para o setor responsável. Acompanharemos o andamento.';
    } else if (status === 'concluida') {
      adminResponse = 'Problema foi identificado e solucionado pela equipe de manutenção.';
    }
    
    updateInspectionStatus(id, status, adminResponse);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">EuFiscalizo - Admin</h1>
            <p className="text-sm text-muted-foreground">
              Bem-vindo, {user?.name} • Painel Administrativo
            </p>
          </div>
          
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
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
                Fiscalizações registradas
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recebidas</CardTitle>
              <Clock className="h-4 w-4 text-pending" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pending">{stats.recebidas}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando análise
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Processo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.em_processo}</div>
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
              <div className="text-2xl font-bold text-success">{stats.concluidas}</div>
              <p className="text-xs text-muted-foreground">
                Problemas resolvidos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pesquisar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título, descrição, aluno..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={(value: InspectionStatus | 'all') => setStatusFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="recebida">Recebidas</SelectItem>
                    <SelectItem value="em_processo">Em Processo</SelectItem>
                    <SelectItem value="concluida">Concluídas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inspections */}
        <Card className="bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Fiscalizações ({filteredInspections.length})
            </CardTitle>
            <CardDescription>
              Gerencie todas as fiscalizações enviadas pelos alunos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="kanban" className="w-full">
              <TabsList>
                <TabsTrigger value="kanban">Visão Kanban</TabsTrigger>
                <TabsTrigger value="list">Lista</TabsTrigger>
              </TabsList>
              
              <TabsContent value="kanban" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Recebidas */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-pending-light rounded-lg">
                      <Clock className="w-5 h-5 text-pending" />
                      <h3 className="font-semibold">Recebidas ({filteredInspections.filter(i => i.status === 'recebida').length})</h3>
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {filteredInspections
                        .filter(inspection => inspection.status === 'recebida')
                        .map((inspection) => (
                          <InspectionCard
                            key={inspection.id}
                            inspection={inspection}
                            showActions={true}
                            userRole="admin"
                            onUpdateStatus={handleStatusUpdate}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Em Processo */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-warning-light rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      <h3 className="font-semibold">Em Processo ({filteredInspections.filter(i => i.status === 'em_processo').length})</h3>
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {filteredInspections
                        .filter(inspection => inspection.status === 'em_processo')
                        .map((inspection) => (
                          <InspectionCard
                            key={inspection.id}
                            inspection={inspection}
                            showActions={true}
                            userRole="admin"
                            onUpdateStatus={handleStatusUpdate}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Concluídas */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-success-light rounded-lg">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <h3 className="font-semibold">Concluídas ({filteredInspections.filter(i => i.status === 'concluida').length})</h3>
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      {filteredInspections
                        .filter(inspection => inspection.status === 'concluida')
                        .map((inspection) => (
                          <InspectionCard
                            key={inspection.id}
                            inspection={inspection}
                            showActions={false}
                            userRole="admin"
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="space-y-6 mt-6">
                <div className="grid gap-6">
                  {filteredInspections.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Nenhuma fiscalização encontrada com os filtros aplicados</p>
                    </div>
                  ) : (
                    filteredInspections.map((inspection) => (
                      <InspectionCard
                        key={inspection.id}
                        inspection={inspection}
                        showActions={true}
                        userRole="admin"
                        onUpdateStatus={handleStatusUpdate}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}