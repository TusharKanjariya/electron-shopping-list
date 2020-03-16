const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

// SET ENV
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for the App Ready
app.on('ready', () => {
  // Create New Window
  mainWindow = new BrowserWindow({
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  });
  // Load HTML File into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'mainWindow.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // Quit app when closed
  mainWindow.on('closed', function() {
    app.quit();
  });
  // Build Menu from Templates
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert Menu
  Menu.setApplicationMenu(mainMenu);
});

// Handle create add Window
function createAddWindow() {
  // Create New Window
  addWindow = new BrowserWindow({
    width: 200,
    height: 300,
    title: 'Add Shopping List Item',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true
    }
  });

  // Load HTML File into window
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'addWindow.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  addWindow.on('closed', () => {
    addWindow = null;
  });
}

// Catch item:add
ipcMain.on('item:add', (e, item) => {
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
});

// Create Menu Templates
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        click() {
          createAddWindow();
        }
      },
      {
        label: 'Clear Items',
        click() {
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'Command + Q' : 'Ctrl + Q',
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'MyMenu',
    submenu: [{ label: 'Submenu1' }]
  }
];

if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({ label: 'Main' });
}

if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DewvTools',
        accelerator: process.platform == 'darwin' ? 'Command + I' : 'Ctrl + I',
        click(item, focuedWindow) {
          focuedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}
