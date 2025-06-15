import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-6">
          Tecnologia de Ponta em Recrutamento
        </Badge>
        <h1 className="text-4xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
          Contrate os Melhores Talentos
          <br />
          <span className="text-foreground">com Precisão Científica</span>
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
  );
};

export default HeroSection;