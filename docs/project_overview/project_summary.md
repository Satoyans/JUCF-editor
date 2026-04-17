# JUCF (Json Ui Custom Form) Editor プロジェクト概要

## 1. プロジェクトの機能
JUCFは、Minecraft統合版（Bedrock Edition）において、json-uiやscriptAPIの知識を直接必要とせずに、グラフィカルにフォーム（UI）をカスタマイズ・作成するためのアドオン及びそのエディターツールです。

本プロジェクト（JUCF_editor）は、そのWebベースの開発用エディター部分を担っており、以下の主な機能を提供します。

* **直感的なフォーム編集 (`Screen Tab`)**
  * マウス操作（ドラッグ＆ドロップ、リサイズ）でのUI要素の配置。
  * プレビュー画面でのリアルタイムな確認（Minecraftのゲームスクリーンやフォームサイズをシミュレーション）。
  * テキスト、ボタン、画像などの要素の追加と詳細なプロパティ管理。
* **画像管理 (`Image Tab`)**
  * 画像をアップロードし、Base64形式にエンコードして管理する機能。これにより、別ファイルとしての画像管理の手間を軽減します。
* **変数管理 (`Variable Tab`)**
  * 画面サイズや要素のプロパティに変数（例：`%xxx%`）を組み込む機能。実行時にコマンド等から動的に値を注入することが可能です。
* **出力機能 (`Output`)**
  * 作成したフォームデザインを、Minecraft内で使用できるコマンドやJSONデータ等（`/scriptevent cfs:フォーム名` 等）としてエクスポートします。

## 2. 実装技術とアーキテクチャ
本エディターは **React + TypeScript** を用いてシングルページアプリケーション (SPA) として構築されています。

* **主要ライブラリ:**
  * `@mui/material`, `@emotion/react`: UIコンポーネントライブラリとして採用（モダンなデザインを提供）。
  * `react-moveable`: プレビュー画面上の要素のドラッグ＆リサイズを実現。
* **状態管理:**
  * 主に `App.tsx` にて `useState` を用いて、フォームの構成要素（`formElements`）、ターゲット要素、画面サイズ、各種タブの状態、Undo/Redo用の履歴管理などを集中的に行い、各子コンポーネントに `props` として伝播させています。

## 3. フォルダ構造
```text
JUCF_editor/
├── README.md                 - プロジェクトの説明（日本語）
├── README_english.md         - プロジェクトの説明（英語）
├── 概要.txt                  - エディターに関する初期の要件やメモ
├── memo.md, sample.md        - 開発メモ、使用サンプル
├── docs/                     - 本ファイルなどのドキュメント生成ディレクトリ
└── react-jucf-editor/        - Webエディターの本体のソースコードディレクトリ
    ├── package.json          - npmパッケージと依存関係の設定
    ├── public/               - 静的ファイル
    └── src/
        ├── App.tsx           - アプリケーションのエントリーポイントであり状態管理の要
        ├── index.tsx         - Reactレンダリング開始地点
        ├── formElementTypes.ts - フォーム要素の型定義群
        ├── typeIds.ts        - Minecraft内のアイテムID等の定義リスト
        ├── variableReplacer.ts - 変数の展開ロジック
        └── components/       - UIコンポーネント格納ディレクトリ
            ├── Header.tsx    - アプリのヘッダー
            ├── ToolBar.tsx   - 各種タブ切替やモード変更のためのツールバー
            ├── screen_tab/   - UIデザイン・作成ツール（ScreenTab.tsx, MoveableElement.tsx, ElementsGenerator.tsx, ControlPanel.tsx, ElementPanel.tsx, Output.tsx等）
            ├── image_tab/    - 画像のアップロードや管理を行う（ImageTab.tsx 等）
            └── variable_tab/ - 変数の設定・管理を行う（VariableTab.tsx 等）
```
