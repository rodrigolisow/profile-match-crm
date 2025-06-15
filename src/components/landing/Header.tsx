import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">DIS</span>
          </div>
          <span className="text-xl font-bold text-foreground">
            Talent<span className="text-primary">Match</span>
          </span>
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
  );
};

export default Header;