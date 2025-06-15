import React from 'react';
import { ShieldCheck, BarChart, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Paleta de Cores DIS ---
const colors = {
  primary: '#0A2F5C', // Azul escuro do logo
  primaryDarker: '#061E3B', // Tom mais escuro para hover
  accent: '#00A9E0', // Azul ciano do logo
  accentLight: '#E6F6FD' // Tom bem claro do ciano para fundos
};

// Componente para o Header/Navbar
const Header = () => (
  <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-slate-900">
        Talent<span style={{ color: colors.primary }}>Match</span>
      </div>
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#recursos" className="text-slate-600 hover:text-[#0A2F5C] transition-colors">Recursos</a>
        <a href="#beneficios" className="text-slate-600 hover:text-[#0A2F5C] transition-colors">Benefícios</a>
        <a href="#contato" className="text-slate-600 hover:text-[#0A2F5C] transition-colors">Contato</a>
      </nav>
      <div className="flex items-center space-x-4">
        <Link to="/login" className="text-slate-600 hover:text-[#0A2F5C] font-semibold transition-colors">
          Entrar
        </Link>
        <Link 
          to="/register"
          className="bg-[#0A2F5C] text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-[#061E3B] transition-all transform hover:scale-105"
        >
          Começar Agora
        </Link>
      </div>
    </div>
  </header>
);

// Componente para a seção Hero (Principal)
const HeroSection = () => (
  <section className="bg-white py-20 md:py-32">
    <div className="container mx-auto px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
        Otimize o seu recrutamento com <br />
        <span style={{ color: colors.primary }}>análises comportamentais precisas.</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
        A nossa plataforma utiliza ciência de dados e psicologia para identificar os candidatos ideais, reduzindo custos e aumentando a retenção de talentos.
      </p>
      <div className="flex justify-center space-x-4">
        <Link 
          to="/register"
          className="bg-[#0A2F5C] text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-[#061E3B] transition-all transform hover:scale-105 flex items-center"
        >
          Solicitar uma Demonstração <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <button className="bg-slate-100 text-slate-700 font-bold px-8 py-4 rounded-lg hover:bg-slate-200 transition-colors">
          Ver Recursos
        </button>
      </div>
    </div>
  </section>
);

// Componente para os cartões de recursos
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
    <div className="flex items-center justify-center h-16 w-16 bg-[#E6F6FD] rounded-full mb-6">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600">{description}</p>
  </div>
);

// Componente para a seção de Benefícios
const BenefitsSection = () => (
  <section id="beneficios" className="bg-slate-50 py-24">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-900">Resultados que falam por si</h2>
        <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
          Veja como a nossa plataforma transforma métricas de RH em sucesso de negócio.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-[#0A2F5C] text-white p-8 rounded-xl shadow-lg flex flex-col justify-center">
            <p className="text-5xl font-extrabold">70%</p>
            <p className="text-lg font-semibold mt-2">Redução no tempo de contratação</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col justify-center">
            <p className="text-5xl font-extrabold text-slate-900">85%</p>
            <p className="text-lg font-semibold text-slate-600 mt-2">Aumento na retenção de talentos</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col justify-center">
            <p className="text-5xl font-extrabold text-slate-900">60%</p>
            <p className="text-lg font-semibold text-slate-600 mt-2">Diminuição nos custos de recrutamento</p>
        </div>
         <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col justify-center">
            <p className="text-5xl font-extrabold text-slate-900">90%</p>
            <p className="text-lg font-semibold text-slate-600 mt-2">Melhoria na qualidade das contratações</p>
        </div>
      </div>
    </div>
  </section>
);

// Componente para a seção de Recursos
const FeaturesSection = () => (
    <section id="recursos" className="bg-white py-24">
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-900">Uma Plataforma Completa para o seu RH</h2>
                <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
                    Ferramentas poderosas para cada etapa do seu processo seletivo.
                </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<BarChart className="h-8 w-8 text-[#0A2F5C]" />} 
                    title="Testes Comportamentais" 
                    description="Utilize metodologias validadas como DISC, Big Five e mais para entender o perfil de cada candidato." 
                />
                <FeatureCard 
                    icon={<Users className="h-8 w-8 text-[#0A2F5C]" />} 
                    title="Gestão de Candidatos" 
                    description="Centralize informações, acompanhe o progresso e compare perfis num dashboard intuitivo." 
                />
                <FeatureCard 
                    icon={<ShieldCheck className="h-8 w-8 text-[#0A2F5C]" />} 
                    title="Relatórios Inteligentes" 
                    description="Gere relatórios visuais e detalhados para facilitar a tomada de decisão e partilhar com gestores." 
                />
            </div>
        </div>
    </section>
);

// Componente para o CTA (Call to Action)
const CtaSection = () => (
    <section id="contato" className="bg-white">
        <div className="container mx-auto px-6 py-24">
            <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-12 md:p-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para Revolucionar o Seu Recrutamento?</h2>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
                    Junte-se a centenas de empresas que já descobriram o poder da seleção científica.
                </p>
                <Link 
                  to="/register"
                  className="bg-[#0A2F5C] text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-[#061E3B] transition-all transform hover:scale-105 inline-block"
                >
                    Comece o Seu Teste Gratuito
                </Link>
            </div>
        </div>
    </section>
);

// Componente para o Footer
const Footer = () => (
    <footer className="bg-slate-100 border-t border-slate-200">
        <div className="container mx-auto px-6 py-8 text-center text-slate-600">
            <p>&copy; {new Date().getFullYear()} TalentMatch. Todos os direitos reservados.</p>
        </div>
    </footer>
);

// Componente principal da Landing Page
const Landing = () => {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <HeroSection />
        <BenefitsSection />
        <FeaturesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;