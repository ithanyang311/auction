# BidPulse - 次世代即時競價拍賣平台

專為解決台灣傳統拍賣網站 **「UI/UX 介面過時」** 與 **「得標者惡意棄標、不付錢」** 兩大痛點而打造的現代化拍賣系統。

---

## 🌟 核心特色

1. **毫秒級即時跳價 (Supabase Realtime)**
   - 告別傳統網站頻繁手動重新整理網頁（F5）的落後體驗。
   - 出價即時廣播、數字動態翻牌，所有線上觀戰者零延遲同步。

2. **三重防棄標履約保證閉環 (Zero-Default Architecture)**
   - **出價預授權圈存**：出價前必須綁定信用卡預先圈存保證金（如 NT$ 500 或出價 10%）。未得標全額解圈。
   - **違約沒收補償賣家**：得標者享有 24 小時結帳緩衝期；若逾期未付款，系統自動扣除保證金，**80% 直接補償給受害賣家**，20% 充作平台審理手續費。
   - **次高標無縫遞補**：得標者棄標時，自動推播詢問第二高標者是否願意接單，賣家無需重開賣場。

3. **防壓秒延長機制 (Anti-Sniping / Soft Close)**
   - 結標前 120 秒內有人出價，結標倒數**自動延長 120 秒**，避免腳本機器人最後 1 秒偷標，打造公平刺激的競價氛圍。

---

## 🛠 技術堆疊

- **前端**：Next.js 16 (App Router, React 19) + Tailwind CSS + Lucide Icons + Canvas Confetti
- **後端與 BaaS**：Supabase (PostgreSQL, Supabase Auth, Supabase Realtime, Storage)
- **資料庫原子邏輯**：PL/pgSQL `place_bid()` 預存函數（含 `FOR UPDATE` 行級排他鎖，徹底杜絕撞標併發衝突）
- **部署平台**：Vercel

---

## 🚀 快速啟動

### 1. 安裝與執行本地開發環境
```bash
npm install
npm run dev
```
開啟瀏覽器進入 `http://localhost:3000` 即可體驗完整的即時競標與防棄標流程！

### 2. 資料庫初始化 (Supabase)
1. 前往 [Supabase 官網](https://supabase.com) 建立專案。
2. 進入專案的 **SQL Editor**。
3. 打開專案中的 `supabase/schema.sql`，將全部內容複製貼上並執行（Run）。
4. 至 **Settings -> API** 複製 URL 與 Anon Key，建立 `.env.local`：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. 一鍵部署至 Vercel
1. 將專案推送到您的 GitHub (`https://github.com/ithanyang311/auction.git`)。
2. 登入 [Vercel](https://vercel.com)，點擊 **Add New Project** 並匯入該 Repository。
3. 在 Environment Variables 中填入 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
4. 點擊 **Deploy** 即可完成上線！
