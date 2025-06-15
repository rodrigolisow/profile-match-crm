import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, UserPlus, LogOut, Building } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, Navigate } from "react-router-dom";

interface AdminStats {
  totalCandidates: number;
  completedTests: number;
  pendingTests: number;
  totalInvitations: number;
}

interface Company {
  id: string;
  name: string;
  cnpj: string;
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalCandidates: 0,
    completedTests: 0,
    pendingTests: 0,
    totalInvitations: 0
  });
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAdminData();
    }
  }, [userRole]);

  const fetchUserRole = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserRole(profile.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchAdminData = async () => {
    try {
      // Fetch company data
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('admin_user_id', user.id)
        .single();

      if (companyData) {
        setCompany(companyData);

        // Fetch candidates count
        const { count: candidatesCount } = await supabase
          .from('candidates')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', companyData.id);

        // Fetch completed tests count
        const { count: completedCount } = await supabase
          .from('results')
          .select('*, candidates!inner(*)', { count: 'exact', head: true })
          .not('completed_at', 'is', null)
          .eq('candidates.company_id', companyData.id);

        // Fetch pending tests count
        const { count: pendingCount } = await supabase
          .from('results')
          .select('*, candidates!inner(*)', { count: 'exact', head: true })
          .is('completed_at', null)
          .eq('candidates.company_id', companyData.id);

        // Fetch invitations count
        const { count: invitationsCount } = await supabase
          .from('invitations')
          .select('*', { count: 'exact', head: true })
          .eq('company_id', companyData.id);

        setStats({
          totalCandidates: candidatesCount || 0,
          completedTests: completedCount || 0,
          pendingTests: pendingCount || 0,
          totalInvitations: invitationsCount || 0
        });
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userRole && userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">HR</span>
            </div>
            <span className="text-xl font-bold text-foreground">TalentMatch</span>
            <Badge variant="secondary" className="ml-2">Admin</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {company?.name || 'Empresa'}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground">
            Gerencie candidatos e acompanhe o progresso dos testes comportamentais
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Candidatos Totais
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalCandidates}</div>
              <p className="text-xs text-muted-foreground">
                candidatos vinculados
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Testes Concluídos
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.completedTests}</div>
              <p className="text-xs text-muted-foreground">
                avaliações finalizadas
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Testes Pendentes
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.pendingTests}</div>
              <p className="text-xs text-muted-foreground">
                aguardando conclusão
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Convites Enviados
              </CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalInvitations}</div>
              <p className="text-xs text-muted-foreground">
                convites realizados
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Principais funcionalidades do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-20 flex-col" size="lg">
                  <UserPlus className="h-6 w-6 mb-2" />
                  Convidar Novo Candidato
                </Button>
                <Link to="/admin/candidates">
                  <Button variant="outline" className="h-20 flex-col w-full" size="lg">
                    <Users className="h-6 w-6 mb-2" />
                    Gerenciar Candidatos
                  </Button>
                </Link>
                <Button variant="outline" className="h-20 flex-col" size="lg">
                  <FileText className="h-6 w-6 mb-2" />
                  Relatórios
                </Button>
                <Button variant="outline" className="h-20 flex-col" size="lg">
                  <Building className="h-6 w-6 mb-2" />
                  Configurações
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Company Info */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Informações da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nome da Empresa</p>
                  <p className="font-medium">{company?.name || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CNPJ</p>
                  <p className="font-medium">{company?.cnpj || 'Não informado'}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/10">
              <CardHeader>
                <CardTitle className="text-lg">Resumo Mensal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats.completedTests}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    testes concluídos este mês
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-2">
                    {stats.pendingTests}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    candidatos pendentes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;