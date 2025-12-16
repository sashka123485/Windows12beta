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
let isResizing = false;
let resizeDirection = null;

// Создаем контекстное меню
const contextMenu = document.createElement('div');
contextMenu.className = 'context-menu';
contextMenu.id = 'context-menu';
document.body.appendChild(contextMenu);

// Открытие приложений
function openApp(appId) {
    const appWindow = document.getElementById(appId);
    
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
            if (appWindow.style.display === 'none') {
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
    
    // Добавляем обработчики для кнопок управления окном (если еще нет)
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
    const appId = Array.from(windowElement.parentNode.children).indexOf(windowElement);
    document.querySelectorAll('.taskbar-app').forEach(app => app.classList.remove('active'));
    const taskbarApp = document.querySelector(`.taskbar-app[data-app="${windowElement.id}"]`);
    if (taskbarApp) taskbarApp.classList.add('active');
}

// Обработчики для иконок на рабочем столе
desktopIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        openApp(icon.dataset.app);
    });
    
    // Контекстное меню для иконок
    icon.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showContextMenu(e, [
            { text: 'Открыть', icon: 'fas fa-play', action: () => openApp(icon.dataset.app) },
            { text: 'Создать ярлык', icon: 'fas fa-link', action: () => showNotification('Ярлык создан') },
            { text: 'Переименовать', icon: 'fas fa-edit', action: () => renameIcon(icon) },
            { text: 'Свойства', icon: 'fas fa-info-circle', action: () => showProperties(icon.dataset.app) }
        ]);
    });
});

// Обработчики для приложений в меню Пуск
startApps.forEach(app => {
    app.addEventListener('click', () => {
        openApp(app.dataset.app);
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
desktop.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showContextMenu(e, [
        { text: 'Обновить', icon: 'fas fa-redo', action: () => showNotification('Рабочий стол обновлен') },
        { text: 'Вид', icon: 'fas fa-eye', action: () => showNotification('Настройки вида') },
        { text: 'Сортировать', icon: 'fas fa-sort', action: () => showNotification('Сортировка выполнена') },
        { text: 'Создать', icon: 'fas fa-plus', action: () => showNotification('Создание нового элемента') },
        { text: 'Разрешение экрана', icon: 'fas fa-desktop', action: () => showNotification('Настройки экрана') },
        { text: 'Персонализация', icon: 'fas fa-palette', action: () => showNotification('Настройки персонализации') }
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
    
    contextMenu.style.left = e.pageX + 'px';
    contextMenu.style.top = e.pageY + 'px';
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
    
    alert(`Свойства: ${appNames[appId]}\nТип: Приложение\nРазмер: 1.2 MB\nДата создания: 01.01.2024`);
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

// Блокнот
const notepadTextarea = document.getElementById('notepad-textarea');
const notepadNewBtn = document.getElementById('notepad-new');
const notepadOpenBtn = document.getElementById('notepad-open');
const notepadSaveBtn = document.getElementById('notepad-save');
const notepadPrintBtn = document.getElementById('notepad-print');
const notepadHelpBtn = document.getElementById('notepad-help');

// Сохранение текста
notepadTextarea.addEventListener('input', function() {
    localStorage.setItem('notepadContent', this.value);
});

// Восстанавливаем сохраненный текст
const savedText = localStorage.getItem('notepadContent');
if (savedText) {
    notepadTextarea.value = savedText;
}

// Кнопки блокнота
notepadNewBtn.addEventListener('click', () => {
    notepadTextarea.value = '';
    showNotification('Создан новый документ');
});

notepadOpenBtn.addEventListener('click', () => {
    // В реальном приложении здесь было бы диалоговое окно выбора файла
    showNotification('Функция открытия файла');
});

notepadSaveBtn.addEventListener('click', () => {
    localStorage.setItem('notepadContent', notepadTextarea.value);
    showNotification('Документ сохранен');
});

notepadPrintBtn.addEventListener('click', () => {
    window.print();
    showNotification('Печать документа');
});

notepadHelpBtn.addEventListener('click', () => {
    alert('Блокнот Windows 12 Beta\nВерсия: 1.0\n© Microsoft Corporation');
});

// Калькулятор
let calcMemory = 0;
let calcCurrentInput = '0';
let calcPreviousInput = '';
let calcOperation = null;
let calcResetScreen = false;
let calcHistory = '';

const calcDisplay = document.getElementById('calc-input');
const calcHistoryDisplay = document.getElementById('calc-history');
const calcButtons = document.querySelectorAll('.calculator-buttons .calc-btn');
const calcModeButtons = document.querySelectorAll('.calculator-mode .mode-btn');

function updateCalcDisplay() {
    calcDisplay.textContent = calcCurrentInput;
    calcHistoryDisplay.textContent = calcHistory;
}

function inputNumber(number) {
    if (calcCurrentInput === '0' || calcResetScreen) {
        calcCurrentInput = number;
        calcResetScreen = false;
    } else {
        calcCurrentInput += number;
    }
}

function inputDecimal() {
    if (calcResetScreen) {
        calcCurrentInput = '0.';
        calcResetScreen = false;
        return;
    }
    
    if (!calcCurrentInput.includes('.')) {
        calcCurrentInput += '.';
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(calcCurrentInput);
    
    if (calcOperation && !calcResetScreen) {
        calculate();
    } else {
        calcPreviousInput = calcCurrentInput;
    }
    
    calcOperation = nextOperator;
    calcHistory = `${calcPreviousInput} ${calcOperation}`;
    calcResetScreen = true;
}

function calculate() {
    let result;
    const prevValue = parseFloat(calcPreviousInput);
    const currentValue = parseFloat(calcCurrentInput);
    
    if (isNaN(prevValue) || isNaN(currentValue)) return;
    
    switch (calcOperation) {
        case '+':
            result = prevValue + currentValue;
            break;
        case '−':
            result = prevValue - currentValue;
            break;
        case '×':
            result = prevValue * currentValue;
            break;
        case '÷':
            if (currentValue === 0) {
                showNotification('Деление на ноль невозможно', 'Ошибка калькулятора');
                return;
            }
            result = prevValue / currentValue;
            break;
        case '%':
            result = prevValue % currentValue;
            break;
        default:
            return;
    }
    
    calcCurrentInput = result.toString();
    calcHistory = `${calcPreviousInput} ${calcOperation} ${currentValue} =`;
    calcOperation = null;
    calcPreviousInput = '';
    calcResetScreen = true;
}

function clearCalculator() {
    calcCurrentInput = '0';
    calcPreviousInput = '';
    calcOperation = null;
    calcHistory = '';
}

function backspace() {
    if (calcCurrentInput.length > 1) {
        calcCurrentInput = calcCurrentInput.slice(0, -1);
    } else {
        calcCurrentInput = '0';
    }
}

calcButtons.forEach(button => {
    button.addEventListener('click', () => {
        const btnText = button.textContent;
        const action = button.dataset.action;
        const number = button.dataset.number;
        
        if (number) {
            inputNumber(number);
        } else if (action) {
            switch(action) {
                case '.':
                    inputDecimal();
                    break;
                case '+':
                case '−':
                case '×':
                case '÷':
                case '%':
                    handleOperator(action);
                    break;
                case '=':
                    calculate();
                    break;
                case 'c':
                    clearCalculator();
                    break;
                case 'ce':
                    calcCurrentInput = '0';
                    break;
                case 'backspace':
                    backspace();
                    break;
                case '±':
                    calcCurrentInput = (-parseFloat(calcCurrentInput)).toString();
                    break;
                case '1/x':
                    calcCurrentInput = (1 / parseFloat(calcCurrentInput)).toString();
                    break;
                case 'x²':
                    calcCurrentInput = (Math.pow(parseFloat(calcCurrentInput), 2)).toString();
                    break;
                case '√':
                    calcCurrentInput = (Math.sqrt(parseFloat(calcCurrentInput))).toString();
                    break;
                case 'mc':
                    calcMemory = 0;
                    showNotification('Память очищена');
                    break;
                case 'mr':
                    calcCurrentInput = calcMemory.toString();
                    break;
                case 'm+':
                    calcMemory += parseFloat(calcCurrentInput);
                    showNotification('Добавлено в память');
                    break;
                case 'm-':
                    calcMemory -= parseFloat(calcCurrentInput);
                    showNotification('Вычтено из памяти');
                    break;
                case 'ms':
                    calcMemory = parseFloat(calcCurrentInput);
                    showNotification('Сохранено в память');
                    break;
            }
        }
        
        updateCalcDisplay();
    });
});

calcModeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        calcModeButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        showNotification(`Режим: ${this.textContent}`);
    });
});

// Инициализация калькулятора
updateCalcDisplay();

// Проводник
const explorerBackBtn = document.getElementById('explorer-back');
const explorerForwardBtn = document.getElementById('explorer-forward');
const explorerUpBtn = document.getElementById('explorer-up');
const explorerRefreshBtn = document.getElementById('explorer-refresh');
const explorerSearchBtn = document.getElementById('explorer-search');
const currentPath = document.getElementById('current-path');
const filesGrid = document.getElementById('files-grid');
const sidebarItems = document.querySelectorAll('.sidebar-item');

let currentFolder = 'home';
let pathHistory = ['home'];
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
    'documents': [
        { name: 'Отчет.docx', icon: 'fas fa-file-word', type: 'document' },
        { name: 'Презентация.pptx', icon: 'fas fa-file-powerpoint', type: 'document' },
        { name: 'Таблица.xlsx', icon: 'fas fa-file-excel', type: 'document' }
    ],
    'pictures': [
        { name: 'Обои.jpg', icon: 'fas fa-image', type: 'image' },
        { name: 'Скриншот.png', icon: 'fas fa-camera', type: 'image' }
    ],
    'computer': [
        { name: 'Локальный диск (C:)', icon: 'fas fa-hdd', type: 'drive', size: '128 GB свободно из 256 GB' },
        { name: 'Диск (D:)', icon: 'fas fa-hdd', type: 'drive', size: '512 GB свободно из 1 TB' },
        { name: 'DVD-привод (E:)', icon: 'fas fa-compact-disc', type: 'drive' }
    ]
};

function loadFolder(folderName) {
    currentFolder = folderName;
    filesGrid.innerHTML = '';
    
    const folderItems = folders[folderName] || [];
    
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
            sizeInfo.className = 'file-size';
            sizeInfo.textContent = item.size;
            sizeInfo.style.color = '#888';
            sizeInfo.style.fontSize = '10px';
            sizeInfo.style.marginTop = '4px';
            fileItem.appendChild(sizeInfo);
        }
        
        fileItem.addEventListener('click', () => {
            if (item.type === 'folder' && item.path) {
                navigateTo(item.path);
            } else if (item.type === 'shortcut' && item.app) {
                openApp(item.app);
            } else {
                showNotification(`Открыт файл: ${item.name}`);
            }
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
    if (currentFolder !== 'home') {
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
        'computer': 'Этот компьютер'
    };
    
    currentPath.textContent = pathNames[currentFolder] || currentFolder;
}

function updateSidebar() {
    sidebarItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.path === currentFolder) {
            item.classList.add('active');
        }
    });
}

// Обработчики для кнопок проводника
explorerBackBtn.addEventListener('click', goBack);
explorerForwardBtn.addEventListener('click', goForward);
explorerUpBtn.addEventListener('click', goUp);
explorerRefreshBtn.addEventListener('click', () => {
    loadFolder(currentFolder);
    showNotification('Папка обновлена');
});
explorerSearchBtn.addEventListener('click', () => {
    showNotification('Функция поиска');
});

// Обработчики для боковой панели проводника
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        navigateTo(item.dataset.path);
    });
});

// Загрузка начальной папки
loadFolder('home');

// Microsoft Edge
const browserUrl = document.getElementById('browser-url');
const browserGo = document.getElementById('browser-go');
const browserBack = document.getElementById('browser-back');
const browserForward = document.getElementById('browser-forward');
const browserRefresh = document.getElementById('browser-refresh');
const browserNewTabBtn = document.getElementById('browser-new-tab');
const browserFavorites = document.getElementById('browser-favorites');
const browserDownloads = document.getElementById('browser-downloads');
const browserMenu = document.getElementById('browser-menu');
const newtabSearchInput = document.getElementById('newtab-search-input');
const newtabSearchBtn = document.getElementById('newtab-search-btn');
const browserStatusText = document.getElementById('browser-status-text');

let currentUrl = 'https://www.microsoft.com';
let browserHistory = [currentUrl];
let browserHistoryIndex = 0;

// Обработчик для кнопки "Перейти" в браузере
browserGo.addEventListener('click', function() {
    let url = browserUrl.value;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    navigateToUrl(url);
});

// Навигация по URL
function navigateToUrl(url) {
    browserStatusText.textContent = 'Загрузка...';
    currentUrl = url;
    browserUrl.value = url;
    
    // Добавляем в историю
    browserHistory = browserHistory.slice(0, browserHistoryIndex + 1);
    browserHistory.push(url);
    browserHistoryIndex++;
    
    // Имитация загрузки
    setTimeout(() => {
        browserStatusText.textContent = 'Готово';
        
        // Обновляем заголовок вкладки
        const activeTab = document.querySelector('.browser-tab.active');
        try {
            const hostname = new URL(url).hostname;
            activeTab.querySelector('span').textContent = hostname.replace('www.', '');
        } catch {
            activeTab.querySelector('span').textContent = 'Новая вкладка';
        }
    }, 1500);
}

// Обработчик для нажатия Enter в поле URL браузера
browserUrl.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        browserGo.click();
    }
});

// Обработчики для кнопок навигации в браузере
browserBack.addEventListener('click', function() {
    if (browserHistoryIndex > 0) {
        browserHistoryIndex--;
        browserUrl.value = browserHistory[browserHistoryIndex];
        navigateToUrl(browserHistory[browserHistoryIndex]);
    }
});

browserForward.addEventListener('click', function() {
    if (browserHistoryIndex < browserHistory.length - 1) {
        browserHistoryIndex++;
        browserUrl.value = browserHistory[browserHistoryIndex];
        navigateToUrl(browserHistory[browserHistoryIndex]);
    }
});

browserRefresh.addEventListener('click', function() {
    browserStatusText.textContent = 'Обновление...';
    setTimeout(() => {
        navigateToUrl(currentUrl);
    }, 1000);
});

// Обработчики для быстрых ссылок
document.querySelectorAll('.quicklink').forEach(link => {
    link.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        navigateToUrl(url);
    });
});

// Поиск с новой вкладки
newtabSearchBtn.addEventListener('click', function() {
    const query = newtabSearchInput.value;
    if (query) {
        const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
        navigateToUrl(searchUrl);
    }
});

newtabSearchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        newtabSearchBtn.click();
    }
});

// Кнопки браузера
browserFavorites.addEventListener('click', () => {
    showNotification('Добавлено в избранное');
});

browserDownloads.addEventListener('click', () => {
    showNotification('Загрузки');
});

browserMenu.addEventListener('click', () => {
    showNotification('Меню браузера');
});

// Управление вкладками
let tabCounter = 1;

browserNewTabBtn.addEventListener('click', function() {
    tabCounter++;
    const newTabId = `tab-${tabCounter}`;
    
    // Создаем новую вкладку
    const newTab = document.createElement('div');
    newTab.className = 'browser-tab';
    newTab.setAttribute('data-tab', newTabId);
    newTab.innerHTML = `
        <i class="fab fa-microsoft"></i>
        <span>Новая вкладка</span>
        <span class="browser-tab-close" data-tab="${newTabId}">
            <i class="fas fa-times"></i>
        </span>
    `;
    
    // Вставляем новую вкладку перед кнопкой добавления
    browserNewTabBtn.parentNode.insertBefore(newTab, browserNewTabBtn);
    
    // Активируем новую вкладку
    activateTab(newTabId);
    
    // Добавляем обработчик закрытия вкладки
    newTab.querySelector('.browser-tab-close').addEventListener('click', function(e) {
        e.stopPropagation();
        closeTab(newTabId);
    });
    
    // Добавляем обработчик активации вкладки
    newTab.addEventListener('click', function() {
        activateTab(newTabId);
    });
});

function activateTab(tabId) {
    // Деактивируем все вкладки
    document.querySelectorAll('.browser-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Активируем выбранную вкладку
    const activeTab = document.querySelector(`.browser-tab[data-tab="${tabId}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Сбрасываем URL для новой вкладки
    if (tabId !== '1') {
        browserUrl.value = '';
    }
}

function closeTab(tabId) {
    if (tabId === '1') {
        showNotification('Первая вкладка не может быть закрыта');
        return;
    }
    
    const tabToClose = document.querySelector(`.browser-tab[data-tab="${tabId}"]`);
    if (tabToClose) {
        tabToClose.remove();
        
        // Если закрыли активную вкладку, активируем первую
        if (tabToClose.classList.contains('active')) {
            activateTab('1');
        }
    }
}

// Обработчик закрытия вкладки для первой вкладки
document.querySelector('.browser-tab-close[data-tab="1"]').addEventListener('click', function(e) {
    e.stopPropagation();
    showNotification('Первая вкладка не может быть закрыта');
});

// Paint
const paintCanvas = document.getElementById('paint-canvas');
const paintTools = document.querySelectorAll('.paint-tool');
const paintColors = document.querySelectorAll('.color');
const paintFileBtn = document.getElementById('paint-file');
const paintHomeBtn = document.getElementById('paint-home');
const paintViewBtn = document.getElementById('paint-view');

const ctx = paintCanvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentTool = 'brush';
let currentColor = '#000000';
let lineWidth = 2;

// Инициализация холста
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);

// Инструменты Paint
paintTools.forEach(tool => {
    tool.addEventListener('click', function() {
        paintTools.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        currentTool = this.dataset.tool;
    });
});

// Цвета Paint
paintColors.forEach(color => {
    color.addEventListener('click', function() {
        paintColors.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        currentColor = this.dataset.color;
    });
});

// Рисование на холсте
paintCanvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

paintCanvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    
    ctx.beginPath();
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    switch(currentTool) {
        case 'brush':
        case 'pencil':
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];
            break;
            
        case 'line':
            // Для линии рисуем временную линию
            break;
            
        case 'rectangle':
            // Для прямоугольника рисуем временный прямоугольник
            break;
            
        case 'circle':
            // Для круга рисуем временный круг
            break;
            
        case 'eraser':
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 10;
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];
            break;
    }
});

paintCanvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

paintCanvas.addEventListener('mouseout', () => {
    isDrawing = false;
});

// Кнопки Paint
paintFileBtn.addEventListener('click', () => {
    showNotification('Меню файла Paint');
});

paintHomeBtn.addEventListener('click', () => {
    showNotification('Главное меню Paint');
});

paintViewBtn.addEventListener('click', () => {
    showNotification('Меню вида Paint');
});

// Функции выключения и перезагрузки
const shutdownScreen = document.getElementById('shutdown-screen');
const shutdownText = document.getElementById('shutdown-text');
const shutdownDialog = document.getElementById('shutdown-dialog');
const restartDialog = document.getElementById('restart-dialog');
const powerOnButton = document.getElementById('power-on-button');
const powerShutdownBtn = document.getElementById('power-shutdown');
const powerRestartBtn = document.getElementById('power-restart');

// Обработчики для кнопок выключения и перезагрузки в меню Пуск
powerShutdownBtn.addEventListener('click', function() {
    startMenu.classList.remove('active');
    shutdownDialog.style.display = 'block';
});

powerRestartBtn.addEventListener('click', function() {
    startMenu.classList.remove('active');
    restartDialog.style.display = 'block';
});

// Обработчики для диалоговых окон
document.getElementById('shutdown-cancel').addEventListener('click', function() {
    shutdownDialog.style.display = 'none';
});

document.getElementById('shutdown-confirm').addEventListener('click', function() {
    shutdownDialog.style.display = 'none';
    performShutdown();
});

document.getElementById('restart-cancel').addEventListener('click', function() {
    restartDialog.style.display = 'none';
});

document.getElementById('restart-confirm').addEventListener('click', function() {
    restartDialog.style.display = 'none';
    performRestart();
});

// Функция выключения
function performShutdown() {
    desktop.style.display = 'none';
    taskbar.style.display = 'none';
    shutdownScreen.style.display = 'flex';
    shutdownText.textContent = 'Завершение работы...';
    powerOnButton.style.display = 'none';
    
    // Имитация процесса выключения
    setTimeout(() => {
        shutdownText.textContent = 'Завершение работы Windows';
    }, 1500);
    
    setTimeout(() => {
        shutdownText.textContent = 'Завершение работы системы';
    }, 3000);
    
    setTimeout(() => {
        shutdownText.textContent = 'Компьютер можно выключить';
        powerOnButton.style.display = 'flex';
    }, 4500);
}

// Функция перезагрузки
function performRestart() {
    desktop.style.display = 'none';
    taskbar.style.display = 'none';
    shutdownScreen.style.display = 'flex';
    shutdownText.textContent = 'Перезагрузка...';
    powerOnButton.style.display = 'none';
    
    // Имитация процесса перезагрузки
    setTimeout(() => {
        shutdownText.textContent = 'Завершение работы Windows';
    }, 1500);
    
    setTimeout(() => {
        shutdownText.textContent = 'Перезагрузка системы';
    }, 3000);
    
    // Перезагрузка страницы (имитация перезагрузки системы)
    setTimeout(() => {
        location.reload();
    }, 4500);
}

// Функция включения ПК
powerOnButton.addEventListener('click', function() {
    shutdownScreen.style.display = 'none';
    bootScreen.style.display = 'flex';
    bootScreen.style.opacity = '1';
    
    // Сбрасываем прогресс загрузки
    const bootProgressBar = document.getElementById('boot-progress-bar');
    const bootText = document.getElementById('boot-text');
    const bootPercentage = document.getElementById('boot-percentage');
    
    bootProgressBar.style.width = '0%';
    bootPercentage.textContent = '0%';
    bootText.textContent = 'Подготовка к работе';
    
    // Запускаем имитацию загрузки
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
                    const notification = document.getElementById('notification');
                    notification.style.display = 'block';
                    setTimeout(() => {
                        notification.style.display = 'none';
                    }, 3000);
                }, 1000);
            }, 500);
        }
    }, 200);
});

// Показать рабочий стол при клике на правый край панели задач
document.getElementById('show-desktop').addEventListener('click', function() {
    // Скрыть все окна
    windows.forEach(window => {
        window.style.display = 'none';
    });
    
    // Скрыть меню Пуск
    startMenu.classList.remove('active');
    
    // Деактивировать кнопки в панели задач
    document.querySelectorAll('.taskbar-app').forEach(app => {
        app.classList.remove('active');
    });
});

// Поиск в меню Пуск
const startSearchInput = document.getElementById('start-search-input');
startSearchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const startApps = document.querySelectorAll('.start-app');
    
    startApps.forEach(app => {
        const appName = app.querySelector('.start-app-name').textContent.toLowerCase();
        if (appName.includes(searchTerm) || searchTerm === '') {
            app.style.display = 'flex';
        } else {
            app.style.display = 'none';
        }
    });
});

// Поиск из панели задач
document.getElementById('taskbar-search-btn').addEventListener('click', function() {
    startMenu.classList.add('active');
    startSearchInput.focus();
});

// Панель задач: системный трей
document.getElementById('tray-up').addEventListener('click', () => {
    showNotification('Системный трей');
});

document.getElementById('tray-wifi').addEventListener('click', () => {
    showNotification('Сеть Wi-Fi');
});

document.getElementById('tray-volume').addEventListener('click', () => {
    showNotification('Звук');
});

document.getElementById('tray-battery').addEventListener('click', () => {
    showNotification('Батарея');
});

// Время и дата в панели задач
document.getElementById('taskbar-time').addEventListener('click', () => {
    showNotification('Календарь и время');
});

// Профиль пользователя
document.getElementById('user-profile').addEventListener('click', () => {
    showNotification('Профиль пользователя');
});

// Рекомендуемые элементы в меню Пуск
document.querySelectorAll('.recommended-item').forEach(item => {
    item.addEventListener('click', function() {
        const action = this.dataset.action;
        if (action) {
            openApp(action);
        }
    });
});

// Настройка всех окон при загрузке
windows.forEach((window, index) => {
    setupWindowControls(window, window.id);
});

// Запуск приложений по умолчанию
setTimeout(() => {
    // Автоматически открыть проводник при загрузке
    openApp('file-explorer');
}, 500);
