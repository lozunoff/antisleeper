const {
  app, BrowserWindow, Menu,
} = require('electron');

const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Создаем главное окно приложения
  const mainWindow = new BrowserWindow({
    width: 300,
    height: 250,
    minWidth: 300,
    minHeight: 250,
    maxWidth: 300,
    maxHeight: 250,
    resizable: false,
    maximizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: false,
    },
    frame: false,
  });

  // Загружаем в главное окно app.html
  mainWindow.loadFile(path.join(__dirname, 'html', 'app.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// Скрываем стандартное меню окна
Menu.setApplicationMenu(null);

// Приступаем к созданию окна после инициализации приложения
app.on('ready', createWindow);

// Выходим из приложения по закрытию всех окон
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Создаем окно по клику на иконку в панели OS X
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
