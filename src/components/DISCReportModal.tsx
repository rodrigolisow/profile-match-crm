import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DISCScore {
  D: number;
  I: number;
  S: number;
  C: number;
  percentage?: number;
  dominantProfile?: string;
}

interface DISCReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: DISCScore;
  assessmentName: string;
  completedAt: string;
}

const DISC_DESCRIPTIONS = {
  D: {
    title: "Dominância",
    description: "Pessoas com perfil Dominante são orientadas para resultados, diretas e decididas. Elas gostam de desafios, assumem riscos calculados e preferem ambientes onde podem exercer controle e autoridade. São naturalmente competitivas e focadas em objetivos.",
    characteristics: ["Orientado para resultados", "Direto e objetivo", "Gosta de desafios", "Assume liderança", "Toma decisões rápidas"]
  },
  I: {
    title: "Influência", 
    description: "Indivíduos com perfil de Influência são comunicativos, otimistas e persuasivos. Eles se destacam em ambientes sociais, gostam de trabalhar com pessoas e são naturalmente motivadores. Valorizam o reconhecimento e preferem ambientes colaborativos.",
    characteristics: ["Comunicativo e expressivo", "Otimista e entusiasta", "Persuasivo", "Sociável", "Motivador de equipes"]
  },
  S: {
    title: "Estabilidade",
    description: "Pessoas com perfil de Estabilidade são pacientes, confiáveis e leais. Elas preferem ambientes estáveis e previsíveis, são excelentes ouvintes e trabalham bem em equipe. Valorizam a harmonia e evitam conflitos.",
    characteristics: ["Paciente e calmo", "Confiável e leal", "Bom ouvinte", "Trabalha bem em equipe", "Busca harmonia"]
  },
  C: {
    title: "Conformidade",
    description: "Indivíduos com perfil de Conformidade são analíticos, precisos e detalhistas. Eles valorizam a qualidade, seguem procedimentos estabelecidos e são sistemáticos em sua abordagem. Preferem basear decisões em dados e fatos.",
    characteristics: ["Analítico e preciso", "Detalhista", "Segue procedimentos", "Busca qualidade", "Baseado em dados"]
  }
};

const DISCReportModal = ({ isOpen, onClose, score, assessmentName, completedAt }: DISCReportModalProps) => {
  const radarData = [
    { subject: 'Dominância', A: score.D, fullMark: 100 },
    { subject: 'Influência', A: score.I, fullMark: 100 },
    { subject: 'Estabilidade', A: score.S, fullMark: 100 },
    { subject: 'Conformidade', A: score.C, fullMark: 100 },
  ];

  const barData = [
    { name: 'D', value: score.D, color: '#ef4444' },
    { name: 'I', value: score.I, color: '#f59e0b' },
    { name: 'S', value: score.S, color: '#10b981' },
    { name: 'C', value: score.C, color: '#3b82f6' },
  ];

  const dominantProfile = score.dominantProfile || Object.entries(score).reduce((a, b) => 
    score[a[0] as keyof DISCScore] > score[b[0] as keyof DISCScore] ? a : b
  )[0];

  const dominantProfileInfo = DISC_DESCRIPTIONS[dominantProfile as keyof typeof DISC_DESCRIPTIONS];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Relatório DISC</span>
            <Badge variant="secondary">{assessmentName}</Badge>
          </DialogTitle>
          <DialogDescription>
            Concluído em {formatDate(completedAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Perfil Predominante */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Perfil Predominante: 
                <Badge variant="default" className="text-lg px-3 py-1">
                  {dominantProfile} - {dominantProfileInfo?.title}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {dominantProfileInfo?.description}
              </p>
              <div>
                <h4 className="font-medium mb-2">Características principais:</h4>
                <ul className="space-y-1">
                  {dominantProfileInfo?.characteristics.map((char, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      {char}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Gráficos */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Gráfico de Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Gráfico de Radar - Perfil DISC</CardTitle>
                <CardDescription>
                  Visualização completa dos quatro perfis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" className="text-sm" />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        className="text-xs"
                      />
                      <Radar
                        name="Score"
                        dataKey="A"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Barras */}
            <Card>
              <CardHeader>
                <CardTitle>Gráfico de Barras - Pontuações</CardTitle>
                <CardDescription>
                  Comparação direta dos scores DISC
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Score']}
                        labelFormatter={(label) => `Perfil ${label}`}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalhes dos Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento dos Perfis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(DISC_DESCRIPTIONS).map(([key, info]) => (
                  <div key={key} className="text-center p-4 rounded-lg border bg-card/50">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {score[key as keyof DISCScore]}%
                    </div>
                    <div className="font-medium text-sm mb-1">{key}</div>
                    <div className="text-xs text-muted-foreground">{info.title}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DISCReportModal;