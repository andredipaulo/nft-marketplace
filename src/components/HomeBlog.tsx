export function HomeBlog() {
  return (
    <div className="hidden lg:flex flex-col items-center gap-10 w-full mt-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="font-mono text-[28px] font-bold text-fg leading-tight">
          Diário da Cunhagem
        </h2>
        <p className="font-mono text-sm text-fg-secondary">
          Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 w-full">
        {/* Card 1 */}
        <div className="bg-[#241612] rounded-lg overflow-hidden flex flex-col">
          <img src="/nfts/nft-3.png" alt="Blog 1" className="w-full h-[195px] object-cover" />
          <div className="p-4 flex flex-col gap-3 flex-1">
            <p className="font-mono text-xs text-fg-secondary font-medium">12 de setembro | Leitura de 6 min</p>
            <h3 className="font-mono text-base font-bold text-fg leading-snug">Como funciona a propriedade de NFTs</h3>
            <p className="font-mono text-xs text-fg-secondary leading-relaxed flex-1">Aprenda a colecionar, negociar e verificar ativos digitais.</p>
            <a href="#" className="text-primary-accent font-mono text-xs font-bold flex items-center gap-1 hover:underline mt-2">
              Ler mais <span>→</span>
            </a>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#241612] rounded-lg overflow-hidden flex flex-col">
          <img src="/nfts/nft-1.png" alt="Blog 2" className="w-full h-[195px] object-cover" />
          <div className="p-4 flex flex-col gap-3 flex-1">
            <p className="font-mono text-xs text-fg-secondary font-medium">13 de setembro | Leitura de 2 min</p>
            <h3 className="font-mono text-base font-bold text-fg leading-snug">10 artistas digitais para acompanhar</h3>
            <p className="font-mono text-xs text-fg-secondary leading-relaxed flex-1">Conheça criadores que moldam a cultura digital.</p>
            <a href="#" className="text-primary-accent font-mono text-xs font-bold flex items-center gap-1 hover:underline mt-2">
              Ler mais <span>→</span>
            </a>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#241612] rounded-lg overflow-hidden flex flex-col">
          <img src="/nfts/nft-2.png" alt="Blog 3" className="w-full h-[195px] object-cover" />
          <div className="p-4 flex flex-col gap-3 flex-1">
            <p className="font-mono text-xs text-fg-secondary font-medium">15 de setembro | Leitura de 3 min</p>
            <h3 className="font-mono text-base font-bold text-fg leading-snug">Raridade, atributos e procedência</h3>
            <p className="font-mono text-xs text-fg-secondary leading-relaxed flex-1">Entenda raridade, procedência, direitos autorais e utilidade.</p>
            <a href="#" className="text-primary-accent font-mono text-xs font-bold flex items-center gap-1 hover:underline mt-2">
              Ler mais <span>→</span>
            </a>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#241612] rounded-lg overflow-hidden flex flex-col">
          <img src="/nfts/nft-4.png" alt="Blog 4" className="w-full h-[195px] object-cover" />
          <div className="p-4 flex flex-col gap-3 flex-1">
            <p className="font-mono text-xs text-fg-secondary font-medium">15 de setembro | Leitura de 2 min</p>
            <h3 className="font-mono text-base font-bold text-fg leading-snug">Como proteger sua carteira</h3>
            <p className="font-mono text-xs text-fg-secondary leading-relaxed flex-1">Proteja sua carteira, seus ativos e sua identidade.</p>
            <a href="#" className="text-primary-accent font-mono text-xs font-bold flex items-center gap-1 hover:underline mt-2">
              Ler mais <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}