import { Auction, BidRecord } from '@/types/auction';

// 固定的基準時間，避免 SSR 與 Client 產生 Hydration Mismatch
const NOW = 1792500000000; // 穩定時間戳記

export const INITIAL_AUCTIONS: Auction[] = [
  {
    id: 'auc-001',
    seller_id: 'user-seller-1',
    seller_name: '極客精品殿堂',
    seller_rating: 4.9,
    title: 'Sony PlayStation 5 Pro 限量 30 週年紀念典藏版 (全新未拆封)',
    description: '官方正品台灣公司貨，含專屬復古配色 DualSense Edge 控制器與紀念立牌，附發票與完整保固。',
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80'
    ],
    category: '電玩電競',
    starting_price: 24800,
    reserve_price: 32000,
    min_increment: 500,
    current_price: 33500,
    current_winner_id: 'user-02',
    current_winner_name: '台北林先生',
    deposit_required: 1000,
    status: 'active',
    anti_snipe_trigger_sec: 120,
    anti_snipe_extend_sec: 120,
    start_at: new Date(NOW - 3600000 * 5).toISOString(),
    end_at: new Date(NOW + 1000 * 60 * 18).toISOString(), // 18 分鐘後
    created_at: new Date(NOW - 3600000 * 5).toISOString()
  },
  {
    id: 'auc-002',
    seller_id: 'user-seller-2',
    seller_name: '潮流時光選物',
    seller_rating: 5.0,
    title: 'Rolex Submariner 勞力士黑水鬼 126610LN (2024 年全新保卡全套)',
    description: '台灣正規經銷專櫃盒單齊全，全新品膠膜未撕，附原廠保卡、天文台吊牌與五年國際保固。',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1547996160-71dfabb14c1b?auto=format&fit=crop&w=1200&q=80'
    ],
    category: '名錶珠寶',
    starting_price: 350000,
    reserve_price: 410000,
    min_increment: 2000,
    current_price: 428000,
    current_winner_id: 'user-03',
    current_winner_name: '台中陳總',
    deposit_required: 15000,
    status: 'active',
    anti_snipe_trigger_sec: 120,
    anti_snipe_extend_sec: 180,
    start_at: new Date(NOW - 3600000 * 24).toISOString(),
    end_at: new Date(NOW + 1000 * 60 * 85).toISOString(),
    created_at: new Date(NOW - 3600000 * 24).toISOString()
  },
  {
    id: 'auc-003',
    seller_id: 'user-seller-3',
    seller_name: 'Apple 認證福利社',
    seller_rating: 4.8,
    title: 'Apple MacBook Pro 16吋 M3 Max / 64GB / 2TB 太空黑',
    description: '原廠盒裝完整，電池循環次數 12 次，外觀近全新無傷，支援 LINE Pay 與超商取貨或面交驗機。',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80'
    ],
    category: '3C 數位',
    starting_price: 65000,
    reserve_price: 85000,
    min_increment: 1000,
    current_price: 88000,
    current_winner_id: 'user-04',
    current_winner_name: '高雄小柯',
    deposit_required: 2000,
    status: 'active',
    anti_snipe_trigger_sec: 120,
    anti_snipe_extend_sec: 120,
    start_at: new Date(NOW - 3600000 * 8).toISOString(),
    end_at: new Date(NOW + 1000 * 150).toISOString(),
    created_at: new Date(NOW - 3600000 * 8).toISOString()
  }
];

export const INITIAL_BIDS: Record<string, BidRecord[]> = {
  'auc-001': [
    {
      id: 'bid-1',
      auction_id: 'auc-001',
      bidder_id: 'user-01',
      bidder_name: '新竹工程師 Ken',
      bidder_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      amount: 32500,
      created_at: new Date(NOW - 1000 * 60 * 12).toISOString()
    },
    {
      id: 'bid-2',
      auction_id: 'auc-001',
      bidder_id: 'user-05',
      bidder_name: '板橋張教練',
      bidder_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
      amount: 33000,
      created_at: new Date(NOW - 1000 * 60 * 6).toISOString()
    },
    {
      id: 'bid-3',
      auction_id: 'auc-001',
      bidder_id: 'user-02',
      bidder_name: '台北林先生',
      bidder_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      amount: 33500,
      created_at: new Date(NOW - 1000 * 60 * 2).toISOString()
    }
  ]
};
