export function HomePromos() {
  return (
    <div className="hidden lg:flex flex-row gap-6 w-full mt-12 mb-10">
      {/* Promo 1 */}
      <div className="flex-1 bg-[#241612] rounded-lg overflow-hidden flex h-[250px] relative">
        <div className="w-1/2 relative">
          <img
            src="/nfts/nft-1.png"
            alt="Lançamentos gênesis"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="w-1/2 p-6 flex flex-col justify-center items-end text-right">
          <h3 className="font-mono text-lg font-bold text-fg mb-2 leading-tight">
            Lançamentos gênesis<br />de edição limitada
          </h3>
          <p className="font-mono text-sm text-fg-secondary mb-4 leading-relaxed">
            Colecione edições escassas diretamente dos criadores antes da revelação pública.
          </p>
          <button className="bg-primary text-ink text-sm font-bold px-4 py-2 rounded-md hover:bg-primary-accent transition flex items-center gap-2">
            Explorar <span>→</span>
          </button>
        </div>
      </div>

      {/* Promo 2 */}
      <div className="flex-1 bg-[#241612] rounded-lg overflow-hidden flex h-[250px] relative">
        <div className="w-1/2 relative">
          <img
            src="/nfts/nft-2.png"
            alt="Arte digital selecionada"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="w-1/2 p-6 flex flex-col justify-center items-end text-right">
          <h3 className="font-mono text-lg font-bold text-fg mb-2 leading-tight">
            Arte digital selecionada<br />e muito mais
          </h3>
          <p className="font-mono text-sm text-fg-secondary mb-4 leading-relaxed">
            Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.
          </p>
          <button className="bg-primary text-ink text-sm font-bold px-4 py-2 rounded-md hover:bg-primary-accent transition flex items-center gap-2">
            Explorar <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}