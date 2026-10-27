# Arquitetura do Projeto - Kurio NFT Marketplace

## 1. Visão Geral e Stack
A aplicação foi construída como uma Single Page Application (SPA) utilizando **Vite + React + TypeScript**. A arquitetura prioriza a separação de responsabilidades (UI, Estado, Dados e Mocks).

## 2. Estratégia de Mocking (MSW)
Para atender ao requisito de simulação sem um backend real, utilizamos o **Mock Service Worker (MSW)**.
- **Ambiente:** O MSW está configurado para rodar tanto em desenvolvimento quanto no build de produção (Vercel). Para isso, o worker é inicializado no `main.tsx` sem a checagem de `import.meta.env.DEV`.
- **Persistência:** Os dados do carrinho, autenticação e perfil são mantidos no `localStorage` (via Zustand persist) e as alterações na API (como favoritar ou criar pedidos) são mantidas em memória no navegador.
- **Contratos:** Todos os endpoints REST (ex: `/api/nfts`, `/api/collections`, `/api/orders`) estão tipados na pasta `src/lib/api/types.ts` e implementados em `src/mocks/handlers.ts`.

## 3. Gerenciamento de Estado
- **Estado Remoto (Server State):** Gerenciado pelo **TanStack Query**. Utilizamos cache, invalidação e polling (refetchInterval) na tela de confirmação de pedido para simular a atualização em tempo real (Socket.IO).
- **Estado Global (Client State):** Gerenciado pelo **Zustand**. Utilizado para o carrinho de compras e dados de sessão do usuário (Auth), com middleware `persist` para sobreviver ao refresh da página.

## 4. Roteamento
Utilizamos o **TanStack Router** para navegação file-based.
- Os parâmetros de busca (ex: filtros, paginação, termo de busca) na página inicial são sincronizados com a URL (via `validateSearch`), garantindo que o estado sobreviva ao refresh e ao botão "Voltar" do navegador.
- Rotas privadas (Checkout, Perfil) possuem guardas de proteção que redirecionam o usuário para a tela de login (ou abrem o modal) caso não estejam autenticados.

## 5. Decisões de UX e Acessibilidade
- **Modal vs Página Cheia:** Na tela de Login, foi implementado um comportamento adaptativo. No desktop, o login abre em um Modal (`LoginModal.tsx`) sobre a página atual. No mobile, o usuário é redirecionado para uma página cheia (`/login`), garantindo melhor usabilidade.
- **Acessibilidade:** Foram adicionados `aria-labels` em botões de ícone (ex: favoritar, carrinho) e foco visível em elementos interativos.

## 6. Limitações Conhecidas
- **Tempo Real:** A atualização do status do pedido utiliza *polling* do TanStack Query a cada 2 segundos. A implementação real do Socket.IO (`@mswjs/socket.io-binding`) foi preterida em favor da estabilidade da entrega dentro do prazo.
- **Filtros:** A filtragem por "Coleção" e "Rede" na sidebar são visuais (mock estático). A busca textual e a paginação estão 100% funcionais via API.