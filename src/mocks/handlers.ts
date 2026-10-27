import { http, HttpResponse } from 'msw'
import { mockNFTs } from './fixtures'
import type { Order } from '@/lib/api/types'
import { collections, networks} from "./fixtures";

const ordersDb = new Map<string, Order>()

export const handlers = [

  http.get('/api/collections', async () => {
    const data = collections.map((name, index) => ({
      id: name.toLowerCase().replace(' ', '-'),
      name,
      count: (index + 1) * 11
    }))
    return HttpResponse.json(data)
  }),

  http.get('/api/networks', async () => {
    const data = networks.map((name, index) => ({
      id: name.toLowerCase().replace(' ', '-'),
      name,
      count: (index + 1) * 11
    }))
    return HttpResponse.json(data)
  }),


  // Rota de Listagem (já existente)
  http.get('/api/nfts', async ({ request }) => {
    await new Promise((r) => setTimeout(r, 400))
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase() || ''
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '9', 10)

    const filtered = mockNFTs.filter((nft) => nft.name.toLowerCase().includes(q))
    const total = filtered.length
    const start = (page - 1) * limit
    const items = filtered.slice(start, start + limit)

    return HttpResponse.json({ items, total, page, limit })
  }),

  // NOVA ROTA: Detalhe de um NFT
  http.get('/api/nfts/:id', async ({ params }) => {
    await new Promise((r) => setTimeout(r, 400))
    const { id } = params
    const nft = mockNFTs.find((n) => n.id === id)

    if (!nft) {
      return new HttpResponse(null, { status: 404, statusText: 'Not Found' })
    }
    return HttpResponse.json(nft)
  }),

  http.post('/api/cart/validate-coupon', async ({ request }) => {
    await new Promise((r) => setTimeout(r, 600)) // Simula rede
    const body = await request.json() as { code: string }

    if (body.code.toUpperCase() === 'KURIO10') {
      return HttpResponse.json({
        valid: true,
        discountPercentage: 10,
        message: 'Cupom aplicado com sucesso!'
      })
    }

    return HttpResponse.json(
      { valid: false, message: 'Cupom inválido ou expirado.' },
      { status: 400 }
    )
  }),

  http.post('/api/orders', async ({ request }) => {
    await new Promise((r) => setTimeout(r, 1500)) // Simula tempo de processamento da rede

    const idempotencyKey = request.headers.get('Idempotency-Key')
    if (!idempotencyKey) {
      return new HttpResponse(null, { status: 400, statusText: 'Missing Idempotency Key' })
    }

    // Se o pedido já existe, retorna o mesmo (não duplica)
    if (ordersDb.has(idempotencyKey)) {
      console.log(`[MSW] Pedido recuperado via idempotência: ${idempotencyKey}`)
      return HttpResponse.json(ordersDb.get(idempotencyKey))
    }

    const body = await request.json() as any

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      status: 'pending',
      items: body.items,
      total: body.total,
      createdAt: new Date().toISOString(),
    }

    // 10% de chance de o pagamento ser recusado (para testar erro)
    if (Math.random() < 0.1) {
      newOrder.status = 'failed'
      ordersDb.set(idempotencyKey, newOrder)
      return HttpResponse.json(newOrder, { status: 402 }) // 402 Payment Required
    }

    // Salva no "banco"
    ordersDb.set(idempotencyKey, newOrder)

    // Simula confirmação via Socket.IO após 3 segundos
    setTimeout(() => {
      const order = ordersDb.get(idempotencyKey)
      if (order) {
        order.status = 'confirmed'
        // Aqui dispararíamos o evento Socket.IO.
        // Como o MSW socket binding é complexo, faremos via polling simples na UI.
      }
    }, 3000)

    return HttpResponse.json(newOrder, { status: 201 })
  }),

  http.get('/api/orders/:id', async ({ params }) => {
    const order = Array.from(ordersDb.values()).find((o) => o.id === params.id)
    if (!order) return new HttpResponse(null, { status: 404 })
    return HttpResponse.json(order)
  }),

  http.post('/api/orders', async ({ request }) => {
    // Reduzi o delay para 1s para testes mais rápidos
    await new Promise((r) => setTimeout(r, 1000))

    const idempotencyKey = request.headers.get('Idempotency-Key')
    if (!idempotencyKey) {
      return new HttpResponse(null, { status: 400 })
    }

    if (ordersDb.has(idempotencyKey)) {
      return HttpResponse.json(ordersDb.get(idempotencyKey))
    }

    const body = await request.json() as any

    // Verifica se a URL tem ?fail=true para forçar o erro nos testes
    const url = new URL(request.url)
    const forceFail = url.searchParams.get('fail') === 'true'

    const newOrder: Order = {
      id: `0x${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`, // Simula um hash de transação
      status: forceFail ? 'failed' : 'pending',
      items: body.items,
      total: body.total,
      createdAt: new Date().toISOString(),
    }

    ordersDb.set(idempotencyKey, newOrder)

    // Se não for falha forçada, confirma após 2 segundos
    if (!forceFail) {
      setTimeout(() => {
        const order = ordersDb.get(idempotencyKey)
        if (order && order.status === 'pending') {
          order.status = 'confirmed'
        }
      }, 2000)
    }

    return HttpResponse.json(newOrder, { status: forceFail ? 402 : 201 })
  }),

  http.post('/api/auth/login', async ({ request }) => {
    await new Promise((r) => setTimeout(r, 1000))
    const body = await request.json() as any

    if (body.password !== '123456') {
      return HttpResponse.json({ message: 'Senha incorreta' }, { status: 401 })
    }

    return HttpResponse.json({
      user: { id: 'u1', name: 'Colecionador Teste', email: body.email },
      token: 'fake-jwt-token'
    })
  }),

  http.post('/api/auth/register', async ({ request }) => {
    await new Promise((r) => setTimeout(r, 1000))
    const body = await request.json() as any

    return HttpResponse.json({
      user: { id: 'u2', name: body.name, email: body.email },
      token: 'fake-jwt-token'
    }, { status: 201 })
  }),

  http.patch('/api/profile', async ({ request }) => {
    await new Promise((r) => setTimeout(r, 1000))
    const body = await request.json() as any
    return HttpResponse.json({
      message: 'Perfil atualizado com sucesso',
      user: { id: 'u1', name: body.name, email: body.email }
    })
  }),

]