import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, Users, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, Navigate, useNavigate } from "react-router-dom";

interface Candidate {
  id: string;
  profiles: {
    full_name: string;
  };
  phone: string | null;
  address: string | null;
  birth_date: string | null;
  linkedin_profile: string | null;
  company_id: string | null;
  email?: string;
  testStatus: 'Pendente' | 'Concluído' | 'Em Andamento';
}

interface Company {
  id: string;
  name: string;
}

const AdminCandidates = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const [company, setCompany] = useState<Company | null>(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchCandidates();
    }
  }, [userRole]);

  useEffect(() => {
    // Filter candidates based on search term
    const filtered = candidates.filter(candidate =>
      candidate.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (candidate.email && candidate.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCandidates(filtered);
  }, [searchTerm, candidates]);

  const fetchUserRole = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserRole(profile.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchCandidates = async () => {
    try {
      // First get the company
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('admin_user_id', user.id)
        .single();

      if (companyData) {
        setCompany(companyData);

        // Get candidates linked to this company
        const { data: candidatesData } = await supabase
          .from('candidates')
          .select(`
            *,
            profiles!inner(full_name)
          `)
          .eq('company_id', companyData.id);

        if (candidatesData) {
          // For each candidate, get their test status
          const candidatesWithStatus = await Promise.all(
            candidatesData.map(async (candidate) => {
              // Get email from auth.users metadata or profiles
              const { data: authUser } = await supabase.auth.admin.getUserById(candidate.id);
              const email = authUser.user?.email;

              // Check test results
              const { data: results } = await supabase
                .from('results')
                .select('completed_at')
                .eq('candidate_id', candidate.id);

              let testStatus: 'Pendente' | 'Concluído' | 'Em Andamento' = 'Pendente';
              
              if (results && results.length > 0) {
                const hasCompleted = results.some(result => result.completed_at);
                const hasIncomplete = results.some(result => !result.completed_at);
                
                if (hasCompleted && !hasIncomplete) {
                  testStatus = 'Concluído';
                } else if (hasIncomplete) {
                  testStatus = 'Em Andamento';
                }
              }

              return {
                ...candidate,
                email,
                testStatus
              };
            })
          );

          setCandidates(candidatesWithStatus);
          setFilteredCandidates(candidatesWithStatus);
        }
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-cyan-100 text-cyan-800";
      case "Em Andamento":
        return "bg-blue-50 text-blue-700";
      case "Pendente":
        return "bg-slate-100 text-slate-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const handleCandidateClick = (candidateId: string) => {
    navigate(`/admin/candidates/${candidateId}`);
  };

  if (userRole && userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

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
            <Link to="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">HR</span>
              </div>
              <span className="text-xl font-bold text-foreground">TalentMatch</span>
              <Badge variant="secondary" className="ml-2">Admin</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {company?.name || 'Empresa'}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Users className="h-8 w-8 mr-3" />
            Gerenciar Candidatos
          </h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os candidatos da sua empresa
          </p>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar candidatos por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Candidates Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Lista de Candidatos</CardTitle>
            <CardDescription>
              {filteredCandidates.length} candidato(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'Nenhum candidato encontrado com esse filtro.' : 'Nenhum candidato cadastrado ainda.'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status do Teste</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow 
                      key={candidate.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleCandidateClick(candidate.id)}
                    >
                      <TableCell className="font-medium">
                        {candidate.profiles.full_name || 'Nome não informado'}
                      </TableCell>
                      <TableCell>
                        {candidate.email || 'Email não disponível'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(candidate.testStatus)}>
                          {candidate.testStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCandidates;