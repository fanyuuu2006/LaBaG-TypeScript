# LaBaG (Slot Machine Engine)

LaBaG 是一款用 TypeScript 撰寫的高彈性拉霸機 (Slot Machine) 遊戲引擎，支援多種模式、自訂圖案權重與中獎組合，適合用於遊戲開發、教學或自訂玩法。

[![npm version](https://img.shields.io/npm/v/labag.svg)](https://www.npmjs.com/package/labag)

---

## 特色

- 🎰 **高度客製化**：支援自訂圖案 (Pattern) 與中獎規則 (Payout)。
- ⚖️ **權重控制**：可設定每個圖案出現的權重 (Weight)，控制機率。
- 💰 **彈性獎勵計算**：自動計算中獎組合與獎勵金額。
- 🔧 **TypeScript 強型別**：提供完整的型別定義，開發更安心。

---

## 安裝

使用 npm 安裝：

```bash
npm install labag
```

---

## 快速開始

### 1. 引入模組

```typescript
import { LaBaG, Pattern, Payout } from "labag";
```

### 2. 定義圖案 (Patterns)

設定每個圖案的 ID、權重 (出現機率) 與圖片路徑。

```typescript
const patterns: Pattern[] = [
  { id: 1, weight: 10, image: "cherry.png" }, // 稀有
  { id: 2, weight: 20, image: "bell.png" },
  { id: 3, weight: 50, image: "bar.png" },    // 常見
];
```

### 3. 定義中獎規則 (Payouts)

設定當特定圖案出現特定次數時的獎勵。

```typescript
const payouts: Payout[] = [
  { id: 1, pattern_id: 1, match_count: 3, reward: 1000 }, // 3個櫻桃 -> 1000分
  { id: 2, pattern_id: 1, match_count: 2, reward: 50 },   // 2個櫻桃 -> 50分
  { id: 3, pattern_id: 2, match_count: 3, reward: 500 },  // 3個鈴鐺 -> 500分
];
```

### 4. 建立實例並開始遊玩

```typescript
const game = new LaBaG(patterns, payouts);

// 進行一次拉霸
const result = game.spin();

console.log("轉出圖案:", result.reels);
console.log("獲得獎勵:", result.reward);
```

---

## API 參考

### `LaBaG` 類別

#### `constructor(patterns: Pattern[], payouts: Payout[])`

初始化拉霸機引擎。

- `patterns`: 圖案列表，包含權重設定。
- `payouts`: 中獎規則列表。

#### `spin()`

進行一次拉霸，隨機產生結果並計算獎勵。

- **回傳值**: `{ reels: Pattern[], reward: number }`
  - `reels`: 轉出的圖案陣列 (預設為 3 個)。
  - `reward`: 計算出的總獎勵金額。

#### `randomPattern(): Pattern`

根據權重隨機抽取一個圖案。

#### `caculateReward(reels: Pattern[]): number`

計算給定圖案組合的總獎勵。

---

## 型別定義

### `Pattern`

```typescript
type Pattern = {
  id: string | number;
  weight: number; // 出現權重，數字越大機率越高
  image: string;  // 圖片路徑或代碼
};
```

### `Payout`

```typescript
type Payout = {
  id: string | number;
  pattern_id: Pattern["id"]; // 對應的圖案 ID
  match_count: number;       // 需要出現的次數 (例如 3 代表出現 3 次)
  reward: number;            // 獎勵金額
};
```

---

## 授權

MIT License
