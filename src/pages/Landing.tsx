import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, TrendingUp, Shield, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Avaliação Comportamental",
      description: "Testes psicométricos DISC, Big Five e Atenção Concentrada para identificar o perfil ideal do candidato."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Análise Preditiva",
      description: "Algoritmos inteligentes que preveem a adequação do candidato à cultura e função da empresa."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Dados Seguros",
      description: "Proteção total dos dados dos candidatos com criptografia e conformidade com a LGPD."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Processo Ágil",
      description: "Reduza o tempo de contratação em até 70% com nossa plataforma automatizada."
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Match Preciso",
      description: "Encontre candidatos com 95% de compatibilidade com o perfil desejado para a vaga."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Relatórios Detalhados",
      description: "Dashboards completos com insights acionáveis sobre cada candidato avaliado."
    }
  ];

  const benefits = [
    "Redução de 70% no tempo de contratação",
    "Aumento de 85% na retenção de funcionários",
    "Diminuição de 60% nos custos de recrutamento",
    "Melhoria de 90% na qualidade das contratações"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">HR</span>
            </div>
            <span className="text-xl font-bold text-foreground">TalentMatch</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#recursos" className="text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#beneficios" className="text-muted-foreground hover:text-foreground transition-colors">
              Benefícios
            </a>
            <a href="#contato" className="text-muted-foreground hover:text-foreground transition-colors">
              Contato
            </a>
          </nav>
          <div className="flex space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Começar Agora</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6">
            Tecnologia de Ponta em Recrutamento
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Contrate os
            <span className="text-primary"> Melhores Talentos</span>
            <br />com Precisão Científica
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Nossa plataforma de avaliação comportamental utiliza testes psicométricos validados 
            para identificar candidatos com o perfil ideal para sua empresa, reduzindo custos 
            e aumentando a qualidade das contratações.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/register">Teste Grátis por 14 Dias</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Ver Demonstração
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            ✓ Não precisa de cartão de crédito ✓ Configuração em 5 minutos
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Recursos Que Transformam Seu Recrutamento
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas científicas e intuitivas para uma seleção mais assertiva e eficiente
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-4">
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Resultados Comprovados em Empresas Líderes
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Mais de 500 empresas já transformaram seus processos de recrutamento 
                com nossa plataforma, obtendo resultados mensuráveis e consistentes.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-8" asChild>
                <Link to="/register">Começar Gratuitamente</Link>
              </Button>
            </div>
            <div className="lg:pl-8">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/10 border-0">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">95%</div>
                  <p className="text-muted-foreground mb-6">
                    Precisão na identificação de candidatos ideais
                  </p>
                  <div className="text-4xl font-bold text-primary mb-2">70%</div>
                  <p className="text-muted-foreground mb-6">
                    Redução no tempo de contratação
                  </p>
                  <div className="text-4xl font-bold text-primary mb-2">85%</div>
                  <p className="text-muted-foreground">
                    Aumento na retenção de funcionários
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Pronto para Revolucionar Seu Recrutamento?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a centenas de empresas que já descobriram o poder da seleção científica
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 py-6"
            asChild
          >
            <Link to="/register">Comece Seu Teste Gratuito</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">HR</span>
                </div>
                <span className="text-xl font-bold text-foreground">TalentMatch</span>
              </div>
              <p className="text-muted-foreground">
                Transformando recrutamento com ciência e tecnologia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Recursos</li>
                <li>Preços</li>
                <li>Integrações</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Sobre</li>
                <li>Blog</li>
                <li>Carreiras</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Suporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Central de Ajuda</li>
                <li>Contato</li>
                <li>Política de Privacidade</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 TalentMatch. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;