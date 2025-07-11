import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { user, signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Credenciais inválidas",
            description: "E-mail ou senha incorretos.",
            variant: "destructive",
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "E-mail não confirmado",
            description: "Verifique seu e-mail e confirme sua conta antes de fazer login.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta ao TalentMatch.",
          variant: "default",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Não foi possível fazer login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await signInWithGoogle();

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Não foi possível fazer login com Google. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
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
            <CardTitle className="text-2xl font-bold text-slate-900">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-slate-600">
              Entre com sua conta para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Login */}
            <Button
              variant="outline"
              className="w-full h-12 border-slate-200 hover:bg-slate-50"
              onClick={handleGoogleLogin}
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

            {/* Email Login Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-slate-200 focus:border-[#0A2F5C] focus:ring-[#0A2F5C]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700">Senha</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-[#0A2F5C] hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 border-slate-200 focus:border-[#0A2F5C] focus:ring-[#0A2F5C]"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-[#0A2F5C] hover:bg-[#061E3B] text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-slate-600">Não tem uma conta? </span>
              <Link 
                to="/register" 
                className="text-[#0A2F5C] hover:underline font-medium"
              >
                Cadastre-se gratuitamente
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
            <p>
              Ao continuar, você concorda com nossos{" "}
              <Link to="/terms" className="text-[#0A2F5C] hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link to="/privacy" className="text-[#0A2F5C] hover:underline">
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;