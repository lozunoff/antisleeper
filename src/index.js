const {
  app, BrowserWindow, Menu, Tray, powerSaveBlocker,
} = require('electron');

const path = require('path');

// Флаг для переключения между сворачиванием и полным закрытием
let isQuiting = false;

let tray = null;

// Обрабатываем на Windows события создания/удаления ярлыков при инсталяции/деинсталяции приложения
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

  // Добавляем иконку приложения в трей
  const iconSize = process.platform === 'darwin' ? 'small' : 'big';
  tray = new Tray(path.join(__dirname, 'img', `icon-tray-${iconSize}.png`));

  // Настраиваем пункты меню в трее
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      type: 'normal',
      click: () => mainWindow.show(), // Разворачиваем приложение
    },
    {
      type: 'separator',
    },
    {
      label: 'Exit',
      type: 'normal',
      click: () => { // Закрываем приложение
        isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('AntiSleeper');
  tray.setContextMenu(contextMenu);

  // Сворачиваем/разворачиваем приложение по клику на иконку в трее
  tray.on('click', () => (mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()));

  // Перехватываем событие сворачивания
  mainWindow.on('minimize', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });

  // Перехватываем событие закрытия
  mainWindow.on('close', (e) => {
    if (!isQuiting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
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

app.on('before-quit', () => { isQuiting = true; });

// Запрещаем компьютеру засыпать, пока запущено приложение
powerSaveBlocker.start('prevent-display-sleep');
