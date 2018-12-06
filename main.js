const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, ipcMain} = electron;
const Menu = electron.Menu;

let mainwindow;
let addwindow;

//listen for app to be ready
app.on('ready', function(){
	//create new window
	mainwindow = new BrowserWindow({});
	//html file
	mainwindow.loadURL(url.format({
		pathname: path.join(__dirname, 'mainwindow.html'),
		protocol:'file:',
		slashes: true
	}));

	// close all
	mainwindow.on('closed', function (){
		app.quit();
	});

	//build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	//insert menu
	Menu.setApplicationMenu(mainMenu);
});

//create addwindow
function createaddwindow() {
	//create new window
	addwindow = new BrowserWindow({
		width: 300,
		height: 200,
		titel: 'add shoping list'
	});
	//html file
	addwindow.loadURL(url.format({
		pathname: path.join(__dirname, 'addwindow.html'),
		protocol:'file:',
		slashes: true
	}));	
}

// catch item
ipcMain.on('item:add', function(e, item){
	console.log(item);
	mainwindow.webContents.send('item:add', item);
	addwindow.close();
})

// create menu template
const mainMenuTemplate = [
	{
		label:'file',
		submenu:[
			{
				label:'add item',
				click(){
					createaddwindow();
				}
			},
			{
				label:'clear item'
			},
			{
				label:'quit',
				// add hotkeys to quit
				accelerator: process.platform == 'darwin' ? 'command+Q': 'ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	}
];

//add developer tools if process not in production
if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		accelerator: process.platform == 'darwin' ? 'command+shift+I': 'ctrl+shift+I',
		submenu:[
			{
				label: 'Toggle DevTools',
				click(item, focusedwindow){
					focusedwindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	})
}