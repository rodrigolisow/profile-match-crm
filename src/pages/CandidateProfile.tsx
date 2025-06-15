import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  full_name: string;
  role: string;
}

interface CandidateData {
  phone: string;
  address: string;
  birth_date: string;
  linkedin_profile: string;
}

const CandidateProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: "",
    role: "candidate"
  });
  const [candidate, setCandidate] = useState<CandidateData>({
    phone: "",
    address: "",
    birth_date: "",
    linkedin_profile: ""
  });

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    try {
      // Fetch profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch candidate data
      const { data: candidateData } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', user.id)
        .single();

      if (candidateData) {
        setCandidate(candidateData);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Check if candidate record exists
      const { data: existingCandidate } = await supabase
        .from('candidates')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingCandidate) {
        // Update existing candidate
        const { error: candidateError } = await supabase
          .from('candidates')
          .update(candidate)
          .eq('id', user.id);

        if (candidateError) throw candidateError;
      } else {
        // Insert new candidate record
        const { error: candidateError } = await supabase
          .from('candidates')
          .insert({
            id: user.id,
            ...candidate
          });

        if (candidateError) throw candidateError;
      }

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">HR</span>
              </div>
              <span className="text-xl font-bold text-foreground">TalentMatch</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
              <User className="h-8 w-8 mr-3" />
              Meu Perfil
            </h1>
            <p className="text-muted-foreground">
              Complete suas informações pessoais para uma melhor experiência
            </p>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Mantenha seus dados atualizados para que as empresas possam entrar em contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  value={profile.full_name}
                  onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={candidate.phone}
                  onChange={(e) => setCandidate(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={candidate.birth_date}
                  onChange={(e) => setCandidate(prev => ({ ...prev, birth_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Textarea
                  id="address"
                  value={candidate.address}
                  onChange={(e) => setCandidate(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Rua, número, bairro, cidade, estado"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={candidate.linkedin_profile}
                  onChange={(e) => setCandidate(prev => ({ ...prev, linkedin_profile: e.target.value }))}
                  placeholder="https://linkedin.com/in/seu-perfil"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Salvando..." : "Salvar Perfil"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;