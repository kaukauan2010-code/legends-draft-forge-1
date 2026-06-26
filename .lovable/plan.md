## Por que dividir

O modo online tem ~4.400 linhas espalhadas em 6 arquivos. Fazer os 10 pedidos num turno só (incluindo "online = espelho idêntico do solo", "CPU assume em qualquer fase com reconexão", "draft simultâneo + por turno") quebra a build com altíssima probabilidade. Divido em 3 fases curtas — você aprova e eu sigo.

## Fase 1 — Bugs + Lobby + UX básica (este turno)

**Cobre os itens 1, 2, 7, 8, 9, 10 — os que estão travando você hoje.**

- **#10 — Migration**: adicionar coluna `encerrada boolean default false` em `partida_online` (corrige o erro "Could not find the 'encerrada' column").
- **#9 — Bug 1x1**: investigar e corrigir "slot de confrontos não encontrados" quando `competicao = 'final'` (provavelmente o gerador de chaveamento não cria slot pra final direta).
- **#1 — Lobby reformulado**:
  - Remover botão "+ CPU".
  - Mostrar lista com `max_jogadores` slots (32/16/2). Slots vazios mostram "Aguardando jogador…" (vira bot ao iniciar).
  - Botão "Iniciar" liberado quando: (a) só o mestre na sala, OU (b) todos os humanos presentes marcados como "pronto". Bloqueado mostra toast "Aguardando todos ficarem prontos".
  - Ao apertar Iniciar, slots vazios viram CPU automaticamente.
- **#2 — Compartilhar sala**: botão que abre Web Share API (mobile) com fallback de copiar link `https://.../online?codigo=XXXX`. Atualizar `/online` pra ler `?codigo=` e pular direto pro lobby.
- **#7 — Abandonar sala**: botão "Sair da sala" no header do draft online e do torneio online (já existe no lobby).
- **#8 — Bandeiras**: humanos recebem bandeira aleatória persistida; CPUs usam bandeira da seleção que controlam (no torneio). No lobby, CPU pega bandeira aleatória até o sorteio.

## Fase 2 — Espelhamento solo↔online + Draft (próximo turno)

**Cobre 3, 4, 5, 6.**

- Reescrever `online.$codigo.torneio.tsx` reusando os mesmos componentes do solo (`CampoAoVivo`, `ChaveamentoVisual`, cards de partida, fase de grupos) — hoje há divergência de UI/lógica.
- Botão "Sortear 11" no draft online (igual solo).
- Barra de 30s por jogador no draft online (servidor controla o timer pra ser justo).
- Remover botão "Iniciar partida" pós-draft — auto-start quando todos confirmarem.
- Toggle "Simultâneo / Por turno" na criação da sala (mestre escolhe).
- Bloqueio de jogadores já escolhidos por outros players (regra detalhada que você descreveu).

## Fase 3 — Reconexão + CPU assume (turno seguinte)

**A parte mais complexa, exige presença em tempo real.**

- Detecção de desconexão via Supabase Presence.
- CPU assume controle em draft / grupos / mata-mata quando jogador sai.
- Reconexão devolve controle ao humano.
- Mensagem "Aguardando jogador X terminar" quando seu adversário ainda está jogando.

## Detalhes técnicos (referência)

- Migration: `ALTER TABLE public.partida_online ADD COLUMN encerrada boolean NOT NULL DEFAULT false;`
- Lobby: lógica `podeIniciar = humanos.length === 1 || humanos.every(j => j.pronto)`.
- Compartilhar: `navigator.share?.({ url, title }) ?? navigator.clipboard.writeText(url)`.
- Bandeiras humanos: campo `bandeira text` em `sala_jogadores`, sorteado no insert (lista de ISO países).
- Bug 1x1: investigar `gerarChaveamento` em `torneio-online.functions.ts` quando `competicao = 'final'`.

## Confirma fase 1 agora?

Se topar, entrego os 6 itens da fase 1 já no próximo turno. Senão me diga o que ajustar (escopo, ordem, agrupar diferente).