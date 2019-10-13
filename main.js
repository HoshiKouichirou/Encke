const fs = require("fs");
const path = require("path");
const { app, ipcMain, BrowserWindow, ipcRenderer } = require("electron");
// メインウィンドウはGCされないようにグローバル宣言
let mainWindow = null;
// 全てのウィンドウが閉じたら終了
app.on("window-all-closed", () => {
  if (process.platform != "darwin") {
    app.quit();
  }
});
// Electronの初期化完了後に実行
app.on("ready", () => {
  //ウィンドウサイズを1280*720（フレームサイズを含まない）に設定する
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  ipcMain.on("asynchronous-message", (event, arg) => {
    // "ping"が出力される
    console.log(arg);
    // event.senderに送信元のプロセスが設定されているので、asynchronous-replyチャンネルで文字列"pong"を非同期通信で送信元に送信
    event.sender.send("asynchronous-reply", "pong");
    // ※event.senderはwebContentsオブジェクトな
  });
  //使用するhtmlファイルを指定する
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});
