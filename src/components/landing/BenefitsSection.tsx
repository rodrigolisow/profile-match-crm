import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const BenefitsSection = () => {
  const benefits = [
    "Redução de 70% no tempo de contratação",
    "Aumento de 85% na retenção de funcionários",
    "Diminuição de 60% nos custos de recrutamento",
    "Melhoria de 90% na qualidade das contratações"
  ];

  const stats = [
    { value: "95%", label: "Precisão na identificação de candidatos ideais" },
    { value: "70%", label: "Redução no tempo de contratação" },
    { value: "85%", label: "Aumento na retenção de funcionários" }
  ];

  return (
    <section id="beneficios" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-6">
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
            <div className="grid gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className={`p-6 text-center ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                  <CardContent className="p-0">
                    <div className={`text-4xl font-bold mb-2 ${index === 0 ? 'text-primary-foreground' : 'text-primary'}`}>
                      {stat.value}
                    </div>
                    <p className={index === 0 ? 'text-primary-foreground/90' : 'text-muted-foreground'}>
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;