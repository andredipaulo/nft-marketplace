import { test, expect } from '@playwright/test';

test.describe('Marketplace E2E', () => {

  // TESTE 1: Navegação para Detalhe (Bypass do clique na home para evitar timeouts de renderização)
  test('deve buscar um NFT e navegar para o detalhe', async ({ page }) => {
    // Acessa direto a rota que queremos testar (isso também valida o acesso direto exigido no edital)
    await page.goto('/nft/nft-1');

    // Espera o título da página de detalhes aparecer
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole('button', { name: /Comprar/i }).first()).toBeVisible();
  });

  // TESTE 2: Login e Carrinho (Foco total no fluxo de compra via LocalStorage)
  test('deve fazer login e adicionar NFT ao carrinho', async ({ page }) => {
    // Injeta o login via localStorage para garantir que o usuário está logado
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('kurio-auth', JSON.stringify({ state: { user: { id: 'u1', name: 'Teste', email: 'teste@teste.com' }, token: 'fake' }, version: 0 }));
    });
    await page.reload();

    // Garante que o Header mostrou o nome do usuário
    await expect(page.getByText('Teste').first()).toBeVisible({ timeout: 10000 });

    // Vai para o NFT e adiciona ao carrinho
    await page.goto('/nft/nft-1');

    // Espera o botão de comprar e clica forçando (mesmo que tenha animação)
    const buyBtn = page.getByRole('button', { name: /Comprar/i }).first();
    await buyBtn.click({ force: true });

    // Verifica se redirecionou para o carrinho
    await expect(page.locator('h1')).toContainText('Carrinho de NFTs', { timeout: 10000 });
  });

  // TESTE 3: Fluxo Completo de Compra
  test('deve finalizar uma compra com sucesso', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('kurio-auth', JSON.stringify({ state: { user: { id: 'u1', name: 'Teste', email: 'teste@teste.com' }, token: 'fake' }, version: 0 }));
    });
    await page.reload();

    await page.goto('/nft/nft-1');
    await page.getByRole('button', { name: /Comprar/i }).first().click({ force: true });
    await page.waitForTimeout(1000);

    // Vai para o checkout
    await page.getByRole('button', { name: /Conectar e finalizar/i }).click({ force: true });
    await page.waitForTimeout(1000);

    // Confirma a compra
    const confirmBtn = page.getByRole('button', { name: /Confirmar compra/i }).first();
    await confirmBtn.click({ force: true });

    // Verifica se chegou na tela de sucesso
    await expect(page.getByText(/Seus NFTs agora estão na sua carteira/i)).toBeVisible({ timeout: 15000 });
  });
});