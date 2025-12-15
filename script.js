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

// Открытие приложений
function openApp(appId) {
    const appWindow = document.getElementById(appId);
    
    // Закрываем меню Пуск при открытии приложения
    startMenu.classList.remove('active');
    
    // Показываем окно приложения
    appWindow.style.display = 'flex';
    appWindow.classList.add('active');
    
    // Добавляем приложение в панель задач, если его там еще нет
    const existingTaskbarApp = document.querySelector(`.taskbar-app[data-app="${appId}"]`);
    if (!existingTaskbarApp) {
        const taskbarApp = document.createElement('button');
        taskbarApp.className = 'taskbar-app';
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
                taskbarApp.classList.add('active');
            } else {
                appWindow.style.display = 'none';
                taskbarApp.classList.remove('active');
            }
        });
        
        taskbarApps.appendChild(taskbarApp);
    }
    
    // Добавляем обработчики для кнопок управления окном
    const closeBtn = appWindow.querySelector('.close');
    const minimizeBtn = appWindow.querySelector('.minimize');
    const maximizeBtn = appWindow.querySelector('.maximize');
    
    closeBtn.addEventListener('click', () => {
        appWindow.style.display = 'none';
        const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appId}"]`);
        if (taskbarApp) taskbarApp.remove();
    });
    
    minimizeBtn.addEventListener('click', () => {
        appWindow.style.display = 'none';
        const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appId}"]`);
        if (taskbarApp) taskbarApp.classList.remove('active');
    });
    
    maximizeBtn.addEventListener('click', () => {
        if (appWindow.style.width === '100%') {
            appWindow.style.width = '';
            appWindow.style.height = '';
            appWindow.style.top = '';
            appWindow.style.left = '';
        } else {
            appWindow.style.width = '100%';
            appWindow.style.height = 'calc(100% - 48px)';
            appWindow.style.top = '0';
            appWindow.style.left = '0';
        }
    });
    
    // Делаем окно активным при клике
    appWindow.addEventListener('mousedown', () => {
        // Перемещаем окно на передний план
        windows.forEach(win => win.style.zIndex = '10');
        appWindow.style.zIndex = '100';
        
        // Обновляем активное состояние в панели задач
        document.querySelectorAll('.taskbar-app').forEach(app => app.classList.remove('active'));
        const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appId}"]`);
        if (taskbarApp) taskbarApp.classList.add('active');
    });
    
    // Реализация перетаскивания окон
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    const header = appWindow.querySelector('.window-header');
    
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffset.x = e.clientX - appWindow.offsetLeft;
        dragOffset.y = e.clientY - appWindow.offsetTop;
        
        // Перемещаем окно на передний план
        windows.forEach(win => win.style.zIndex = '10');
        appWindow.style.zIndex = '100';
        
        // Обновляем активное состояние в панели задач
        document.querySelectorAll('.taskbar-app').forEach(app => app.classList.remove('active'));
        const taskbarApp = document.querySelector(`.taskbar-app[data-app="${appId}"]`);
        if (taskbarApp) taskbarApp.classList.add('active');
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            appWindow.style.left = (e.clientX - dragOffset.x) + 'px';
            appWindow.style.top = (e.clientY - dragOffset.y) + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// Обработчики для иконок на рабочем столе
desktopIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        openApp(icon.dataset.app);
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

// Блокнот
const notepadTextarea = document.querySelector('#notepad textarea');
notepadTextarea.addEventListener('input', function() {
    localStorage.setItem('notepadContent', this.value);
});

// Восстанавливаем сохраненный текст
const savedText = localStorage.getItem('notepadContent');
if (savedText) {
    notepadTextarea.value = savedText;
}

// Калькулятор
const calcInput = document.getElementById('calc-input');
const calcButtons = document.querySelectorAll('.calc-btn');
let currentInput = '0';
let previousInput = '';
let operation = null;
let resetScreen = false;

function updateDisplay() {
    calcInput.textContent = currentInput;
}

function inputNumber(number) {
    if (currentInput === '0' || resetScreen) {
        currentInput = number;
        resetScreen = false;
    } else {
        currentInput += number;
    }
}

function inputDecimal() {
    if (resetScreen) {
        currentInput = '0.';
        resetScreen = false;
        return;
    }
    
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);
    
    if (operation && !resetScreen) {
        calculate();
    } else {
        previousInput = currentInput;
    }
    
    operation = nextOperator;
    resetScreen = true;
}

function calculate() {
    let result;
    const prevValue = parseFloat(previousInput);
    const currentValue = parseFloat(currentInput);
    
    if (isNaN(prevValue) || isNaN(currentValue)) return;
    
    switch (operation) {
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
                alert('Деление на ноль невозможно');
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
    
    currentInput = result.toString();
    operation = null;
    previousInput = '';
    resetScreen = true;
}

function clearCalculator() {
    currentInput = '0';
    previousInput = '';
    operation = null;
}

function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
}

calcButtons.forEach(button => {
    button.addEventListener('click', () => {
        const btnText = button.textContent;
        
        if (button.classList.contains('operator')) {
            handleOperator(btnText);
        } else if (button.classList.contains('equals')) {
            calculate();
        } else if (btnText === 'C') {
            clearCalculator();
        } else if (btnText === 'CE') {
            currentInput = '0';
        } else if (btnText === '⌫') {
            backspace();
        } else if (btnText === '.') {
            inputDecimal();
        } else if (btnText === '±') {
            currentInput = (-parseFloat(currentInput)).toString();
        } else if (btnText === '1/x') {
            currentInput = (1 / parseFloat(currentInput)).toString();
        } else if (btnText === 'x²') {
            currentInput = (Math.pow(parseFloat(currentInput), 2)).toString();
        } else if (btnText === '√') {
            currentInput = (Math.sqrt(parseFloat(currentInput))).toString();
        } else {
            inputNumber(btnText);
        }
        
        updateDisplay();
    });
});

// Инициализация калькулятора
updateDisplay();

// Проводник
const explorerItems = document.querySelectorAll('.file-item, .sidebar-item');
explorerItems.forEach(item => {
    item.addEventListener('click', function() {
        // Удаляем активный класс у всех элементов
        explorerItems.forEach(el => el.classList.remove('active'));
        // Добавляем активный класс текущему элементу
        this.classList.add('active');
    });
});

// Microsoft Edge
const browserFrame = null; // В демо-версии не используем iframe
const browserUrl = document.getElementById('browser-url');
const browserGo = document.getElementById('browser-go');
const browserBack = document.getElementById('browser-back');
const browserForward = document.getElementById('browser-forward');
const browserRefresh = document.getElementById('browser-refresh');
const browserNewTab = document.getElementById('browser-new-tab');
const browserStatus = document.getElementById('browser-status');
const browserStatusText = document.getElementById('browser-status-text');

// Обработчик для кнопки "Перейти" в браузере
browserGo.addEventListener('click', function() {
    let url = browserUrl.value;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    browserStatusText.textContent = 'Загрузка...';
    
    // Имитация загрузки
    setTimeout(() => {
        browserStatusText.textContent = 'Готово';
        browserUrl.value = url;
        
        // Обновляем заголовок вкладки
        const activeTab = document.querySelector('.browser-tab.active');
        const hostname = new URL(url).hostname;
        activeTab.querySelector('span').textContent = hostname.replace('www.', '');
    }, 1500);
});

// Обработчик для нажатия Enter в поле URL браузера
browserUrl.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        browserGo.click();
    }
});

// Обработчики для кнопок навигации в браузере
browserBack.addEventListener('click', function() {
    browserStatusText.textContent = 'Назад';
    setTimeout(() => {
        browserStatusText.textContent = 'Готово';
    }, 1000);
});

browserForward.addEventListener('click', function() {
    browserStatusText.textContent = 'Вперед';
    setTimeout(() => {
        browserStatusText.textContent = 'Готово';
    }, 1000);
});

browserRefresh.addEventListener('click', function() {
    browserStatusText.textContent = 'Обновление...';
    setTimeout(() => {
        browserStatusText.textContent = 'Готово';
    }, 1500);
});

// Обработчики для быстрых ссылок
document.querySelectorAll('.quicklink').forEach(link => {
    link.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        browserUrl.value = url;
        browserGo.click();
    });
});

// Обработчики для вкладок браузера
let tabCounter = 1;

browserNewTab.addEventListener('click', function() {
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
    browserNewTab.parentNode.insertBefore(newTab, browserNewTab);
    
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
    
    // Для новой вкладки показываем страницу быстрого доступа
    browserUrl.value = '';
}

function closeTab(tabId) {
    if (tabId === '1') {
        // Нельзя закрыть первую вкладку
        browserStatusText.textContent = 'Первая вкладка не может быть закрыта';
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
    browserStatusText.textContent = 'Первая вкладка не может быть закрыта';
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
document.querySelector('.taskbar-showdesktop').addEventListener('click', function() {
    // Скрыть все окна
    windows.forEach(window => {
        window.style.display = 'none';
    });
    
    // Скрыть меню Пуск
    startMenu.classList.remove('active');
});

// Поиск в меню Пуск
const startSearchInput = document.querySelector('.start-search input');
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
