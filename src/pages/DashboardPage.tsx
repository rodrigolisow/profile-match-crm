import React, { useEffect, useState } from 'react';
import { BarChart2, CheckCircle, Clock, User, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import DISCReportModal from '@/components/DISCReportModal';
import type { Json } from '@/integrations/supabase/types';

// --- Paleta de Cores DIS ---
const colors = {
  primary: '#0A2F5C', // Azul escuro
  accent: '#00A9E0',  // Ciano
};

interface Assessment {
  id: string;
  name: string;
  description: string;
  instructions: string;
}

interface Result {
  id: string;
  assessment_id: string;
  completed_at: string | null;
  score: Json;
}

interface Profile {
  full_name: string;
}

interface AssessmentWithStatus extends Assessment {
  status: 'Concluído' | 'Pendente';
}

interface DISCScore {
  D: number;
  I: number;
  S: number;
  C: number;
  percentage?: number;
  dominantProfile?: string;
}

// Componente do Cabeçalho do Dashboard
const DashboardHeader = ({ userName }: { userName: string }) => (
  <header className="bg-white border-b border-slate-200 p-4 sm:p-6 flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Painel do Candidato</h1>
      <p className="text-sm text-slate-500">Bem-vindo(a) de volta, {userName}!</p>
    </div>
    <div className="flex items-center space-x-4 sm:space-x-6">
      <button className="relative text-slate-500 hover:text-slate-800">
        <Bell size={24} />
        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
          <User size={20} className="text-slate-500" />
        </div>
        <div className="hidden sm:block">
          <p className="font-semibold text-slate-700">{userName}</p>
          <p className="text-xs text-slate-500">Candidato</p>
        </div>
        <ChevronDown size={20} className="text-slate-500 cursor-pointer" />
      </div>
    </div>
  </header>
);

// Componente de Cartão de Métrica (KPI)
const KpiCard = ({ title, value, icon, colorClass }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between transition-all hover:shadow-lg hover:-translate-y-1">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorClass}`}>
      {icon}
    </div>
  </div>
);

// Componente da Tabela de Avaliações
const AssessmentsTable = ({ 
  assessments, 
  onStartTest,
  onViewResult 
}: { 
  assessments: AssessmentWithStatus[];
  onStartTest: (assessmentId: string) => void;
  onViewResult: (assessmentId: string) => void;
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-slate-800 mb-4">Minhas Avaliações</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="py-3 px-4 font-normal">Avaliação</th>
              <th className="py-3 px-4 font-normal text-center">Status</th>
              <th className="py-3 px-4 font-normal text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                <td className="py-4 px-4 font-semibold text-slate-700">{item.name}</td>
                <td className="py-4 px-4 text-center">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'Concluído' 
                      ? 'bg-cyan-100 text-cyan-800' // Cor Ciano para Concluído
                      : 'bg-slate-100 text-slate-600' // Cor Cinza para Pendente
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button 
                    className={`font-semibold text-white px-4 py-2 rounded-lg shadow-sm transition-all transform hover:scale-105 ${
                      item.status === 'Concluído' 
                        ? 'bg-[#00A9E0] hover:bg-[#0097c7]' 
                        : 'bg-[#0A2F5C] hover:bg-[#061E3B]'
                    }`}
                    onClick={() => item.status === 'Concluído' ? onViewResult(item.id) : onStartTest(item.id)}
                  >
                    {item.status === 'Concluído' ? 'Ver Resultado' : 'Iniciar Teste'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente principal do Dashboard
export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [assessmentsWithStatus, setAssessmentsWithStatus] = useState<AssessmentWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para o modal de relatório
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedResultData, setSelectedResultData] = useState<{
    score: DISCScore;
    assessmentName: string;
    completedAt: string;
  } | null>(null);

  // Estatísticas calculadas
  const completedTests = results.filter(result => result.completed_at).length;
  const pendingTests = assessments.length - completedTests;

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  useEffect(() => {
    // Atualizar assessments com status quando dados mudarem
    if (assessments.length > 0) {
      const assessmentsWithStatusData = assessments.map(assessment => {
        const result = results.find(r => r.assessment_id === assessment.id);
        const status: 'Concluído' | 'Pendente' = result?.completed_at ? 'Concluído' : 'Pendente';
        
        return {
          ...assessment,
          status
        };
      });
      
      setAssessmentsWithStatus(assessmentsWithStatusData);
    }
  }, [assessments, results]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Buscar perfil do usuário
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Buscar todas as avaliações disponíveis
      const { data: assessmentsData } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: true });

      if (assessmentsData) {
        setAssessments(assessmentsData);
      }

      // Buscar resultados do usuário
      const { data: resultsData } = await supabase
        .from('results')
        .select('*')
        .eq('candidate_id', user.id);

      if (resultsData) {
        setResults(resultsData);
      }

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (assessmentId: string) => {
    navigate(`/teste/${assessmentId}`);
  };

  const handleViewResult = async (assessmentId: string) => {
    if (!user) return;

    try {
      // Buscar o resultado específico do usuário para este assessment
      const { data: resultData } = await supabase
        .from('results')
        .select('score, completed_at')
        .eq('candidate_id', user.id)
        .eq('assessment_id', assessmentId)
        .not('completed_at', 'is', null)
        .single();

      if (!resultData) {
        console.error('Resultado não encontrado');
        return;
      }

      // Buscar informações do assessment
      const { data: assessmentData } = await supabase
        .from('assessments')
        .select('name')
        .eq('id', assessmentId)
        .single();

      if (!assessmentData) {
        console.error('Assessment não encontrado');
        return;
      }

      // Configurar dados para o modal
      setSelectedResultData({
        score: resultData.score as unknown as DISCScore,
        assessmentName: assessmentData.name,
        completedAt: resultData.completed_at
      });

      setIsReportModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar resultado:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0A2F5C]"></div>
      </div>
    );
  }

  const userName = profile?.full_name || 'Candidato';

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader userName={userName} />
      <main className="p-4 sm:p-8">
        {/* Seção de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KpiCard 
            title="Testes Concluídos" 
            value={completedTests} 
            icon={<CheckCircle size={24} className="text-white" />}
            colorClass="bg-[#00A9E0]" // Cor Ciano para Concluído
          />
          <KpiCard 
            title="Testes Pendentes" 
            value={pendingTests} 
            icon={<Clock size={24} className="text-white" />}
            colorClass="bg-slate-500" // Cor Cinza para Pendente
          />
          <KpiCard 
            title="Perfil Principal (DISC)" 
            value="Em Breve" 
            icon={<BarChart2 size={24} className="text-white" />}
            colorClass="bg-[#0A2F5C]" // Cor Azul Principal
          />
        </div>

        {/* Seção da Tabela */}
        <AssessmentsTable 
          assessments={assessmentsWithStatus}
          onStartTest={handleStartTest}
          onViewResult={handleViewResult}
        />

        {/* Modal de Relatório DISC */}
        {selectedResultData && (
          <DISCReportModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            score={selectedResultData.score}
            assessmentName={selectedResultData.assessmentName}
            completedAt={selectedResultData.completedAt}
          />
        )}
      </main>
    </div>
  );
}