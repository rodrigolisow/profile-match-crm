import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Phone, MapPin, Calendar, LinkedinIcon, FileText, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, Navigate, useParams } from "react-router-dom";
import DISCReportModal from "@/components/DISCReportModal";

interface CandidateDetails {
  id: string;
  phone: string;
  address: string;
  birth_date: string;
  linkedin_profile: string;
  company_id: string;
  profiles: {
    full_name: string;
  };
  email?: string;
}

interface TestResult {
  id: string;
  completed_at: string;
  assessments: {
    name: string;
    description: string;
  };
  score: any;
}

interface Company {
  id: string;
  name: string;
}

const AdminCandidateDetail = () => {
  const { user, signOut } = useAuth();
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState<CandidateDetails | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const [company, setCompany] = useState<Company | null>(null);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  useEffect(() => {
    if (userRole === 'admin' && candidateId) {
      fetchCandidateDetails();
    }
  }, [userRole, candidateId]);

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

  const fetchCandidateDetails = async () => {
    try {
      // First get the company to verify admin access
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('admin_user_id', user.id)
        .single();

      if (companyData) {
        setCompany(companyData);

        // Get candidate details with profile info
        const { data: candidateData } = await supabase
          .from('candidates')
          .select(`
            *,
            profiles!inner(full_name)
          `)
          .eq('id', candidateId)
          .eq('company_id', companyData.id)
          .single();

        if (candidateData) {
          // Get email from auth system
          const { data: authUser } = await supabase.auth.admin.getUserById(candidateData.id);
          const email = authUser.user?.email;

          setCandidate({
            ...candidateData,
            email
          });

          // Fetch test results
          const { data: resultsData } = await supabase
            .from('results')
            .select(`
              *,
              assessments!inner(name, description)
            `)
            .eq('candidate_id', candidateId)
            .not('completed_at', 'is', null)
            .order('completed_at', { ascending: false });

          if (resultsData) {
            setTestResults(resultsData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleViewReport = (result: TestResult) => {
    setSelectedResult(result);
    setIsReportModalOpen(true);
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

  if (!candidate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p>Candidato não encontrado ou você não tem permissão para visualizá-lo.</p>
            <Link to="/admin/candidates">
              <Button className="mt-4">Voltar para Lista</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/admin/candidates">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Candidatos
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">HR</span>
              </div>
              <span className="text-xl font-bold text-foreground">TalentMatch</span>
              <Badge variant="secondary" className="ml-2">Admin</Badge>
            </div>
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
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
              <User className="h-8 w-8 mr-3" />
              {candidate.profiles.full_name || 'Candidato'}
            </h1>
            <p className="text-muted-foreground">
              Informações detalhadas do candidato e histórico de avaliações
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Candidate Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Nome Completo</p>
                        <p className="font-medium">{candidate.profiles.full_name || 'Não informado'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Telefone</p>
                        <p className="font-medium">{candidate.phone || 'Não informado'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                        <p className="font-medium">{formatDate(candidate.birth_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <LinkedinIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">LinkedIn</p>
                        {candidate.linkedin_profile ? (
                          <a 
                            href={candidate.linkedin_profile} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Ver Perfil
                          </a>
                        ) : (
                          <p className="font-medium">Não informado</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Endereço</p>
                      <p className="font-medium">{candidate.address || 'Não informado'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Test History */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Histórico de Avaliações
                  </CardTitle>
                  <CardDescription>
                    Testes concluídos pelo candidato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {testResults.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhum teste concluído ainda.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {testResults.map((result) => (
                        <div key={result.id} className="p-4 rounded-lg border bg-card/50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-foreground">
                                {result.assessments.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {result.assessments.description}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              Concluído
                            </Badge>
                          </div>
                          <div className="mt-3 flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                              Concluído em: {formatDateTime(result.completed_at)}
                            </p>
                            <div className="flex items-center gap-3">
                              {result.score && result.score.percentage && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Pontuação: </span>
                                  <span className="font-medium">{result.score.percentage}%</span>
                                </div>
                              )}
                              {result.score && result.assessments.name.toLowerCase().includes('disc') && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewReport(result)}
                                >
                                  Ver Relatório DISC
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Resumo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{candidate.email || 'Não disponível'}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Testes Concluídos</p>
                    <p className="text-2xl font-bold text-primary">{testResults.length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/10">
                <CardHeader>
                  <CardTitle className="text-lg">Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    Enviar Novo Teste
                  </Button>
                  <Button className="w-full" variant="outline">
                    Relatório Detalhado
                  </Button>
                  <Button className="w-full" variant="outline">
                    Histórico Completo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* DISC Report Modal */}
      {selectedResult && selectedResult.score && (
        <DISCReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          score={selectedResult.score}
          assessmentName={selectedResult.assessments.name}
          completedAt={selectedResult.completed_at}
        />
      )}
    </div>
  );
};

export default AdminCandidateDetail;