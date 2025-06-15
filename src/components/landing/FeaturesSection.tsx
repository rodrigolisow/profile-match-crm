import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Shield, Clock, Target, CheckCircle } from "lucide-react";

const FeaturesSection = () => {
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

  return (
    <section id="recursos" className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
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
                <div className="mb-4 w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;