# Kurio - NFT Marketplace (Desafio Frontend)

Este projeto é a implementação de um Marketplace de NFTs, construído em React, TypeScript e Vite, seguindo o layout do Figma e as diretrizes do desafio.

## 🚀 Tecnologias Utilizadas

- **React + TypeScript + Vite:** Base da aplicação.
- **TanStack Router:** Roteamento tipado e controle de parâmetros de busca (URL state).
- **TanStack Query:** Gerenciamento de estado assíncrono, cache e sincronização.
- **Axios:** Cliente HTTP para consumo da API.
- **MSW (Mock Service Worker):** Interceptação de requisições para simular o backend REST.
- **Zustand:** Gerenciamento de estado global (Carrinho e Autenticação) com persistência em `localStorage`.
- **Tailwind CSS + Shadcn/ui:** Estilização e componentes acessíveis.
- **Playwright:** Testes End-to-End (E2E).
- **Lucide React:** Ícones.

## 🔐 Credenciais de Teste (Mock)

Para acessar as áreas restritas (Checkout, Perfil, Carteiras):

- **E-mail:** `teste@teste.com` (ou qualquer e-mail válido)
- **Senha:** `123456`

*Dica:* O cupom de desconto simulado é o **`KURIO10`** (aplica 10% de desconto no carrinho).

## 💻 Como rodar localmente

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento
   ```bash
    npm run dev
   ```
4. Acesse http://localhost:5173
5. Para rodar os testes com Playwright:
   ```bash
   npx playwright install
   npx playwright test
   ```
6. Para visualizar o relatório dos testes:
   ```bash
   npx playwright show-report
   ```
7. Build e Deploy - Para gerar a versão de produção:
   ```bash
   npm run build
   ```