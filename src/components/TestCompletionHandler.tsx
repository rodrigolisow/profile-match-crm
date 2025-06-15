import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TestCompletionHandlerProps {
  resultId: string;
  onScoreCalculated?: (score: any) => void;
}

const TestCompletionHandler = ({ resultId, onScoreCalculated }: TestCompletionHandlerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const calculateScore = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('calculate-disc-score', {
          body: { resultId }
        });

        if (error) {
          throw error;
        }

        if (data.success) {
          toast({
            title: "Score calculado com sucesso!",
            description: "Os resultados do teste DISC foram processados.",
          });
          
          if (onScoreCalculated) {
            onScoreCalculated(data.score);
          }
        }
      } catch (error) {
        console.error('Error calculating DISC score:', error);
        toast({
          title: "Erro ao calcular score",
          description: "Não foi possível processar os resultados do teste.",
          variant: "destructive",
        });
      }
    };

    if (resultId) {
      calculateScore();
    }
  }, [resultId, onScoreCalculated, toast]);

  return null; // This component doesn't render anything
};

export default TestCompletionHandler;