import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Assessment {
  id: string;
  name: string;
  description: string;
  instructions: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
}

// Sample questions for the placeholder test
const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "Em reuniões de trabalho, você prefere:",
    options: [
      "Liderar as discussões e tomar decisões rápidas",
      "Motivar a equipe e gerar entusiasmo",
      "Ouvir atentamente e mediar conflitos",
      "Analisar dados e apresentar fatos"
    ]
  },
  {
    id: 2,
    question: "Quando enfrenta um problema complexo, sua primeira reação é:",
    options: [
      "Agir imediatamente para resolver",
      "Buscar opiniões de outras pessoas",
      "Pensar cuidadosamente antes de agir",
      "Pesquisar e analisar todas as informações"
    ]
  },
  {
    id: 3,
    question: "Em um ambiente de trabalho, você se sente mais confortável quando:",
    options: [
      "Está no comando das situações",
      "Trabalha em equipe e socializa",
      "Tem estabilidade e rotina",
      "Segue procedimentos bem definidos"
    ]
  },
  {
    id: 4,
    question: "Sob pressão, você tende a:",
    options: [
      "Manter o foco nos resultados",
      "Buscar apoio da equipe",
      "Trabalhar de forma mais cautelosa",
      "Verificar todos os detalhes"
    ]
  },
  {
    id: 5,
    question: "Ao comunicar uma ideia, você prefere:",
    options: [
      "Ser direto e objetivo",
      "Usar entusiasmo e persuasão",
      "Ser diplomático e gentil",
      "Apresentar dados e evidências"
    ]
  },
  {
    id: 6,
    question: "Em mudanças organizacionais, você:",
    options: [
      "Lidera a transformação",
      "Motiva outros a aceitar a mudança",
      "Precisa de tempo para se adaptar",
      "Analisa os impactos da mudança"
    ]
  },
  {
    id: 7,
    question: "Seu estilo de tomada de decisão é:",
    options: [
      "Rápido e decidido",
      "Baseado na intuição e feedback",
      "Cuidadoso e consensual",
      "Baseado em análise detalhada"
    ]
  },
  {
    id: 8,
    question: "Em conflitos, você normalmente:",
    options: [
      "Enfrenta diretamente",
      "Tenta mediar e harmonizar",
      "Evita confrontos",
      "Busca soluções lógicas"
    ]
  },
  {
    id: 9,
    question: "Seu ritmo de trabalho ideal é:",
    options: [
      "Rápido e variado",
      "Dinâmico e interativo",
      "Constante e estável",
      "Metódico e organizado"
    ]
  },
  {
    id: 10,
    question: "Ao trabalhar em projetos, você:",
    options: [
      "Foca nos objetivos principais",
      "Busca inovação e criatividade",
      "Valoriza a qualidade do processo",
      "Garante precisão e conformidade"
    ]
  }
];

const TestTaking = () => {
  const { user } = useAuth();
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(sampleQuestions.length).fill(-1));
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  const fetchAssessment = async () => {
    try {
      const { data } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();

      if (data) {
        setAssessment(data);
      }
    } catch (error) {
      console.error('Error fetching assessment:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o teste.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    setShowInstructions(false);
    setStartTime(new Date());
  };

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    const unansweredQuestions = answers.findIndex(answer => answer === -1);
    if (unansweredQuestions !== -1) {
      toast({
        title: "Teste incompleto",
        description: `Por favor, responda a pergunta ${unansweredQuestions + 1}.`,
        variant: "destructive"
      });
      setCurrentQuestion(unansweredQuestions);
      return;
    }

    setSubmitting(true);
    try {
      // First ensure candidate record exists
      const { data: candidateExists } = await supabase
        .from('candidates')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!candidateExists) {
        // Create candidate record
        const { error: candidateError } = await supabase
          .from('candidates')
          .insert({ id: user.id });

        if (candidateError) throw candidateError;
      }

      // Calculate basic score (for demonstration)
      const scoreBreakdown = {
        D: answers.filter(answer => answer === 0).length, // Dominance
        I: answers.filter(answer => answer === 1).length, // Influence
        S: answers.filter(answer => answer === 2).length, // Steadiness
        C: answers.filter(answer => answer === 3).length  // Compliance
      };

      const totalScore = Object.values(scoreBreakdown).reduce((a, b) => a + b, 0);
      const percentageScore = Math.round((totalScore / (sampleQuestions.length * 4)) * 100);

      // Save result
      const { error } = await supabase
        .from('results')
        .insert({
          candidate_id: user.id,
          assessment_id: assessmentId,
          answers: {
            questions: sampleQuestions.map((q, index) => ({
              question: q.question,
              selected_option: answers[index],
              option_text: q.options[answers[index]]
            }))
          },
          score: {
            breakdown: scoreBreakdown,
            total_score: totalScore,
            percentage: percentageScore,
            completed_time: startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000) : 0
          },
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Teste concluído!",
        description: "Suas respostas foram salvas com sucesso."
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p>Teste não encontrado.</p>
            <Link to="/dashboard">
              <Button className="mt-4">Voltar ao Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
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
                Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium">{assessment.name}</span>
            </div>
          </div>
          {!showInstructions && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Pergunta {currentQuestion + 1} de {sampleQuestions.length}
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {showInstructions ? (
            <Card className="border-0 shadow-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{assessment.name}</CardTitle>
                <CardDescription className="text-lg">
                  {assessment.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">Instruções:</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {assessment.instructions}
                  </p>
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p>• O teste contém {sampleQuestions.length} perguntas</p>
                    <p>• Cada pergunta tem 4 opções de resposta</p>
                    <p>• Você pode navegar entre as perguntas</p>
                    <p>• Certifique-se de responder todas as perguntas antes de finalizar</p>
                  </div>
                </div>
                <div className="text-center">
                  <Button onClick={handleStartTest} size="lg">
                    Iniciar Teste
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progresso do Teste</span>
                  <span>{Math.round(((currentQuestion + 1) / sampleQuestions.length) * 100)}%</span>
                </div>
                <Progress 
                  value={((currentQuestion + 1) / sampleQuestions.length) * 100} 
                  className="h-3"
                />
              </div>

              {/* Question */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Pergunta {currentQuestion + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <h2 className="text-xl font-medium leading-relaxed">
                    {sampleQuestions[currentQuestion].question}
                  </h2>
                  
                  <div className="space-y-3">
                    {sampleQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left rounded-lg border transition-colors ${
                          answers[currentQuestion] === index
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            answers[currentQuestion] === index
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}>
                            {answers[currentQuestion] === index && (
                              <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                    >
                      Anterior
                    </Button>
                    
                    <div className="flex space-x-3">
                      {currentQuestion === sampleQuestions.length - 1 ? (
                        <Button
                          onClick={handleSubmit}
                          disabled={answers[currentQuestion] === -1 || submitting}
                        >
                          {submitting ? "Finalizando..." : "Finalizar Teste"}
                        </Button>
                      ) : (
                        <Button
                          onClick={handleNext}
                          disabled={answers[currentQuestion] === -1}
                        >
                          Próxima
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestTaking;