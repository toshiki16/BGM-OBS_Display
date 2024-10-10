const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const mm = require('music-metadata');
const NodeID3 = require('node-id3');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('bgm-kanri.html');
});

// フォルダ選択のイベントハンドリング
ipcMain.handle('select-folder', async (event) => {
  const { filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
  });

  if (filePaths && filePaths.length > 0) {
      const folderPath = filePaths[0];
      const files = fs.readdirSync(folderPath);
      return { folderPath, files };
  } else {
      return { folderPath: null, files: [] };
  }
});

// メタデータを取得してCSVに書き込む処理
ipcMain.handle('write-metadata', async (event, filePath) => {
    try {
        // ファイルが存在するか確認
        if (!fs.existsSync(filePath)) {
            throw new Error('ファイルが見つかりません: ' + filePath);
        }

        // MP3ファイルのメタデータを取得
        const tags = NodeID3.read(filePath);
        let title = tags.title || '';
        let artist = tags.artist || '';

        if(artist != '') {
          artist = "音楽: " + artist + "様, ";
        }
        if(title != '') {
          title = "BGM: " + title;
        }
        

        // CSVデータを作成
        const csvData = `${artist}${title}\n`;

        // bgm.csvにデータを書き込む。既存のデータは削除。
        const outputPath = path.join(__dirname, 'bgm.csv'); // __dirnameはこのファイルまでの絶対パス．bgm.csvを保存
        fs.writeFileSync(outputPath, csvData, { flag: 'w' });

        // 成功した場合の返却データ
        return { success: true, title, artist };
    } catch (error) {
        console.error('Error writing metadata:', error);
        return { success: false, error: error.message };
    }
});
