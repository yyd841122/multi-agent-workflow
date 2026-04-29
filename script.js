/**
 * Todo List - JavaScript 业务逻辑
 *
 * 功能说明：
 * - 添加任务（支持点击按钮和按 Enter 键）
 * - 删除任务
 * - 切换任务完成状态
 * - 空输入校验与视觉提示
 * - 空状态提示自动管理
 */

// ==================== 常量配置 ====================

const DOM_ELEMENTS = {
    TASK_INPUT: 'taskInput',
    ADD_BUTTON: 'addButton',
    TASK_LIST: 'taskList',
    EMPTY_STATE: 'emptyState'
};

const STYLES = {
    ERROR_BORDER: '#f44336',
    ERROR_BACKGROUND: '#ffebee',
    ERROR_DURATION: 500
};

const CSS_CLASSES = {
    DELETE_BUTTON: 'delete-button',
    COMPLETED: 'completed'
};

const KEY_CODES = {
    ENTER: 'Enter',
    ENTER_LEGACY: 13
};

// ==================== DOM 元素获取 ====================

const taskInput = document.getElementById(DOM_ELEMENTS.TASK_INPUT);
const addButton = document.getElementById(DOM_ELEMENTS.ADD_BUTTON);
const taskList = document.getElementById(DOM_ELEMENTS.TASK_LIST);
const emptyState = document.getElementById(DOM_ELEMENTS.EMPTY_STATE);

// ==================== 核心功能函数 ====================

/**
 * 更新空状态提示的显示/隐藏
 * 根据任务列表是否为空自动切换空状态提示
 */
function updateEmptyState() {
    const hasTasks = taskList.children.length > 0;
    emptyState.style.display = hasTasks ? 'none' : 'block';
}

/**
 * 显示输入错误提示
 * 通过改变输入框边框和背景色提示用户输入无效
 */
function showInputError() {
    taskInput.style.borderColor = STYLES.ERROR_BORDER;
    taskInput.style.backgroundColor = STYLES.ERROR_BACKGROUND;

    setTimeout(() => {
        taskInput.style.borderColor = '';
        taskInput.style.backgroundColor = '';
    }, STYLES.ERROR_DURATION);
}

/**
 * 清空并聚焦输入框
 * 添加任务后的标准操作流程
 */
function resetAndFocusInput() {
    taskInput.value = '';
    taskInput.focus();
}

/**
 * 创建任务列表项
 * @param {string} text - 任务文本内容
 * @returns {HTMLElement} 任务列表项元素
 */
function createTaskElement(text) {
    const li = document.createElement('li');

    // 创建任务文本
    const taskSpan = document.createElement('span');
    taskSpan.textContent = text;

    // 创建删除按钮
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '×';
    deleteButton.className = CSS_CLASSES.DELETE_BUTTON;

    // 组装任务项
    li.appendChild(taskSpan);
    li.appendChild(deleteButton);

    return li;
}

/**
 * 添加任务到列表
 * 包含输入校验、元素创建、状态更新等完整流程
 */
function addTask() {
    // 获取输入框的值（保留原始输入，包括空格）
    const taskText = taskInput.value;

    // 空输入校验：去除首尾空格后检查是否为空
    if (taskText.trim() === '') {
        showInputError();
        return;
    }

    // 创建并添加任务（使用原始输入，保留用户输入的空格）
    const taskElement = createTaskElement(taskText);
    taskList.appendChild(taskElement);

    // 重置输入框和更新空状态
    resetAndFocusInput();
    updateEmptyState();
}

/**
 * 删除指定的任务项
 * @param {HTMLElement} taskElement - 要删除的任务元素
 */
function deleteTask(taskElement) {
    taskList.removeChild(taskElement);
    updateEmptyState();
}

/**
 * 切换任务的完成状态
 * @param {HTMLElement} taskSpan - 任务文本元素
 */
function toggleTaskCompletion(taskSpan) {
    taskSpan.classList.toggle(CSS_CLASSES.COMPLETED);
}

// ==================== 事件监听器 ====================

/**
 * 添加按钮点击事件
 */
addButton.addEventListener('click', addTask);

/**
 * 输入框 Enter 键事件
 * 支持现代浏览器的 event.key 和旧版浏览器的 event.keyCode
 */
taskInput.addEventListener('keydown', (event) => {
    const isEnterKey = event.key === KEY_CODES.ENTER || event.keyCode === KEY_CODES.ENTER_LEGACY;

    if (isEnterKey) {
        event.preventDefault();
        addTask();
    }
});

/**
 * 任务列表事件委托
 * 统一处理删除按钮点击和任务文本点击
 */
taskList.addEventListener('click', (event) => {
    const target = event.target;

    // 处理删除按钮点击
    if (target.className === CSS_CLASSES.DELETE_BUTTON) {
        deleteTask(target.parentElement);
        return;
    }

    // 处理任务文本点击（切换完成状态）
    if (target.tagName === 'SPAN') {
        toggleTaskCompletion(target);
    }
});

// ==================== 初始化 ====================

/**
 * 页面加载完成后初始化空状态
 */
updateEmptyState();
