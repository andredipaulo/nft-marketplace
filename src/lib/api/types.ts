export interface NFT {
  id: string;
  name: string;
  price: string;
  compareAtPrice?: string;
  image: string;
  collection: string;
  network: string;
}

export interface NftsResponse {
  items: NFT[];
  total: number;
  page: number;
  limit: number;
}

export interface OrderItem {
  nftId: string;
  name: string;
  quantity: number;
  price: string;
  image: string;
}

export interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'failed';
  items: OrderItem[];
  total: number;
  createdAt: string;
}
