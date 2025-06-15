const Footer = () => {
  return (
    <footer className="border-t bg-card/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">DIS</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Talent<span className="text-primary">Match</span>
              </span>
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
  );
};

export default Footer;