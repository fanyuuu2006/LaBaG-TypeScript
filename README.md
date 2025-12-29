
# LaBaG

LaBaG 是一款用 TypeScript 撰寫的高彈性拉霸機遊戲引擎，支援多種模式、事件監聽、組合得分，適合用於遊戲開發、教學或自訂玩法。

[![npm version](https://img.shields.io/npm/v/labag.svg)](https://www.npmjs.com/package/labag)

---

## 特色

- 支援多種拉霸模式（可自訂/擴充）
- 圖案與分數組合彈性設定
- 事件監聽機制，方便擴充互動
- TypeScript 強型別，易於二次開發

---

## 安裝

```bash
npm install labag
```

---

## 基本用法

```typescript
import { labag, modeList, LaBaG } from "labag";

labag.init();
while (labag.isRunning()) {
 labag.play();
 // 可在此取得 labag.patterns, labag.score 等資訊
}
console.log(labag.score);
```

### 事件監聽

```typescript
labag.addEventListener("roundEnd", (game) => {
 console.log(game.patterns, game.marginScore, game.score);
});
```

---

## API 介紹

### 主要類別

- `LaBaG`：拉霸機主體，管理分數、模式、事件等
- `Mode`：遊戲模式，決定圖案機率與特殊行為
- `Pattern`：圖案及分數設定

### 主要方法

- `labag.init()`：初始化遊戲
- `labag.play()`：執行一次拉霸
- `labag.isRunning()`：判斷是否還可繼續遊玩
- `labag.addMode(mode)`：新增模式
- `labag.addEventListener(event, fn)`：註冊事件

### 主要屬性

- `labag.score`：目前總分
- `labag.patterns`：本輪轉出的圖案陣列
- `labag.modes`：目前所有模式

---

## 內建模式

| 模式名稱   | 說明                     |
|------------|--------------------------|
| normal     | 標準機率分布             |
| greenwei   | 特殊加倍與觸發條件       |
| pikachu    | 特殊復活與替換           |
| superhhh   | 高風險高報酬             |

可自訂/擴充模式，詳見 `src/modes/` 範例。

---

## 圖案與分數

| 圖案名稱   | 三連分數 | 雙連分數 | 單出分數 |
|------------|----------|----------|----------|
| gss        | 800      | 400      | 180      |
| hhh        | 1500     | 800      | 300      |
| hentai     | 2500     | 1200     | 500      |
| handson    | 2900     | 1450     | 690      |
| kachu      | 12000    | 8000     | 1250     |
| rrr        | 20000    | 12000    | 2500     |

---

## 事件列表

| 事件名稱       | 說明             |
|----------------|------------------|
| gameStart      | 遊戲開始         |
| roundStart     | 每輪開始         |
| rollSlots      | 轉動產生圖案     |
| calculateScore | 計算分數         |
| roundEnd       | 每輪結束         |
| gameOver       | 遊戲結束         |

---

## 進階用法

- 可自訂模式（繼承 `Mode` 並設定 eventListener）
- 可自訂圖案與分數
- 可串接前端 UI 或 CLI

---

## 授權

MIT License
