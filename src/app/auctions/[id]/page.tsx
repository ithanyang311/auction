import { Suspense } from 'react';
import AuctionRoom from '@/components/AuctionRoom';
import { INITIAL_AUCTIONS } from '@/lib/mockData';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return INITIAL_AUCTIONS.map((auction) => ({
    id: auction.id,
  }));
}

export default async function AuctionDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const auctionId = resolvedParams.id;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span>載入即時競價大廳中...</span>
          </div>
        </div>
      }
    >
      <AuctionRoom auctionId={auctionId} />
    </Suspense>
  );
}
