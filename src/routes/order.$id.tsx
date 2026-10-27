import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { Loader2, CheckCircle2, XCircle, X } from 'lucide-react'
import type { Order } from '@/lib/api/types'

export const Route = createFileRoute('/order/$id')({
  component: OrderConfirmationPage,
})

function OrderConfirmationPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()

  // Polling: busca o pedido a cada 2 segundos se estiver pendente
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get<Order>(`/orders/${id}`)
      return data
    },
    // Só continua batendo na API se o status for 'pending'
    refetchInterval: (query) => {
      const data = query.state.data
      return data?.status === 'pending' ? 2000 : false
    },
  })

  if (isLoading) {
    return <div className="min-h-screen bg-ink flex items-center justify-center text-fg"><Loader2 className="w-8 h-8 animate-spin" /></div>
  }

  if (!order) {
    return <div className="min-h-screen bg-ink flex items-center justify-center text-fg">Pedido não encontrado</div>
  }

  // Formata a data (simulada no mock)
  const date = new Date(order.createdAt).toLocaleDateString('pt-BR', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-6">

      {/* Modal */}
      <div className="bg-surface-card border border-border w-full max-w-[600px] rounded-t-lg overflow-hidden relative">

        {/* Botão Fechar (navega para Home) */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="absolute top-4 right-4 text-fg-secondary hover:text-fg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header do Modal */}
        <div className="flex flex-col items-center pt-10 pb-6 px-6 border-b border-border">
          {/* Ícone (Muda conforme o status) */}
          <div className="mb-4 text-primary">
            {order.status === 'pending' && <Loader2 className="w-12 h-12 animate-spin" />}
            {order.status === 'confirmed' && <CheckCircle2 className="w-12 h-12" />}
            {order.status === 'failed' && <XCircle className="w-12 h-12 text-red-500" />}
          </div>

          <h1 className="text-xl font-bold text-fg-secondary">
            {order.status === 'pending' && 'Processando transação...'}
            {order.status === 'confirmed' && 'Seus NFTs agora estão na sua carteira'}
            {order.status === 'failed' && 'Transação recusada'}
          </h1>
        </div>

        {/* Dados da Transação (Só mostra se confirmado ou pending) */}
        <div className="p-6 flex flex-col gap-6">

          <div className="bg-[#241612] border-y-[0.5px] border-[#D28A4C] py-4">
            <div className="grid grid-cols-4 gap-0 text-[13px] md:text-sm text-left">
              <div className="border-r border-[#D28A4C] pr-2">
                <p className="text-fg-secondary mb-1 text-xs">ID da transação</p>
                <p className="text-[11px] text-fg-secondary font-mono">{order.id}</p>
              </div>
              <div className="border-r border-[#D28A4C] px-2">
                <p className="text-fg-secondary mb-1 text-xs">Data</p>
                <p className="text-[11px] text-fg-secondary">{date}</p>
              </div>
              <div className="border-r border-[#D28A4C] px-2">
                <p className="text-fg-secondary mb-1 text-xs">Total</p>
                <p className="text-[11px] text-fg-secondary">{order.total.toFixed(3)} ETH</p>
              </div>
              <div className="pl-2">
                <p className="text-fg-secondary mb-1 text-xs">Carteira</p>
                <p className="text-[11px] text-fg-secondary">MetaMask</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Detalhes da transação</h3>

            {/* Tabela de Itens */}
            <div className="grid grid-cols-[3fr_1fr_1fr] gap-4 text-fg-primary text-sm border-b border-border pb-2 mb-4">
              <span>NFTs</span>
              <span className="text-center">Edições</span>
              <span className="text-right">Subtotal</span>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              {order.items.map((item) => (
                <div key={item.nftId} className="grid grid-cols-[3fr_1fr_1fr] gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{item.name}</p>
                      <p className="text-xs text-fg-secondary">ID do token: #{item.nftId}</p>
                    </div>
                  </div>
                  <span className="text-center text-sm">(x {item.quantity})</span>
                  <span className="text-right text-sm font-bold text-primary-accent">
                    {(parseFloat(item.price) * item.quantity).toFixed(2)} ETH
                  </span>
                </div>
              ))}
            </div>

            {/* Totais */}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t-[0.5px] border-[#D28A4C]">

              {/* Taxa de rede - Alinhado à direita com espaço */}
              <div className="flex justify-end gap-4 text-[15px] text-fg-primary">
                <span>Taxa de rede</span>
                <span>0.016 ETH</span>
              </div>

              {/* Total - Alinhado à direita com espaço */}
              <div className="flex justify-end gap-6 mt-1 text-[18px] font-bold">
                <span className="text-fg-primary">Total</span>
                <span className="text-[#D28A4C]">{order.total.toFixed(3)} ETH</span>
              </div>

            </div>

          </div>

          {/* Mensagem de status */}
          <div className="text-center text-sm text-fg-secondary mt-4 border-border border-t pt-4">
            {order.status === 'pending' && 'Aguardando confirmação da rede...'}
            {order.status === 'confirmed' && 'Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na rede.'}
            {order.status === 'failed' && 'O pagamento foi recusado pela sua carteira. Nenhum valor foi cobrado.'}
          </div>

          {/* Botões de Ação */}
          {order.status === 'confirmed' && (
            <a
              href="#"
              className="mt-2 block w-full text-center bg-primary text-ink font-bold py-3 rounded-lg hover:bg-primary-accent transition"
            >
              Ver no Etherscan
            </a>
          )}

          {order.status === 'failed' && (
            <button
              onClick={() => navigate({ to: '/checkout' })}
              className="mt-2 block w-full text-center bg-primary text-ink font-bold py-3 rounded-lg hover:bg-primary-accent transition"
            >
              Tentar novamente
            </button>
          )}

        </div>
      </div>
    </div>
  )
}