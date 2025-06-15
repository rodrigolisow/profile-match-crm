import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
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
  );
};

export default CtaSection;