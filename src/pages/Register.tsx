import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    cnpj: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro de validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Erro de validação",
        description: "Você deve aceitar os termos de uso.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement Supabase registration after integration
      toast({
        title: "Aguardando integração com Supabase",
        description: "O cadastro será implementado após conectar ao Supabase.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Implement Google OAuth with Supabase
      toast({
        title: "Aguardando integração com Supabase",
        description: "O cadastro com Google será implementado após conectar ao Supabase.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível cadastrar com Google. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="h-10 w-10 bg-[#0A2F5C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">DIS</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">
              Talent<span style={{ color: '#0A2F5C' }}>Match</span>
            </span>
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">Crie sua conta</CardTitle>
            <CardDescription className="text-slate-600">
              Comece seu teste gratuito de 14 dias agora mesmo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Signup */}
            <Button
              variant="outline"
              className="w-full h-12 border-slate-200 hover:bg-slate-50"
              onClick={handleGoogleSignup}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continuar com Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">ou</span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-slate-700">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    placeholder="Sua Empresa Ltda"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="h-11 border-slate-200 focus:border-[#0A2F5C] focus:ring-[#0A2F5C]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj" className="text-slate-700">CNPJ</Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    type="text"
                    placeholder="00.000.000/0001-00"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    required
                    className="h-11 border-slate-200 focus:border-[#0A2F5C] focus:ring-[#0A2F5C]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-700">Nome Completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="h-11 border-slate-200 focus:border-[#0A2F5C] focus:ring-[#0A2F5C]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">E-mail Corporativo</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="voce@empresa.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-11 border-slate-200 focus:border-[#0A2F5C] focus:ring-[#0A2F5C]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-700">Cargo</Label>
                <Select onValueChange={handleSelectChange} required>
                  <SelectTrigger className="h-11 border-slate-200 focus:border-[#0A2F5C] focus:ring-[#0A2F5C]">
                    <SelectValue placeholder="Selecione seu cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rh-director">Diretor(a) de RH</SelectItem>
                    <SelectItem value="rh-manager">Gerente de RH</SelectItem>
                    <SelectItem value="recruiter">Recrutador(a)</SelectItem>
                    <SelectItem value="ceo">CEO/Fundador(a)</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="h-11 border-slate-200 focus:border-[#0A2F5C] focus:ring-[#0A2F5C]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="h-11 border-slate-200 focus:border-[#0A2F5C] focus:ring-[#0A2F5C]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                  }
                />
                <Label htmlFor="acceptTerms" className="text-sm leading-relaxed text-slate-700">
                  Aceito os{" "}
                  <Link to="/terms" className="text-[#0A2F5C] hover:underline">
                    termos de uso
                  </Link>{" "}
                  e a{" "}
                  <Link to="/privacy" className="text-[#0A2F5C] hover:underline">
                    política de privacidade
                  </Link>
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-[#0A2F5C] hover:bg-[#061E3B] text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Criando conta..." : "Criar conta gratuita"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-slate-600">Já tem uma conta? </span>
              <Link 
                to="/login" 
                className="text-[#0A2F5C] hover:underline font-medium"
              >
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 space-y-4">
          <Link 
            to="/" 
            className="inline-block text-[#0A2F5C] hover:underline font-medium"
          >
            ← Retornar ao início
          </Link>
          <div className="text-sm text-slate-500">
            <p>✓ 14 dias grátis • ✓ Sem compromisso • ✓ Cancele quando quiser</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;