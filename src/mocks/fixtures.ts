export const collections = ['Arte Digital', 'Fotografia', 'Música', 'Arte 3D', 'Colecionáveis', 'Generative', 'Jogos', 'Assinaturas', 'Utilidades'];
export const networks = ['Ethereum', 'Polygon', 'Solana'];
export const names = ['Emerald Ape', 'Sage Nomad', 'Neon Vessel', 'Cosmic Bloom', 'Violet Nomad', 'Ivory Baron', 'Golden Beat', 'Golden Signal'];

const IMAGES_COUNT = 4;

export const mockNFTs = Array.from({ length: 24 }).map((_, i) => {
  // Pega um nome aleatório do array
  const randomName = names[Math.floor(Math.random() * names.length)];

  return {
    id: `nft-${i + 1}`,
    // Junta o nome aleatório com o número (ex: "Emerald Ape #104")
    name: `${randomName} #${100 + i}`,
    price: (0.5 + Math.random() * 3).toFixed(2),
    image: `/nft-${(i % IMAGES_COUNT) + 1}.png`,
    collection: collections[i % collections.length],
    network: networks[i % networks.length],
  }
});