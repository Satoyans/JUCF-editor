# JUCF-editor

[English version](./README_english.md)

## JUCFの導入の仕方

1. ビヘイビアパックとリソースパックそれぞれの.mcpackをダウンロードする
   - [JUCF-BP](https://github.com/Satoyans/JUCF-BP/releases)
   - [JUCF-RP](https://github.com/Satoyans/JUCF-RP/releases)
2. ワールドに追加する
    - 実験トグルは全てOFFでも動きます。

## 作成したフォームの表示の仕方

1. エディターで生成されたコマンドを順番に実行します。
2. `/scriptevent cfs:フォーム名`を実行または`/scriptevent cf:list`で"表示"を選択すると表示されます。

## コマンド

- `/scriptevent cf:tag` 全てのプレイヤーのタグからフォームを追加します。
- `/scriptevent cf:list` 登録されたフォーム一覧を表示します。
- `/scriptevent cfs:<フォーム名> [変数のjson]` 呼び出したプレイヤーにフォームを送信します。メッセージ部分に変数を指定することもできます。

## サンプル

[sample.md](./sample.md)

## 細かいめも

[memo.md](./memo.md)

## 動作確認バージョン

v1.21.2

JUCFを利用したアドオン、配布ワールド、サーバー等大歓迎です。<br>
オリジナル性の変更を加えない再配布はご遠慮ください。<br>
バグ報告はこのリポジトリかDiscord@satoyan_まで!
