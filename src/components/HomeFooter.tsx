import { Link } from '@tanstack/react-router'

export function HomeFooter() {
  return (
    <footer className="hidden lg:flex flex-col w-full bg-[#241612] rounded-lg overflow-hidden">
      {/* Faixa Superior */}
      <div className="flex p-8 gap-8 border-b border-[#3F2319]">
        <div className="flex-1 flex flex-col gap-3">
          <div className="w-[74px] h-[74px] rounded-full bg-primary flex items-center justify-center text-ink font-bold text-2xl">W</div>
          <h4 className="font-mono text-base font-bold text-fg mt-2">Segurança da carteira</h4>
          <p className="font-mono text-sm text-fg-secondary leading-relaxed">Proteja sua carteira e colecione arte digital verificada com confiança.</p>
        </div>
        <div className="w-px bg-primary/30"></div>

        <div className="flex-1 flex flex-col gap-3">
          <div className="w-[74px] h-[74px] rounded-full bg-primary flex items-center justify-center text-ink font-bold text-2xl">C</div>
          <h4 className="font-mono text-base font-bold text-fg mt-2">Criadores em destaque</h4>
          <p className="font-mono text-sm text-fg-secondary leading-relaxed">Conheça artistas, estúdios e comunidades que moldam a cultura digital.</p>
        </div>
        <div className="w-px bg-primary/30"></div>

        <div className="flex-1 flex flex-col gap-3">
          <div className="w-[74px] h-[74px] rounded-full bg-primary flex items-center justify-center text-ink font-bold text-2xl">D</div>
          <h4 className="font-mono text-base font-bold text-fg mt-2">Alertas de lançamentos</h4>
          <p className="font-mono text-sm text-fg-secondary leading-relaxed">Receba calendários de cunhagem, novidades de listas de acesso e análises.</p>
        </div>

        <div className="flex-[1.2] flex flex-col gap-4 pl-4">
          <h4 className="font-mono text-lg font-bold text-fg leading-tight">Antecipe-se ao próximo lançamento</h4>
          <div className="flex bg-[#38220F] rounded-md overflow-hidden">
            <input
              type="email"
              placeholder="digite seu e-mail..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-fg outline-none placeholder-fg-secondary"
            />
            <button className="bg-primary text-ink font-bold px-6 py-3 text-sm hover:bg-primary-accent transition">
              Enviar
            </button>
          </div>
          <p className="font-mono text-xs text-fg-secondary leading-relaxed">
            Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
          </p>
        </div>
      </div>

      {/* Faixa de Contato */}
      <div className="flex items-center justify-between p-6 bg-[#38220F] px-8">
        <span className="font-mono font-bold text-lg text-fg tracking-widest">KURIO</span>
        <span className="font-mono text-sm text-fg-secondary">Feito para colecionadores, criadores e cultura</span>
        <span className="font-mono text-sm text-fg-secondary">contato@email.com</span>
        <span className="font-mono text-sm text-fg-secondary">+55 11 4002 8922</span>
      </div>

      {/* Links do Footer */}
      <div className="grid grid-cols-4 gap-8 p-8">
        <div className="flex flex-col gap-3">
          <h5 className="font-mono text-lg font-bold text-fg mb-2">Meu perfil</h5>
          <Link to="/profile" className="font-mono text-sm text-fg-secondary hover:text-fg">Meu perfil</Link>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Minha coleção</a>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Atividade</a>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Estúdio do criador</a>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Lista de interesse</a>
        </div>

        <div className="flex flex-col gap-3">
          <h5 className="font-mono text-lg font-bold text-fg mb-2">Central de ajuda</h5>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Central de ajuda</a>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Como comprar NFTs</a>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Carteira e segurança</a>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Política do mercado</a>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Denunciar item</a>
        </div>

        <div className="flex flex-col gap-3">
          <h5 className="font-mono text-lg font-bold text-fg mb-2">Coleções</h5>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Arte digital</a>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Fotografia</a>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Música</a>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Arte 3D</a>
          <a href="#" className="font-mono text-sm text-fg-secondary hover:text-fg">Utilidade</a>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h5 className="font-mono text-lg font-bold text-fg mb-3">Redes sociais</h5>
            <div className="flex gap-2">
              {['f', 'ig', 'tw', 'in', 'yt'].map((social) => (
                <a key={social} href="#" className="w-8 h-8 rounded border border-primary flex items-center justify-center text-primary hover:bg-primary hover:text-ink transition text-xs font-bold uppercase">
                  {social}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-mono text-lg font-bold text-fg mb-2">Carteiras compatíveis</h5>
            <div className="border border-[#55321F] bg-[#38220F] rounded px-3 py-1 text-[9px] font-bold text-primary-accent tracking-widest inline-block">
              METAMASK • WALLETCONNECT • COINBASE
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-4 border-t border-[#3F2319]">
        <p className="font-mono text-sm text-fg-secondary">© 2026 Kurio. Propriedade digital para todos.</p>
      </div>
    </footer>
  )
}