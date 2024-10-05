// (c) chlove and tetrtop contributors, under the GPL 3.0 licence.
const { app, BrowserWindow, session } = require('electron');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { blockAds } = require('./adblock');

const configFilePath = path.join(__dirname, 'config.tetrtop.yml');

// Function to load the YAML config file
function loadConfig() {
  try {
    const fileContents = fs.readFileSync(configFilePath, 'utf8');
    return yaml.load(fileContents);
  } catch (e) {
    console.error('Error loading config:', e);
    return {};
  }
}

app.on('ready', () => {
  blockAds(); 

  const config = loadConfig(); 

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, 
      contextIsolation: true,  
      preload: path.join(__dirname, 'preload.js') 
    }
  });

  mainWindow.loadURL('https://tetr.io');
 
  mainWindow.webContents.on('did-finish-load', () => {
    if (config.theme) {
      const themePath = path.join(__dirname, config.theme);
      fs.readFile(themePath, 'utf8', (err, data) => {
        if (!err) {
          mainWindow.webContents.insertCSS(data);
          console.log(`Applied theme: ${config.theme}`);
        } else {
          console.error(`Error loading theme: ${themePath}`, err);
        }
      });
    }

    if (config.plugins && Array.isArray(config.plugins)) {
      config.plugins.forEach(plugin => {
        const pluginPath = path.join(__dirname, plugin);
        fs.readFile(pluginPath, 'utf8', (err, data) => {
          if (!err) {
            mainWindow.webContents.executeJavaScript(data);
            console.log(`Loaded plugin: ${plugin}`);
          } else {
            console.error(`Error loading plugin: ${pluginPath}`, err);
          }
        });
      });
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

