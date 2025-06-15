import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp, CheckCircle, Clock, Plus, Search } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Candidatos Avaliados",
      value: "247",
      change: "+12%",
      trend: "up",
      icon: <Users className="h-4 w-4" />
    },
    {
      title: "Testes Concluídos",
      value: "189",
      change: "+8%",
      trend: "up",
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      title: "Contratações Realizadas",
      value: "23",
      change: "+15%",
      trend: "up",
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      title: "Tempo Médio de Seleção",
      value: "12 dias",
      change: "-28%",
      trend: "down",
      icon: <Clock className="h-4 w-4" />
    }
  ];

  const recentCandidates = [
    {
      name: "Ana Silva",
      position: "Analista de Marketing",
      status: "Teste Concluído",
      score: 85,
      date: "2 horas atrás"
    },
    {
      name: "Carlos Santos",
      position: "Desenvolvedor Frontend",
      status: "Em Andamento",
      score: null,
      date: "5 horas atrás"
    },
    {
      name: "Maria Oliveira",
      position: "Gerente de Vendas",
      status: "Aprovado",
      score: 92,
      date: "1 dia atrás"
    },
    {
      name: "João Pereira",
      position: "Designer UX/UI",
      status: "Teste Concluído",
      score: 78,
      date: "2 dias atrás"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-800";
      case "Teste Concluído":
        return "bg-blue-100 text-blue-800";
      case "Em Andamento":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Teste
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo ao Dashboard
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o progresso dos seus processos seletivos e candidatos
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>{" "}
                  em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Candidates */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Candidatos Recentes</CardTitle>
                <CardDescription>
                  Últimas avaliações realizadas na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCandidates.map((candidate, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{candidate.name}</p>
                          <p className="text-sm text-muted-foreground">{candidate.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {candidate.score && (
                          <div className="text-center">
                            <div className="text-sm font-medium text-foreground">{candidate.score}%</div>
                            <Progress value={candidate.score} className="w-16 h-2" />
                          </div>
                        )}
                        <Badge className={getStatusColor(candidate.status)}>
                          {candidate.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {candidate.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Novo Teste
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Convidar Candidato
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Progresso do Plano</CardTitle>
                <CardDescription>
                  Teste Gratuito - 12 dias restantes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Avaliações Utilizadas</span>
                    <span>189/200</span>
                  </div>
                  <Progress value={94.5} className="h-2" />
                </div>
                <Button className="w-full" size="sm">
                  Fazer Upgrade
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/10">
              <CardHeader>
                <CardTitle className="text-lg">Precisa de Ajuda?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Nossa equipe está pronta para ajudar você a otimizar seus processos seletivos.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Falar com Especialista
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;