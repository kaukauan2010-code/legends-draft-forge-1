ALTER TABLE public.partida_online ADD COLUMN IF NOT EXISTS encerrada boolean NOT NULL DEFAULT false;
ALTER TABLE public.sala_jogadores ADD COLUMN IF NOT EXISTS bandeira text;