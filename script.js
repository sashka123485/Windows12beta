// Имитация загрузки Windows 12
document.addEventListener('DOMContentLoaded', function() {
    const bootScreen = document.getElementById('boot-screen');
    const bootProgressBar = document.getElementById('boot-progress-bar');
    const bootText = document.getElementById('boot-text');
    const bootPercentage = document.getElementById('boot-percentage');
    const desktop = document.getElementById('desktop');
    const taskbar = document.getElementById('taskbar');
    const notification = document.getElementById('notification');
    
    let progress = 0;
    const bootMessages = [
        "Подготовка к работе",
        "Загрузка ядра Windows",
        "Инициализация драйверов",
        "Запуск системных служб",
        "Подготовка рабочего стола",
        "Загрузка параметров пользователя",
        "Запуск фоновых процессов",
        "Оптимизация системы",
        "Проверка обновлений",
        "Инициализация защиты"
    ];
    
    const bootInterval = setInterval(() => {
        progress += Math.random() * 8 + 2;
        if (progress > 100) progress = 100;
        
        bootProgressBar.style.width = progress + '%';
        bootPercentage.textContent = Math.floor(progress) + '%';
        
        // Смена сообщений в процессе загрузки
        const messageIndex = Math.min(Math.floor(progress / 10), bootMessages.length - 1);
        bootText.textContent = bootMessages[messageIndex];
        
        if (progress >= 100) {
            clearInterval(bootInterval);
            
            // Задержка перед показом рабочего стола
            setTimeout(() => {
                bootScreen.style.opacity = '0';
                setTimeout(() => {
                    bootScreen.style.display = 'none';
                    desktop.style.display = 'block';
                    taskbar.style.display = 'flex';
                    
                    // Показываем уведомление
                    notification.style.display = 'block';
                    setTimeout(() => {
                        notification.style.display = 'none';
                    }, 3000);
                }, 1000);
            }, 500);
        }
    }, 200);
});

// Обновление времени и даты
function updateDateTime() {
    const now = new Date();
    
    // Время
    const timeString = now.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    document.getElementById('time').textContent = timeString;
    
    // Дата
    const dateString = now.toLocaleDateString('ru-RU', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
    });
    document.getElementById('date').textContent = dateString;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// Управление окнами
const windows = document.querySelectorAll('.window');
const desktopIcons = document.querySelectorAll('.desktop-icon');
const startApps = document.querySelectorAll('.start-app');
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');
const taskbarApps = document.getElementById('taskbar-apps');

// Переменные для перетаскивания окон
let activeWindow = null;
let isDragging = false;
let dragOffset = { x: 0, y: 0 };

// Создаем контекстное меню
const contextMenu = document.createElement('div');
contextMenu.className = 'context-menu';
contextMenu.id = 'context-menu';
document.body.appendChild(contextMenu);

// Хранилище для установленных приложений
let installedApps = JSON.parse(localStorage.getItem('installedApps') || '[]');

// Открытие приложений
function openApp(appId) {
    const appWindow = document.getElementById(appId);
    
    if (!appWindow) return;
    
    // Закрываем меню Пуск при открытии приложения
    startMenu.classList.remove('active');
    
    // Показываем окно приложения
    appWindow.style.display = 'flex';
    appWindow.classList.add('active');
    setActiveWindow(appWindow);
    
    // Добавляем приложение в панель задач, если его там еще нет
    const existingTaskbarApp = document.querySelector(`.taskbar-app[data-app="${appId}"]`);
    if (!existingTaskbarApp) {
        const taskbarApp = document.createElement('button');
        taskbarApp.className = 'taskbar-app active';
        taskbarApp.dataset.app = appId;
        
        const appIcon = appWindow.querySelector('.window-title i').cloneNode(true);
        const appName = document.createElement('span');
        appName.textContent = appWindow.querySelector('.window-title span').textContent;
        
        taskbarApp.appendChild(appIcon);
        taskbarApp.appendChild(appName);
        
        taskbarApp.addEventListener('click', () => {
            // Переключаем видимость окна при клике на кнопку в панели задач
            if (appWindow.style.display === 'none' || !appWindow.style.display) {
                appWindow.style.display = 'flex';
                setActiveWindow(appWindow);
                taskbarApp.classList.add('active');
            } else {
                appWindow.style.display = 'none';
                taskbarApp.classList.remove('active');
            }
        });
        
        taskbarApps.appendChild(taskbarApp);
    } else {
        existingTaskbarApp.classList.add('active');
    }
    
    // Добавляем обработчики для кнопок управления окном
    setupWindowControls(appWindow, appId);
}

// Настройка управления окном
function setupWindowControls(appWindow, appId) {
    const closeBtn = appWindow.querySelector('.close');
    const minimizeBtn = appWindow.querySelector('.minimize');
    const maximizeBtn = appWindow.querySelector('.maximize');
    
    if (closeBtn && !closeBtn.hasListener) {
        closeBtn.hasListener = true;
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            appWindow.style.display = 'none';
            const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appId}"]`);
            if (taskbarApp) taskbarApp.remove();
        });
    }
    
    if (minimizeBtn && !minimizeBtn.hasListener) {
        minimizeBtn.hasListener = true;
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            appWindow.style.display = 'none';
            const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appId}"]`);
            if (taskbarApp) taskbarApp.classList.remove('active');
        });
    }
    
    if (maximizeBtn && !maximizeBtn.hasListener) {
        maximizeBtn.hasListener = true;
        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (appWindow.classList.contains('maximized')) {
                // Восстанавливаем размер
                appWindow.classList.remove('maximized');
                appWindow.style.width = '';
                appWindow.style.height = '';
                appWindow.style.top = '';
                appWindow.style.left = '';
                appWindow.style.transform = '';
                maximizeBtn.innerHTML = '<i class="fas fa-square"></i>';
            } else {
                // Разворачиваем на весь экран
                appWindow.classList.add('maximized');
                appWindow.style.width = 'calc(100% - 4px)';
                appWindow.style.height = 'calc(100% - 52px)';
                appWindow.style.top = '2px';
                appWindow.style.left = '2px';
                maximizeBtn.innerHTML = '<i class="fas fa-window-restore"></i>';
            }
        });
    }
    
    // Настройка перетаскивания окна
    const header = appWindow.querySelector('.window-header');
    if (header && !header.hasListener) {
        header.hasListener = true;
        header.addEventListener('mousedown', startDrag);
    }
}

function startDrag(e) {
    if (e.target.closest('.window-control')) return;
    
    const windowElement = e.target.closest('.window');
    if (!windowElement || windowElement.classList.contains('maximized')) return;
    
    isDragging = true;
    activeWindow = windowElement;
    dragOffset.x = e.clientX - windowElement.offsetLeft;
    dragOffset.y = e.clientY - windowElement.offsetTop;
    
    setActiveWindow(windowElement);
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
    if (!isDragging || !activeWindow) return;
    
    activeWindow.style.left = (e.clientX - dragOffset.x) + 'px';
    activeWindow.style.top = (e.clientY - dragOffset.y) + 'px';
}

function stopDrag() {
    isDragging = false;
    activeWindow = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}

function setActiveWindow(windowElement) {
    // Сбрасываем z-index всех окон
    windows.forEach(win => {
        win.style.zIndex = '10';
        win.classList.remove('active');
    });
    
    // Устанавливаем активное окно поверх всех
    windowElement.style.zIndex = '100';
    windowElement.classList.add('active');
    
    // Обновляем активное состояние в панели задач
    document.querySelectorAll('.taskbar-app').forEach(app => app.classList.remove('active'));
    const taskbarApp = document.querySelector(`.taskbar-app[data-app="${windowElement.id}"]`);
    if (taskbarApp) taskbarApp.classList.add('active');
}

// ============ ПРОВОДНИК (УЛУЧШЕННАЯ ВЕРСИЯ) ============
let currentFolder = 'computer';
let pathHistory = ['computer'];
let historyIndex = 0;

const folders = {
    'home': [
        { name: 'Рабочий стол', icon: 'fas fa-desktop', type: 'folder', path: 'desktop' },
        { name: 'Загрузки', icon: 'fas fa-download', type: 'folder', path: 'downloads' },
        { name: 'Документы', icon: 'fas fa-folder', type: 'folder', path: 'documents' },
        { name: 'Изображения', icon: 'fas fa-image', type: 'folder', path: 'pictures' },
        { name: 'Музыка', icon: 'fas fa-music', type: 'folder', path: 'music' },
        { name: 'Видео', icon: 'fas fa-video', type: 'folder', path: 'videos' },
        { name: 'Этот компьютер', icon: 'fas fa-hdd', type: 'folder', path: 'computer' }
    ],
    'desktop': [
        { name: 'Блокнот.lnk', icon: 'fas fa-file-alt', type: 'shortcut', app: 'notepad' },
        { name: 'Калькулятор.lnk', icon: 'fas fa-calculator', type: 'shortcut', app: 'calculator' },
        { name: 'Проводник.lnk', icon: 'fas fa-folder', type: 'shortcut', app: 'file-explorer' },
        { name: 'Paint.lnk', icon: 'fas fa-paint-brush', type: 'shortcut', app: 'paint' }
    ],
    'downloads': [
        { name: 'installer.exe', icon: 'fas fa-file-download', type: 'executable', size: '245 MB' },
        { name: 'readme.txt', icon: 'fas fa-file-alt', type: 'text', size: '2 KB' },
        { name: 'photo.jpg', icon: 'fas fa-image', type: 'image', size: '5 MB' }
    ],
    'documents': [
        { name: 'Отчет.docx', icon: 'fas fa-file-word', type: 'document', size: '156 KB' },
        { name: 'Презентация.pptx', icon: 'fas fa-file-powerpoint', type: 'document', size: '2.4 MB' },
        { name: 'Таблица.xlsx', icon: 'fas fa-file-excel', type: 'document', size: '89 KB' },
        { name: 'Заметки.txt', icon: 'fas fa-file-alt', type: 'text', size: '12 KB' }
    ],
    'pictures': [
        { name: 'Обои.jpg', icon: 'fas fa-image', type: 'image', size: '3.2 MB' },
        { name: 'Скриншот.png', icon: 'fas fa-camera', type: 'image', size: '1.1 MB' },
        { name: 'Аватар.jpg', icon: 'fas fa-portrait', type: 'image', size: '456 KB' }
    ],
    'music': [
        { name: 'Song1.mp3', icon: 'fas fa-music', type: 'audio', size: '5.4 MB' },
        { name: 'Podcast.mp3', icon: 'fas fa-podcast', type: 'audio', size: '45 MB' },
        { name: 'Recording.wav', icon: 'fas fa-microphone', type: 'audio', size: '12 MB' }
    ],
    'videos': [
        { name: 'Tutorial.mp4', icon: 'fas fa-video', type: 'video', size: '234 MB' },
        { name: 'Presentation.mp4', icon: 'fas fa-file-video', type: 'video', size: '156 MB' }
    ],
    'computer': [
        { name: 'Локальный диск (C:)', icon: 'fas fa-hdd', type: 'drive', size: '128 GB свободно из 256 GB', path: 'c-drive' },
        { name: 'Диск (D:)', icon: 'fas fa-hdd', type: 'drive', size: '512 GB свободно из 1 TB', path: 'd-drive' },
        { name: 'DVD-привод (E:)', icon: 'fas fa-compact-disc', type: 'drive', path: 'dvd' }
    ],
    'c-drive': [
        { name: 'Windows', icon: 'fas fa-folder', type: 'system', path: 'windows-folder' },
        { name: 'Program Files', icon: 'fas fa-folder', type: 'folder', path: 'program-files' },
        { name: 'Users', icon: 'fas fa-users', type: 'folder', path: 'users-folder' },
        { name: 'Games', icon: 'fas fa-gamepad', type: 'folder', path: 'games-folder' }
    ],
    'windows-folder': [
        { name: 'System32', icon: 'fas fa-folder', type: 'system' },
        { name: 'explorer.exe', icon: 'fas fa-cog', type: 'executable' },
        { name: 'notepad.exe', icon: 'fas fa-file-alt', type: 'executable' }
    ],
    'program-files': [
        { name: 'Microsoft Office', icon: 'fas fa-folder', type: 'folder' },
        { name: 'Google Chrome', icon: 'fab fa-chrome', type: 'folder' },
        { name: 'Visual Studio Code', icon: 'fas fa-code', type: 'folder' }
    ],
    'users-folder': [
        { name: 'Пользователь', icon: 'fas fa-user', type: 'folder' },
        { name: 'Public', icon: 'fas fa-users', type: 'folder' }
    ],
    'games-folder': [],
    'd-drive': [
        { name: 'Media', icon: 'fas fa-folder', type: 'folder' },
        { name: 'Backup', icon: 'fas fa-archive', type: 'folder' },
        { name: 'Projects', icon: 'fas fa-project-diagram', type: 'folder' }
    ],
    'dvd': []
};

// Загружаем установленные игры в папку Games
function updateGamesFolder() {
    if (!folders['games-folder']) folders['games-folder'] = [];
    folders['games-folder'] = [];
    
    installedApps.forEach(app => {
        if (app.category === 'games') {
            folders['games-folder'].push({
                name: app.name + '.exe',
                icon: 'fas fa-gamepad',
                type: 'game',
                app: app.id
            });
        }
    });
}

function loadFolder(folderName) {
    currentFolder = folderName;
    
    // Обновляем папку с играми перед загрузкой
    if (folderName === 'games-folder') {
        updateGamesFolder();
    }
    
    const filesGrid = document.getElementById('files-grid');
    if (!filesGrid) return;
    
    filesGrid.innerHTML = '';
    
    const folderItems = folders[folderName] || [];
    
    if (folderItems.length === 0) {
        filesGrid.innerHTML = '<div style="color: #888; padding: 20px; text-align: center;">Папка пуста</div>';
    }
    
    folderItems.forEach(item => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.type = item.type;
        
        if (item.app) {
            fileItem.dataset.app = item.app;
        } else if (item.path) {
            fileItem.dataset.path = item.path;
        }
        
        fileItem.innerHTML = `
            <div class="file-icon">
                <i class="${item.icon}"></i>
            </div>
            <div class="file-name">${item.name}</div>
        `;
        
        if (item.size) {
            const sizeInfo = document.createElement('div');
            sizeInfo.style.cssText = 'color: #888; font-size: 10px; margin-top: 4px;';
            sizeInfo.textContent = item.size;
            fileItem.appendChild(sizeInfo);
        }
        
        fileItem.addEventListener('dblclick', () => {
            if (item.type === 'folder' || item.path) {
                navigateTo(item.path);
            } else if ((item.type === 'shortcut' || item.type === 'game') && item.app) {
                openApp(item.app);
            } else if (item.type === 'executable') {
                showNotification(`Запуск: ${item.name}`, 'Проводник');
            } else {
                showNotification(`Открыт файл: ${item.name}`, 'Проводник');
            }
        });
        
        fileItem.addEventListener('click', () => {
            // Выделение файла
            document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));
            fileItem.classList.add('active');
        });
        
        // Контекстное меню для файлов
        fileItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const menuItems = [
                { text: 'Открыть', icon: 'fas fa-folder-open', action: () => {
                    if (item.type === 'folder' || item.path) {
                        navigateTo(item.path);
                    } else if (item.app) {
                        openApp(item.app);
                    } else {
                        showNotification(`Открыт: ${item.name}`);
                    }
                }},
                { text: 'Копировать', icon: 'fas fa-copy', action: () => showNotification('Скопировано в буфер обмена') },
                { text: 'Вырезать', icon: 'fas fa-cut', action: () => showNotification('Вырезано') },
                { text: 'Удалить', icon: 'fas fa-trash', action: () => showNotification('Файл удален') },
                { text: 'Переименовать', icon: 'fas fa-edit', action: () => {
                    const newName = prompt('Новое имя:', item.name);
                    if (newName && newName !== item.name) {
                        item.name = newName;
                        fileItem.querySelector('.file-name').textContent = newName;
                        showNotification('Файл переименован');
                    }
                }},
                { text: 'Свойства', icon: 'fas fa-info-circle', action: () => {
                    alert(`Имя: ${item.name}\nТип: ${item.type}\nРазмер: ${item.size || 'Неизвестно'}\nРасположение: ${currentFolder}`);
                }}
            ];
            
            showContextMenu(e, menuItems);
        });
        
        filesGrid.appendChild(fileItem);
    });
    
    updatePath();
    updateSidebar();
}

function navigateTo(folderName) {
    pathHistory = pathHistory.slice(0, historyIndex + 1);
    pathHistory.push(folderName);
    historyIndex++;
    loadFolder(folderName);
}

function goBack() {
    if (historyIndex > 0) {
        historyIndex--;
        loadFolder(pathHistory[historyIndex]);
    }
}

function goForward() {
    if (historyIndex < pathHistory.length - 1) {
        historyIndex++;
        loadFolder(pathHistory[historyIndex]);
    }
}

function goUp() {
    // Логика перехода на уровень выше
    const parentFolders = {
        'desktop': 'home',
        'downloads': 'home',
        'documents': 'home',
        'pictures': 'home',
        'music': 'home',
        'videos': 'home',
        'computer': 'home',
        'c-drive': 'computer',
        'd-drive': 'computer',
        'dvd': 'computer',
        'windows-folder': 'c-drive',
        'program-files': 'c-drive',
        'users-folder': 'c-drive',
        'games-folder': 'c-drive'
    };
    
    if (parentFolders[currentFolder]) {
        navigateTo(parentFolders[currentFolder]);
    } else if (currentFolder !== 'home') {
        navigateTo('home');
    }
}

function updatePath() {
    const pathNames = {
        'home': 'Быстрый доступ',
        'desktop': 'Рабочий стол',
        'downloads': 'Загрузки',
        'documents': 'Документы',
        'pictures': 'Изображения',
        'music': 'Музыка',
        'videos': 'Видео',
        'computer': 'Этот компьютер',
        'c-drive': 'Локальный диск (C:)',
        'd-drive': 'Диск (D:)',
        'dvd': 'DVD-привод (E:)',
        'windows-folder': 'Windows',
        'program-files': 'Program Files',
        'users-folder': 'Users',
        'games-folder': 'Games'
    };
    
    const currentPathEl = document.getElementById('current-path');
    if (currentPathEl) {
        currentPathEl.textContent = pathNames[currentFolder] || currentFolder;
    }
}

function updateSidebar() {
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.path === currentFolder) {
            item.classList.add('active');
        }
    });
}

// ============ MICROSOFT EDGE (УЛУЧШЕННАЯ ВЕРСИЯ) ============
let currentUrl = 'https://www.microsoft.com/ru-ru/windows';
let browserHistory = [currentUrl];
let browserHistoryIndex = 0;
const favorites = JSON.parse(localStorage.getItem('edgeFavorites') || '[]');

function navigateToUrl(url) {
    if (!url) return;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        if (url.includes('.')) {
            url = 'https://' + url;
        } else {
            url = 'https://www.bing.com/search?q=' + encodeURIComponent(url);
        }
    }
    
    const browserStatusText = document.getElementById('browser-status-text');
    if (browserStatusText) browserStatusText.textContent = 'Загрузка...';
    
    currentUrl = url;
    const browserUrl = document.getElementById('browser-url');
    if (browserUrl) browserUrl.value = url;
    
    // Добавляем в историю
    browserHistory = browserHistory.slice(0, browserHistoryIndex + 1);
    browserHistory.push(url);
    browserHistoryIndex++;
    
    // Показываем загрузку
    const browserNewtab = document.getElementById('browser-newtab');
    if (browserNewtab) browserNewtab.style.display = 'none';
    
    // Имитация загрузки страницы
    setTimeout(() => {
        if (browserStatusText) {
            browserStatusText.textContent = 'Готово';
            
            // Показываем упрощенное содержимое страницы
            if (browserNewtab) {
                browserNewtab.style.display = 'none';
            }
            
            try {
                const hostname = new URL(url).hostname;
                showNotification(`Загружена страница: ${hostname}`, 'Microsoft Edge');
            } catch {
                showNotification('Страница загружена', 'Microsoft Edge');
            }
        }
    }, 800);
}

// Обработчики для быстрых ссылок
document.querySelectorAll('.quicklink').forEach(link => {
    link.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        navigateToUrl(url);
    });
});

// ============ MICROSOFT STORE (НОВАЯ ФУНКЦИОНАЛЬНОСТЬ) ============
function initializeStore() {
    const storeWindow = document.getElementById('store');
    if (!storeWindow || storeWindow.dataset.initialized) return;
    
    storeWindow.dataset.initialized = 'true';
    
    // Создаем содержимое магазина
    const contentArea = storeWindow.querySelector('.window-content');
    if (!contentArea) return;
    
    contentArea.innerHTML = `
        <div class="store-container" style="padding: 20px; color: white;">
            <div class="store-header" style="margin-bottom: 20px;">
                <h2 style="margin-bottom: 15px;">Microsoft Store</h2>
                <div class="store-search" style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <input type="text" id="store-search-input" placeholder="Поиск игр и приложений..." 
                           style="flex: 1; padding: 10px; background: #333; border: 1px solid #555; border-radius: 5px; color: white;">
                    <button id="store-search-btn" style="padding: 10px 20px; background: #0078d7; border: none; border-radius: 5px; color: white; cursor: pointer;">
                        <i class="fas fa-search"></i> Поиск
                    </button>
                </div>
                <div class="store-categories" style="display: flex; gap: 10px;">
                    <button class="store-category active" data-category="all" style="padding: 8px 16px; background: #0078d7; border: none; border-radius: 20px; color: white; cursor: pointer;">Все</button>
                    <button class="store-category" data-category="games" style="padding: 8px 16px; background: #333; border: 1px solid #555; border-radius: 20px; color: white; cursor: pointer;">Игры</button>
                    <button class="store-category" data-category="apps" style="padding: 8px 16px; background: #333; border: 1px solid #555; border-radius: 20px; color: white; cursor: pointer;">Приложения</button>
                    <button class="store-category" data-category="entertainment" style="padding: 8px 16px; background: #333; border: 1px solid #555; border-radius: 20px; color: white; cursor: pointer;">Развлечения</button>
                </div>
            </div>
            <div class="store-items" id="store-items" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; max-height: calc(100vh - 300px); overflow-y: auto;">
            </div>
        </div>
    `;
    
    // Данные магазина
    const storeItems = [
        // Игры
        { id: 'minecraft', name: 'Minecraft', category: 'games', icon: 'fas fa-cube', price: '2,499 ₽', size: '1.2 GB', rating: '4.5', description: 'Строительство, выживание и приключения' },
        { id: 'solitaire', name: 'Microsoft Solitaire', category: 'games', icon: 'fas fa-dice', price: 'Бесплатно', size: '150 MB', rating: '4.3', description: 'Классический пасьянс' },
        { id: 'forza', name: 'Forza Horizon 5', category: 'games', icon: 'fas fa-car', price: '3,499 ₽', size: '103 GB', rating: '4.8', description: 'Гоночный симулятор' },
        { id: 'halo', name: 'Halo Infinite', category: 'games', icon: 'fas fa-shield-alt', price: 'Бесплатно', size: '50 GB', rating: '4.2', description: 'Шутер от первого лица' },
        { id: 'flight-sim', name: 'Flight Simulator', category: 'games', icon: 'fas fa-plane', price: '4,999 ₽', size: '150 GB', rating: '4.7', description: 'Авиасимулятор' },
        
        // Приложения
        { id: 'office', name: 'Microsoft 365', category: 'apps', icon: 'fas fa-file-alt', price: '6,999 ₽/год', size: '3.5 GB', rating: '4.6', description: 'Офисные приложения' },
        { id: 'spotify', name: 'Spotify', category: 'apps', icon: 'fab fa-spotify', price: 'Бесплатно', size: '200 MB', rating: '4.4', description: 'Музыкальный стриминг' },
        { id: 'discord', name: 'Discord', category: 'apps', icon: 'fab fa-discord', price: 'Бесплатно', size: '150 MB', rating: '4.5', description: 'Голосовой и текстовый чат' },
        
        // Развлечения
        { id: 'netflix', name: 'Netflix', category: 'entertainment', icon: 'fas fa-tv', price: 'Бесплатно', size: '100 MB', rating: '4.3', description: 'Потоковое видео' },
        { id: 'youtube', name: 'YouTube', category: 'entertainment', icon: 'fab fa-youtube', price: 'Бесплатно', size: '50 MB', rating: '4.7', description: 'Видеохостинг' }
    ];
    
    // Функция отображения элементов магазина
    function displayStoreItems(category = 'all', searchQuery = '') {
        const storeItemsContainer = document.getElementById('store-items');
        if (!storeItemsContainer) return;
        
        storeItemsContainer.innerHTML = '';
        
        let filteredItems = storeItems;
        
        if (category !== 'all') {
            filteredItems = filteredItems.filter(item => item.category === category);
        }
        
        if (searchQuery) {
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        filteredItems.forEach(item => {
            const isInstalled = installedApps.some(app => app.id === item.id);
            
            const itemElement = document.createElement('div');
            itemElement.style.cssText = 'background: #2d2d2d; border: 1px solid #404040; border-radius: 8px; padding: 16px; transition: all 0.3s; cursor: pointer;';
            
            itemElement.innerHTML = `
                <div style="text-align: center; margin-bottom: 12px;">
                    <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #0078d7, #5d5dff); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;">
                        <i class="${item.icon}" style="font-size: 28px; color: white;"></i>
                    </div>
                </div>
                <h3 style="margin: 0 0 8px 0; font-size: 16px;">${item.name}</h3>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #888;">${item.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 12px; color: #aaa;">${item.size}</span>
                    <span style="color: #ffd700;">★ ${item.rating}</span>
                </div>
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 12px;">${item.price}</div>
                <button class="store-install-btn" data-id="${item.id}" data-name="${item.name}" data-category="${item.category}"
                        style="width: 100%; padding: 8px; background: ${isInstalled ? '#28a745' : '#0078d7'}; border: none; border-radius: 5px; color: white; cursor: pointer; font-weight: bold;">
                    ${isInstalled ? '<i class="fas fa-check"></i> Установлено' : '<i class="fas fa-download"></i> Установить'}
                </button>
            `;
            
            storeItemsContainer.appendChild(itemElement);
        });
        
        // Добавляем обработчики для кнопок установки
        document.querySelectorAll('.store-install-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const appId = this.dataset.id;
                const appName = this.dataset.name;
                const appCategory = this.dataset.category;
                
                installApp(appId, appName, appCategory, this);
            });
        });
        
        // Обработчики для клика по карточке
        itemElement.addEventListener('click', function() {
            const item = storeItems.find(i => i.id === this.querySelector('.store-install-btn').dataset.id);
            if (item) {
                showNotification(`${item.name}\nРейтинг: ★ ${item.rating}\nРазмер: ${item.size}\n${item.description}`, 'Microsoft Store');
            }
        });
    }
    
    // Функция установки приложения
    function installApp(appId, appName, category, buttonElement) {
        if (installedApps.some(app => app.id === appId)) {
            showNotification('Это приложение уже установлено', 'Microsoft Store');
            return;
        }
        
        // Имитация установки
        buttonElement.disabled = true;
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Установка...';
        
        let progress = 0;
        const installInterval = setInterval(() => {
            progress += Math.random() * 20 + 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(installInterval);
                
                installedApps.push({ id: appId, name: appName, category: category, installDate: new Date().toISOString() });
                localStorage.setItem('installedApps', JSON.stringify(installedApps));
                
                buttonElement.innerHTML = '<i class="fas fa-check"></i> Установлено';
                buttonElement.style.background = '#28a745';
                buttonElement.disabled = false;
                
                showNotification(`${appName} успешно установлено!`, 'Microsoft Store');
                
                // Добавляем иконку на рабочий стол
                addDesktopIcon(appId, appName, category);
            } else {
                buttonElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Установка... ${Math.floor(progress)}%`;
            }
        }, 300);
    }
    
    // Функция добавления иконки на рабочий стол
    function addDesktopIcon(appId, appName, category) {
        const desktopIconsContainer = document.querySelector('.desktop-icons');
        if (!desktopIconsContainer) return;
        
        // Проверяем, существует ли уже иконка
        if (document.querySelector(`.desktop-icon[data-app="${appId}"]`)) return;
        
        const iconMapping = {
            'minecraft': 'fas fa-cube',
            'solitaire': 'fas fa-dice',
            'forza': 'fas fa-car',
            'halo': 'fas fa-shield-alt',
            'flight-sim': 'fas fa-plane',
            'office': 'fas fa-file-alt',
            'spotify': 'fab fa-spotify',
            'discord': 'fab fa-discord',
            'netflix': 'fas fa-tv',
            'youtube': 'fab fa-youtube'
        };
        
        const newIcon = document.createElement('div');
        newIcon.className = 'desktop-icon';
        newIcon.dataset.app = appId;
        newIcon.innerHTML = `
            <div class="icon-wrapper">
                <i class="${iconMapping[appId] || 'fas fa-cube'}"></i>
            </div>
            <span>${appName}</span>
        `;
        
        newIcon.addEventListener('click', () => {
            showNotification(`Запуск: ${appName}`, 'Система');
            if (category === 'games') {
                showNotification(`🎮 Запуск игры: ${appName}`, 'Игры');
            }
        });
        
        desktopIconsContainer.appendChild(newIcon);
    }
    
    // Категории магазина
    document.querySelectorAll('.store-category').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.store-category').forEach(b => {
                b.style.background = '#333';
                b.style.border = '1px solid #555';
                b.classList.remove('active');
            });
            this.style.background = '#0078d7';
            this.style.border = 'none';
            this.classList.add('active');
            displayStoreItems(this.dataset.category);
        });
    });
    
    // Поиск в магазине
    const searchInput = document.getElementById('store-search-input');
    const searchBtn = document.getElementById('store-search-btn');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            displayStoreItems('all', searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                displayStoreItems('all', searchInput.value);
            }
        });
    }
    
    // Загружаем элементы магазина
    displayStoreItems();
}

// ============ ПАРАМЕТРЫ (НОВАЯ ФУНКЦИОНАЛЬНОСТЬ) ============
function initializeSettings() {
    const settingsWindow = document.getElementById('settings');
    if (!settingsWindow || settingsWindow.dataset.initialized) return;
    
    settingsWindow.dataset.initialized = 'true';
    
    const contentArea = settingsWindow.querySelector('.window-content');
    if (!contentArea) return;
    
    contentArea.innerHTML = `
        <div class="settings-container" style="display: flex; height: 100%;">
            <div class="settings-sidebar" style="width: 200px; background: #252525; border-right: 1px solid #404040; padding: 20px;">
                <div class="settings-nav-item active" data-section="system" style="padding: 12px; cursor: pointer; border-radius: 5px; margin-bottom: 5px; display: flex; align-items: center; gap: 10px; background: #0078d7; color: white;">
                    <i class="fas fa-desktop"></i> Система
                </div>
                <div class="settings-nav-item" data-section="personalization" style="padding: 12px; cursor: pointer; border-radius: 5px; margin-bottom: 5px; display: flex; align-items: center; gap: 10px; color: #ccc;">
                    <i class="fas fa-palette"></i> Персонализация
                </div>
                <div class="settings-nav-item" data-section="apps" style="padding: 12px; cursor: pointer; border-radius: 5px; margin-bottom: 5px; display: flex; align-items: center; gap: 10px; color: #ccc;">
                    <i class="fas fa-cubes"></i> Приложения
                </div>
                <div class="settings-nav-item" data-section="games" style="padding: 12px; cursor: pointer; border-radius: 5px; margin-bottom: 5px; display: flex; align-items: center; gap: 10px; color: #ccc;">
                    <i class="fas fa-gamepad"></i> Игры
                </div>
                <div class="settings-nav-item" data-section="network" style="padding: 12px; cursor: pointer; border-radius: 5px; margin-bottom: 5px; display: flex; align-items: center; gap: 10px; color: #ccc;">
                    <i class="fas fa-wifi"></i> Сеть и интернет
                </div>
                <div class="settings-nav-item" data-section="updates" style="padding: 12px; cursor: pointer; border-radius: 5px; margin-bottom: 5px; display: flex; align-items: center; gap: 10px; color: #ccc;">
                    <i class="fas fa-sync-alt"></i> Обновление
                </div>
            </div>
            <div class="settings-content" id="settings-content" style="flex: 1; padding: 20px; overflow-y: auto;">
            </div>
        </div>
    `;
    
    const settingsSections = {
        'system': `
            <h2 style="color: white; margin-bottom: 20px;">Система</h2>
            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: white; margin-bottom: 15px;">Информация о системе</h3>
                <div style="color: #ccc; line-height: 2;">
                    <div><strong>ОС:</strong> Windows 12 Beta</div>
                    <div><strong>Версия:</strong> 26000.1</div>
                    <div><strong>Сборка:</strong> 24H2</div>
                    <div><strong>Процессор:</strong> Intel Core i7-14700K</div>
                    <div><strong>ОЗУ:</strong> 32 GB</div>
                    <div><strong>Тип системы:</strong> 64-bit</div>
                </div>
            </div>
            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: white; margin-bottom: 15px;">Хранилище</h3>
                <div style="color: #ccc;">
                    <div style="margin-bottom: 10px;">Локальный диск (C:) - 128 GB свободно из 256 GB</div>
                    <div style="background: #404040; height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 20px;">
                        <div style="background: #0078d7; height: 100%; width: 50%;"></div>
                    </div>
                    <div style="margin-bottom: 10px;">Диск (D:) - 512 GB свободно из 1 TB</div>
                    <div style="background: #404040; height: 10px; border-radius: 5px; overflow: hidden;">
                        <div style="background: #28a745; height: 100%; width: 50%;"></div>
                    </div>
                </div>
            </div>
        `,
        'personalization': `
            <h2 style="color: white; margin-bottom: 20px;">Персонализация</h2>
            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: white; margin-bottom: 15px;">Фон рабочего стола</h3>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <div style="width: 100px; height: 60px; background: linear-gradient(135deg, #0a0a2a, #1a1a3a); border-radius: 5px; cursor: pointer; border: 2px solid #0078d7;" onclick="changeWallpaper('default')"></div>
                    <div style="width: 100px; height: 60px; background: linear-gradient(135deg, #1a472a, #2d5a3f); border-radius: 5px; cursor: pointer; border: 2px solid transparent;" onclick="changeWallpaper('green')"></div>
                    <div style="width: 100px; height: 60px; background: linear-gradient(135deg, #4a1a1a, #6b2d2d); border-radius: 5px; cursor: pointer; border: 2px solid transparent;" onclick="changeWallpaper('red')"></div>
                    <div style="width: 100px; height: 60px; background: linear-gradient(135deg, #1a1a4a, #2d2d6b); border-radius: 5px; cursor: pointer; border: 2px solid transparent;" onclick="changeWallpaper('blue')"></div>
                </div>
            </div>
            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: white; margin-bottom: 15px;">Цветовая схема</h3>
                <div style="display: flex; gap: 10px;">
                    <button onclick="changeTheme('dark')" style="padding: 10px 20px; background: #333; border: 2px solid #0078d7; border-radius: 5px; color: white; cursor: pointer;">Темная</button>
                    <button onclick="changeTheme('light')" style="padding: 10px 20px; background: #555; border: 2px solid transparent; border-radius: 5px; color: white; cursor: pointer;">Светлая</button>
                </div>
            </div>
        `,
        'apps': `
            <h2 style="color: white; margin-bottom: 20px;">Приложения и возможности</h2>
            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px;">
                <h3 style="color: white; margin-bottom: 15px;">Установленные приложения</h3>
                <div id="installed-apps-list" style="color: #ccc;">
                    ${installedApps.length === 0 ? '<p>Нет установленных приложений</p>' : 
                        installedApps.map(app => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #333; margin-bottom: 5px; border-radius: 5px;">
                                <span>${app.name}</span>
                                <button onclick="uninstallApp('${app.id}')" style="padding: 5px 10px; background: #dc3545; border: none; border-radius: 3px; color: white; cursor: pointer;">
                                    <i class="fas fa-trash"></i> Удалить
                                </button>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `,
        'games': `
            <h2 style="color: white; margin-bottom: 20px;">Игры</h2>
            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: white; margin-bottom: 15px;">Установленные игры</h3>
                <div id="installed-games-list" style="color: #ccc;">
                    ${installedApps.filter(app => app.category === 'games').length === 0 ? '<p>Нет установленных игр. Установите игры из Microsoft Store!</p>' : ''}
                </div>
            </div>
            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px;">
                <h3 style="color: white; margin-bottom: 15px;">Настройки игр</h3>
                <button onclick="showNotification('Оптимизация игр включена', 'Игры')" style="padding: 10px 20px; background: #0078d7; border: none; border-radius: 5px; color: white; cursor: pointer; margin-right: 10px;">
                    <i class="fas fa-rocket"></i> Игровой режим
                </button>
                <button onclick="showNotification('Запись экрана запущена', 'Игры')" style="padding: 10px 20px; background: #333; border: 1px solid #555; border-radius: 5px; color: white; cursor: pointer;">
                    <i class="fas fa-record-vinyl"></i> Запись
                </button>
            </div>
        `,
        'network': `
            <h2 style="color: white; margin-bottom: 20px;">Сеть и интернет</h2>
            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: white; margin-bottom: 15px;">Wi-Fi</h3>
                <div style="color: #ccc;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span><i class="fas fa-wifi" style="color: #28a745;"></i> Домашняя сеть</span>
                        <span>Подключено</span>
                    </div>
                    <div style="margin-bottom: 10px;">Скорость: 100 Mbps</div>
                    <button onclick="showNotification('Поиск сетей...', 'Сеть')" style="padding: 8px 16px; background: #0078d7; border: none; border-radius: 5px; color: white; cursor: pointer;">
                        Показать доступные сети
                    </button>
                </div>
            </div>
        `,
        'updates': `
            <h2 style="color: white; margin-bottom: 20px;">Центр обновления Windows</h2>
            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px;">
                <h3 style="color: white; margin-bottom: 15px;">Обновления</h3>
                <div style="color: #ccc; margin-bottom: 20px;">
                    <div style="margin-bottom: 10px;"><i class="fas fa-check-circle" style="color: #28a745;"></i> Вы используете последнюю версию Windows 12</div>
                    <div>Последняя проверка: сегодня</div>
                </div>
                <button onclick="checkUpdates()" style="padding: 10px 20px; background: #0078d7; border: none; border-radius: 5px; color: white; cursor: pointer;">
                    <i class="fas fa-sync-alt"></i> Проверить обновления
                </button>
            </div>
        `
    };
    
    function loadSettingsSection(section) {
        const contentArea = document.getElementById('settings-content');
        if (contentArea) {
            contentArea.innerHTML = settingsSections[section] || '';
            
            // Обновляем списки приложений
            if (section === 'apps') {
                updateInstalledAppsList();
            }
            if (section === 'games') {
                updateInstalledGamesList();
            }
        }
    }
    
    // Навигация по разделам
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.settings-nav-item').forEach(i => {
                i.style.background = 'transparent';
                i.style.color = '#ccc';
            });
            this.style.background = '#0078d7';
            this.style.color = 'white';
            loadSettingsSection(this.dataset.section);
        });
    });
    
    loadSettingsSection('system');
}

// Функция удаления приложения
function uninstallApp(appId) {
    installedApps = installedApps.filter(app => app.id !== appId);
    localStorage.setItem('installedApps', JSON.stringify(installedApps));
    
    // Удаляем иконку с рабочего стола
    const icon = document.querySelector(`.desktop-icon[data-app="${appId}"]`);
    if (icon) icon.remove();
    
    showNotification('Приложение удалено', 'Параметры');
    
    // Обновляем списки
    updateInstalledAppsList();
    updateInstalledGamesList();
}

// Обновление списка установленных приложений
function updateInstalledAppsList() {
    const list = document.getElementById('installed-apps-list');
    if (!list) return;
    
    if (installedApps.length === 0) {
        list.innerHTML = '<p>Нет установленных приложений</p>';
    } else {
        list.innerHTML = installedApps.map(app => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #333; margin-bottom: 5px; border-radius: 5px;">
                <span>${app.name}</span>
                <button onclick="uninstallApp('${app.id}')" style="padding: 5px 10px; background: #dc3545; border: none; border-radius: 3px; color: white; cursor: pointer;">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        `).join('');
    }
}

// Обновление списка установленных игр
function updateInstalledGamesList() {
    const list = document.getElementById('installed-games-list');
    if (!list) return;
    
    const games = installedApps.filter(app => app.category === 'games');
    
    if (games.length === 0) {
        list.innerHTML = '<p>Нет установленных игр. Установите игры из Microsoft Store!</p>';
    } else {
        list.innerHTML = games.map(app => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #333; margin-bottom: 5px; border-radius: 5px;">
                <span>🎮 ${app.name}</span>
                <button onclick="uninstallApp('${app.id}')" style="padding: 5px 10px; background: #dc3545; border: none; border-radius: 3px; color: white; cursor: pointer;">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        `).join('');
    }
}

// Функция проверки обновлений
function checkUpdates() {
    const contentArea = document.getElementById('settings-content');
    if (contentArea) {
        contentArea.innerHTML = `
            <h2 style="color: white; margin-bottom: 20px;">Центр обновления Windows</h2>
            <div style="background: #2d2d2d; padding: 20px; border-radius: 8px;">
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 48px; color: #0078d7; margin-bottom: 20px;"></i>
                    <p style="color: white;">Проверка обновлений...</p>
                </div>
            </div>
        `;
        
        setTimeout(() => {
            contentArea.innerHTML = `
                <h2 style="color: white; margin-bottom: 20px;">Центр обновления Windows</h2>
                <div style="background: #2d2d2d; padding: 20px; border-radius: 8px;">
                    <h3 style="color: white; margin-bottom: 15px;">Обновления</h3>
                    <div style="color: #ccc; margin-bottom: 20px;">
                        <div style="margin-bottom: 10px;"><i class="fas fa-check-circle" style="color: #28a745;"></i> Вы используете последнюю версию Windows 12</div>
                        <div>Последняя проверка: только что</div>
                    </div>
                    <button onclick="checkUpdates()" style="padding: 10px 20px; background: #0078d7; border: none; border-radius: 5px; color: white; cursor: pointer;">
                        <i class="fas fa-sync-alt"></i> Проверить обновления
                    </button>
                </div>
            `;
        }, 2000);
    }
}

// Функция смены обоев
function changeWallpaper(theme) {
    const wallpaper = document.querySelector('.wallpaper');
    if (!wallpaper) return;
    
    switch(theme) {
        case 'default':
            wallpaper.style.background = 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, rgba(255, 255, 255, 0) 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, rgba(255, 255, 255, 0) 50%)';
            break;
        case 'green':
            wallpaper.style.background = 'radial-gradient(circle at 20% 50%, rgba(34, 139, 34, 0.3) 0%, rgba(255, 255, 255, 0) 50%), radial-gradient(circle at 80% 20%, rgba(50, 205, 50, 0.3) 0%, rgba(255, 255, 255, 0) 50%)';
            break;
        case 'red':
            wallpaper.style.background = 'radial-gradient(circle at 20% 50%, rgba(139, 0, 0, 0.3) 0%, rgba(255, 255, 255, 0) 50%), radial-gradient(circle at 80% 20%, rgba(220, 20, 60, 0.3) 0%, rgba(255, 255, 255, 0) 50%)';
            break;
        case 'blue':
            wallpaper.style.background = 'radial-gradient(circle at 20% 50%, rgba(0, 0, 139, 0.3) 0%, rgba(255, 255, 255, 0) 50%), radial-gradient(circle at 80% 20%, rgba(30, 144, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%)';
            break;
    }
    
    showNotification('Обои рабочего стола изменены', 'Персонализация');
}

function changeTheme(theme) {
    showNotification(`Тема изменена на ${theme === 'dark' ? 'темную' : 'светлую'}`, 'Персонализация');
}

// ============ ОСНОВНЫЕ ОБРАБОТЧИКИ ============

// Обработчики для иконок на рабочем столе
desktopIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const appId = icon.dataset.app;
        if (appId === 'settings') {
            openApp('settings');
            initializeSettings();
        } else if (appId === 'store') {
            openApp('store');
            initializeStore();
        } else {
            openApp(appId);
        }
    });
    
    // Контекстное меню для иконок
    icon.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e, [
            { text: 'Открыть', icon: 'fas fa-play', action: () => {
                const appId = icon.dataset.app;
                if (appId === 'settings') {
                    openApp('settings');
                    initializeSettings();
                } else if (appId === 'store') {
                    openApp('store');
                    initializeStore();
                } else {
                    openApp(appId);
                }
            }},
            { text: 'Создать ярлык', icon: 'fas fa-link', action: () => showNotification('Ярлык создан') },
            { text: 'Переименовать', icon: 'fas fa-edit', action: () => renameIcon(icon) },
            { text: 'Свойства', icon: 'fas fa-info-circle', action: () => showProperties(icon.dataset.app) }
        ]);
    });
});

// Обработчики для приложений в меню Пуск
startApps.forEach(app => {
    app.addEventListener('click', () => {
        const appId = app.dataset.app;
        if (appId === 'settings') {
            openApp('settings');
            initializeSettings();
        } else if (appId === 'store') {
            openApp('store');
            initializeStore();
        } else {
            openApp(appId);
        }
    });
});

// Открытие/закрытие меню Пуск
startButton.addEventListener('click', (e) => {
    e.stopPropagation();
    startMenu.classList.toggle('active');
});

// Закрытие меню Пуск при клике вне его
document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && e.target !== startButton) {
        startMenu.classList.remove('active');
    }
});

// Контекстное меню рабочего стола
document.getElementById('desktop').addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(e, [
        { text: 'Обновить', icon: 'fas fa-redo', action: () => showNotification('Рабочий стол обновлен') },
        { text: 'Вид', icon: 'fas fa-eye', action: () => showNotification('Настройки вида') },
        { text: 'Сортировать', icon: 'fas fa-sort', action: () => showNotification('Сортировка выполнена') },
        { text: 'Создать', icon: 'fas fa-plus', action: () => showNotification('Создание нового элемента') },
        { text: 'Разрешение экрана', icon: 'fas fa-desktop', action: () => showNotification('Настройки экрана') },
        { text: 'Персонализация', icon: 'fas fa-palette', action: () => {
            openApp('settings');
            initializeSettings();
            setTimeout(() => {
                document.querySelector('.settings-nav-item[data-section="personalization"]')?.click();
            }, 100);
        }}
    ]);
});

// Функция показа контекстного меню
function showContextMenu(e, items) {
    contextMenu.innerHTML = '';
    
    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'context-menu-item';
        menuItem.innerHTML = `<i class="${item.icon}"></i> ${item.text}`;
        menuItem.addEventListener('click', () => {
            item.action();
            hideContextMenu();
        });
        contextMenu.appendChild(menuItem);
    });
    
    contextMenu.style.left = Math.min(e.pageX, window.innerWidth - 220) + 'px';
    contextMenu.style.top = Math.min(e.pageY, window.innerHeight - 200) + 'px';
    contextMenu.style.display = 'block';
}

function hideContextMenu() {
    contextMenu.style.display = 'none';
}

document.addEventListener('click', hideContextMenu);
contextMenu.addEventListener('click', (e) => e.stopPropagation());

// Функция переименования иконки
function renameIcon(icon) {
    const oldName = icon.querySelector('span').textContent;
    const newName = prompt('Введите новое имя:', oldName);
    if (newName && newName !== oldName) {
        icon.querySelector('span').textContent = newName;
        showNotification('Иконка переименована');
    }
}

// Функция показа свойств
function showProperties(appId) {
    const appNames = {
        'notepad': 'Блокнот',
        'calculator': 'Калькулятор',
        'file-explorer': 'Проводник',
        'edge-browser': 'Microsoft Edge',
        'settings': 'Параметры',
        'store': 'Microsoft Store',
        'paint': 'Paint'
    };
    
    alert(`Свойства: ${appNames[appId] || appId}\nТип: Приложение\nРазмер: 1.2 MB\nДата создания: 01.01.2024`);
}

// Показать уведомление
function showNotification(message, title = 'Windows 12 Beta') {
    const notification = document.getElementById('notification');
    const notificationTitle = notification.querySelector('.notification-title');
    const notificationMessage = notification.querySelector('.notification-message');
    
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// ============ ИНИЦИАЛИЗАЦИЯ ПРОВОДНИКА ============
document.getElementById('explorer-back')?.addEventListener('click', goBack);
document.getElementById('explorer-forward')?.addEventListener('click', goForward);
document.getElementById('explorer-up')?.addEventListener('click', goUp);
document.getElementById('explorer-refresh')?.addEventListener('click', () => {
    loadFolder(currentFolder);
    showNotification('Папка обновлена');
});

document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
        navigateTo(item.dataset.path);
    });
});

// ============ ИНИЦИАЛИЗАЦИЯ MICROSOFT EDGE ============
document.getElementById('browser-go')?.addEventListener('click', function() {
    const browserUrl = document.getElementById('browser-url');
    if (browserUrl) navigateToUrl(browserUrl.value);
});

document.getElementById('browser-url')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        navigateToUrl(this.value);
    }
});

document.getElementById('browser-back')?.addEventListener('click', function() {
    if (browserHistoryIndex > 0) {
        browserHistoryIndex--;
        const browserUrl = document.getElementById('browser-url');
        if (browserUrl) browserUrl.value = browserHistory[browserHistoryIndex];
        navigateToUrl(browserHistory[browserHistoryIndex]);
    }
});

document.getElementById('browser-forward')?.addEventListener('click', function() {
    if (browserHistoryIndex < browserHistory.length - 1) {
        browserHistoryIndex++;
        const browserUrl = document.getElementById('browser-url');
        if (browserUrl) browserUrl.value = browserHistory[browserHistoryIndex];
        navigateToUrl(browserHistory[browserHistoryIndex]);
    }
});

document.getElementById('browser-refresh')?.addEventListener('click', function() {
    navigateToUrl(currentUrl);
});

// Поиск с новой вкладки
document.getElementById('newtab-search-btn')?.addEventListener('click', function() {
    const query = document.getElementById('newtab-search-input')?.value;
    if (query) {
        navigateToUrl('https://www.bing.com/search?q=' + encodeURIComponent(query));
    }
});

document.getElementById('newtab-search-input')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('newtab-search-btn')?.click();
    }
});

// Кнопки браузера
document.getElementById('browser-favorites')?.addEventListener('click', () => {
    if (!favorites.includes(currentUrl)) {
        favorites.push(currentUrl);
        localStorage.setItem('edgeFavorites', JSON.stringify(favorites));
        showNotification('Добавлено в избранное');
    } else {
        showNotification('Уже в избранном');
    }
});

document.getElementById('browser-menu')?.addEventListener('click', () => {
    showNotification('Меню браузера\nИзбранное: ' + favorites.length + ' сайтов');
});

// ============ НАСТРОЙКА ОКОН ============
windows.forEach(window => {
    setupWindowControls(window, window.id);
    
    // Специальная инициализация для Settings и Store
    window.querySelector('.window-header')?.addEventListener('click', function() {
        setActiveWindow(window);
        
        if (window.id === 'settings') {
            initializeSettings();
        } else if (window.id === 'store') {
            initializeStore();
        }
    });
});

// Загрузка начальной папки проводника
setTimeout(() => {
    loadFolder('computer');
}, 100);

// Загрузка установленных приложений при старте
document.addEventListener('DOMContentLoaded', function() {
    // Восстанавливаем установленные приложения
    installedApps.forEach(app => {
        if (app.category === 'games') {
            updateGamesFolder();
        }
    });
});

// Делаем функции глобально доступными
window.uninstallApp = uninstallApp;
window.checkUpdates = checkUpdates;
window.changeWallpaper = changeWallpaper;
window.changeTheme = changeTheme;
window.showNotification = showNotification;

// Показать рабочий стол
document.getElementById('show-desktop')?.addEventListener('click', function() {
    windows.forEach(window => {
        window.style.display = 'none';
    });
    startMenu.classList.remove('active');
    document.querySelectorAll('.taskbar-app').forEach(app => {
        app.classList.remove('active');
    });
});

// Поиск в меню Пуск
document.getElementById('start-search-input')?.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    document.querySelectorAll('.start-app').forEach(app => {
        const appName = app.querySelector('.start-app-name').textContent.toLowerCase();
        app.style.display = appName.includes(searchTerm) || searchTerm === '' ? 'flex' : 'none';
    });
});

// Панель задач: системный трей
document.getElementById('tray-up')?.addEventListener('click', () => showNotification('Системный трей'));
document.getElementById('tray-wifi')?.addEventListener('click', () => showNotification('Сеть Wi-Fi подключена', 'Сеть'));
document.getElementById('tray-volume')?.addEventListener('click', () => showNotification('Громкость: 65%', 'Звук'));
document.getElementById('tray-battery')?.addEventListener('click', () => showNotification('Батарея: 85%', 'Питание'));
document.getElementById('taskbar-time')?.addEventListener('click', () => showNotification(new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), 'Календарь'));
document.getElementById('user-profile')?.addEventListener('click', () => showNotification('Профиль пользователя', 'Учетная запись'));

// Рекомендуемые элементы в меню Пуск
document.querySelectorAll('.recommended-item').forEach(item => {
    item.addEventListener('click', function() {
        const action = this.dataset.action;
        if (action) openApp(action);
    });
});

console.log('Windows 12 Beta запущена успешно!');
console.log('Функции:');
console.log('- Проводник с навигацией по папкам');
console.log('- Microsoft Edge с навигацией');
console.log('- Параметры системы');
console.log('- Microsoft Store с установкой игр и приложений');
console.log('- Игры можно найти в Store и запустить из папки Games');
