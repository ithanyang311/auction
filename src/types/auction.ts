export interface Auction {
  id: string;
  seller_id: string;
  seller_name?: string;
  seller_rating?: number;
  title: string;
  description: string;
  images: string[];
  category: string;
  starting_price: number;
  reserve_price: number;
  min_increment: number;
  current_price: number;
  current_winner_id: string | null;
  current_winner_name?: string | null;
  deposit_required: number;
  status: 'draft' | 'active' | 'ended' | 'settled' | 'canceled';
  anti_snipe_trigger_sec: number;
  anti_snipe_extend_sec: number;
  start_at: string;
  end_at: string;
  created_at: string;
}

export interface BidRecord {
  id: string;
  auction_id: string;
  bidder_id: string;
  bidder_name: string;
  bidder_avatar?: string;
  amount: number;
  created_at: string;
}

export interface DepositRecord {
  id: string;
  user_id: string;
  auction_id: string;
  auth_code: string;
  amount: number;
  status: 'authorized' | 'released' | 'captured' | 'forfeited';
  created_at: string;
}
