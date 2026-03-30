# Notion Today's Tasks

今日のNotionタスクを表示・チェック・追加できるChrome拡張機能

## 機能

- ✅ **今日のタスク表示**: 「実行日」プロパティが今日のタスクのみ表示
- ➕ **タスク追加**: 入力欄から新規タスクを追加（今日の日付を自動設定）
- ☑️ **完了切り替え**: チェックボックスをクリックして即座にNotionに反映
- 🔄 **リフレッシュ**: 最新のタスク状態を取得

## セットアップ手順

### 1. Notion Integration作成

1. [Notion Integrations](https://www.notion.so/my-integrations)にアクセス
2. 「新しいインテグレーション」を作成
3. Internal Integration Token（`ntn_XXX` または `secret_XXX`）をコピー

### 2. Database設定

1. タスク管理用Notionデータベースを開く
2. 以下のプロパティを作成:
   - **Name**（タイトル）
   - **実行日**（日付）
   - **完了**（チェックボックス）
3. データベースの「…」メニュー → 「接続を追加」→ 作成したIntegrationを選択
4. Database IDを取得:
   - データベースのURL: `https://notion.so/xxxxx?v=yyyyy`
   - Database ID: `xxxxx` の部分（32文字の英数字）

### 3. Chrome拡張機能の読み込み

1. Chromeで `chrome://extensions/` を開く
2. 右上の「デベロッパーモード」をON
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. このフォルダを選択
5. ツールバーに拡張機能アイコンが表示される

### 4. 初期設定

1. 拡張機能アイコンをクリック → 「⚙️ 設定」
2. API Token（`ntn_XXX` または `secret_XXX`）を入力
3. Database ID（32文字の英数字）を入力
4. 「保存」をクリック

## 使い方

### タスクを追加する

1. 拡張機能アイコンをクリック
2. 上部の入力欄にタスク名を入力
3. 「+ 追加」ボタンをクリック（またはEnterキー）
4. 自動で「実行日」が今日に設定され、Notionに追加される

### タスクを完了する

1. タスクのチェックボックスをクリック
2. 即座にNotionに反映される
3. 完了したタスクは取り消し線で表示

### タスクリストを更新する

1. 「🔄 更新」ボタンをクリック
2. Notionから最新のタスク状態を取得

## トラブルシューティング

### タスクが表示されない

- 設定画面でAPI TokenとDatabase IDが正しく入力されているか確認
- Notionデータベースに「実行日」が今日のタスクが存在するか確認
- NotionデータベースにIntegrationの接続が追加されているか確認

### タスクの追加・更新ができない

- F12で開発者ツールを開き、Consoleタブでエラーを確認
- API Tokenが有効か確認（期限切れの可能性）
- Notionデータベースに必要なプロパティ（Name, 実行日, 完了）が存在するか確認

### エラーメッセージ: "object_not_found"

- Database IDが正しいか確認
- NotionデータベースにIntegrationの接続が追加されているか確認

## 技術仕様

- **Manifest Version**: 3
- **Notion API Version**: 2022-06-28
- **必要な権限**: storage, https://api.notion.com/*
- **外部ライブラリ**: なし（Pure JavaScript）

## セキュリティ

- API TokenはChrome Storage（暗号化）に安全に保存
- コードに機密情報は含まれない
- Notion公式APIのみを使用（HTTPS通信）

## ライセンス

MIT License

## 作成者

個人利用プロジェクト

## バージョン履歴

### 1.0.0 (2026-03-30)
- 初版リリース
- 今日のタスク表示機能
- タスク追加機能
- チェックボックスで完了/未完了切り替え
- リフレッシュ機能
- 設定画面
