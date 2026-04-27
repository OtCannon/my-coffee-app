☕ Coffee Sensory Lexicon Note (咖啡感官紀錄計畫)

這是一個結合 WCR (World Coffee Research) Sensory Lexicon 科學標準與 Notbadcoffee 風味輪直覺操作的個人記帳 App。本專案採用 Vite 5 + Vue 3 架構，旨在提供專業且私密的咖啡風味紀錄體驗。

🚀 開發階段規劃 (Development Roadmap)

第一階段：前端與 Drill-down 選單實作 (UI/UX Focus)

[x] 風味層級資料庫：根據 Wiley 2016 論文建立嵌套式 JSON 資料（110 種屬性）。

[x] Drill-down 互動介面：實作「大分類 -> 子分類 -> 具體風味」的逐層鑽取選單。

[x] 強度評分系統：實作符合論文標準的 1-15 分量化滑桿。

[x] 響應式佈局：使用 Tailwind CSS 確保在手機與電腦上都有良好的操作感。

第二階段：JSON 資料管理與本地儲存 (Persistence)

[x] 資料結構定義：設計包含時間、地點、風味標籤、強度評分與筆記的 JSON Schema。

[x] Local Persistence：使用瀏覽器的 localStorage 實現自動儲存與草稿保護，確保關閉瀏覽器資料不丟失。

[x] 匯出功能：實作一鍵下載 coffee_logs.json 的功能。

第三階段：PWA 獨立執行 (Standalone App)

[x] Vite PWA 整合：設定 vite-plugin-pwa 與 manifest.json。

[x] Service Worker 離線支援：實現無網路狀態下仍可開啟 App 並記錄。

[x] 手機安裝化：優化圖示與啟動畫面，使其能「加入主畫面」像原生 App 一樣執行（隱藏 Chrome 網址列）。

第四階段：Google Drive API 雲端同步 (Cloud Sync)

[ ] OAuth2 授權：串接 Google Identity Services 進行身分驗證。

[ ] 雲端同步邏輯：實現啟動時從 Google Drive 讀取、儲存時自動更新雲端 JSON 檔案。

[ ] 多裝置對帳：確保手機記錄後，電腦端開啟也能同步看到。

🛠️ 技術棧 (Tech Stack)

Framework: Vue 3 (Composition API)

Bundler: Vite 5.4.11 (穩定版)

Style: Tailwind CSS (建議加入，用於快速設計 UI)

Package Manager: pnpm

Storage: LocalStorage & Google Drive API

📖 參考文獻與資源

Flavor Lexicon: Wiley (2016) - The World Coffee Research Sensory Lexicon

UI Inspiration: Notbadcoffee Flavor Wheel

Architecture Reference: The Walking Fish - Web Accounting

🏃 如何啟動開發環境

pnpm install

pnpm dev

打開瀏覽器至 http://localhost:5173