const { remote } = require('electron');

const { app, shell } = remote;

// Получаем элементы интерфейса, с которыми будем взаимодействовать
const btnMinimize = document.getElementById('btnMinimize');
const title = document.getElementById('title');
const version = document.getElementById('version');
const autoStartFlag = document.getElementById('autoStartFlag');
const licenseLink = document.getElementById('licenseLink');

// Выводим версию приложения на основании данных из package.json
version.innerHTML += app.getVersion();

// Устанавливаем значение чекбокса в зависимости от настроек автозагрузки в системе
autoStartFlag.checked = app.getLoginItemSettings().openAtLogin;

// Добавляем/удаляем приложение из автозагрузки при переключении чекбокса
autoStartFlag.addEventListener('change', () => {
  app.setLoginItemSettings({
    openAtLogin: autoStartFlag.checked,
  });
});

// Сворачиваем приложение при нажатии на кнопку "Свернуть"
btnMinimize.addEventListener('click', () => {
  remote.getCurrentWindow().hide();
});

// Обрабатываем нажатие на заголовок программы
title.addEventListener('click', () => {
  // Переходим в репозиторий приложения
  shell.openExternal('https://github.com/lozunoff/antisleeper');
});

// Обрабатываем нажатие по названию лицензии
licenseLink.addEventListener('click', () => {
  // Переходим в репозиторий приложения на страницу с текстом лицензии
  shell.openExternal('https://github.com/lozunoff/antisleeper/blob/master/LICENSE');
});
