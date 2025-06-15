import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, FileText, Clock, CheckCircle, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, Navigate } from "react-router-dom";

interface Assessment {
  id: string;
  name: string;
  description: string;
  instructions: string;
}

interface Result {
  id: string;
  assessment_id: string;
  completed_at: string | null;
  score: any;
}

interface Profile {
  full_name: string;
  role: string;
}

const CandidateDashboard = () => {
  const { user, signOut } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch assessments
      const { data: assessmentsData } = await supabase
        .from('assessments')
        .select('*');

      if (assessmentsData) {
        setAssessments(assessmentsData);
      }

      // Fetch results
      const { data: resultsData } = await supabase
        .from('results')
        .select('*')
        .eq('candidate_id', user.id);

      if (resultsData) {
        setResults(resultsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResultStatus = (assessmentId: string) => {
    const result = results.find(r => r.assessment_id === assessmentId);
    if (!result) return { status: 'Não Iniciado', color: 'bg-gray-100 text-gray-800' };
    if (result.completed_at) return { status: 'Concluído', color: 'bg-green-100 text-green-800' };
    return { status: 'Em Andamento', color: 'bg-yellow-100 text-yellow-800' };
  };

  const completedTests = results.filter(r => r.completed_at).length;
  const totalTests = assessments.length;

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
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Olá, {profile?.full_name || 'Candidato'}
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
            Bem-vindo ao seu painel
          </h1>
          <p className="text-muted-foreground">
            Complete os testes de perfil comportamental e acompanhe seu progresso
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Progresso dos Testes
                </CardTitle>
                <CardDescription>
                  Acompanhe seu progresso na realização dos testes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Testes Concluídos</span>
                    <span>{completedTests}/{totalTests}</span>
                  </div>
                  <Progress value={(completedTests / totalTests) * 100} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {totalTests - completedTests} teste(s) pendente(s)
                </p>
              </CardContent>
            </Card>

            {/* Available Tests */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Testes Disponíveis</CardTitle>
                <CardDescription>
                  Clique em um teste para iniciá-lo ou continuá-lo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments.map((assessment) => {
                    const { status, color } = getResultStatus(assessment.id);
                    return (
                      <div key={assessment.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{assessment.name}</h3>
                            <p className="text-sm text-muted-foreground">{assessment.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={color}>
                            {status}
                          </Badge>
                          <Link to={`/test/${assessment.id}`}>
                            <Button size="sm">
                              {status === 'Não Iniciado' ? 'Iniciar' : 
                               status === 'Em Andamento' ? 'Continuar' : 'Ver Resultado'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile & Quick Actions */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Meu Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/profile">
                  <Button className="w-full justify-start" variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Status dos Testes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {completedTests}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    teste(s) concluído(s)
                  </p>
                </div>
                {completedTests < totalTests && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {totalTests - completedTests}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      teste(s) pendente(s)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;