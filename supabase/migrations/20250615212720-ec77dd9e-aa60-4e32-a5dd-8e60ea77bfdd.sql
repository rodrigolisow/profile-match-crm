-- Habilitar RLS nas tabelas se ainda não estiver habilitado
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Verificar se as políticas existem antes de criar

-- Política para assessments (todos usuários autenticados podem ver)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'assessments' 
        AND policyname = 'Anyone can view assessments'
    ) THEN
        CREATE POLICY "Anyone can view assessments" ON public.assessments
        FOR SELECT TO authenticated USING (true);
    END IF;
END $$;

-- Políticas para results (usuários só podem ver seus próprios resultados)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'results' 
        AND policyname = 'Users can view their own results'
    ) THEN
        CREATE POLICY "Users can view their own results" ON public.results
        FOR SELECT TO authenticated USING (auth.uid() = candidate_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'results' 
        AND policyname = 'Users can insert their own results'
    ) THEN
        CREATE POLICY "Users can insert their own results" ON public.results
        FOR INSERT TO authenticated WITH CHECK (auth.uid() = candidate_id);
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'results' 
        AND policyname = 'Users can update their own results'
    ) THEN
        CREATE POLICY "Users can update their own results" ON public.results
        FOR UPDATE TO authenticated USING (auth.uid() = candidate_id);
    END IF;
END $$;