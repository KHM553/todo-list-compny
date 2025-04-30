// استيراد وظائف قاعدة البيانات
import { initDatabase, fetchTasks, addTaskToDatabase, updateTaskInDatabase, deleteTaskFromDatabase, syncTasks } from './database.js';

// تحديث متغير المهام ليقرأ من localStorage ثم مزامنته مع قاعدة البيانات
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// تهيئة قاعدة البيانات ومزامنة المهام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // تهيئة قاعدة البيانات
        await initDatabase();
        
        // مزامنة المهام المحلية مع قاعدة البيانات
        tasks = await syncTasks(tasks);
        
        // تحديث واجهة المستخدم
        renderTasks();
        updateStats();
    } catch (error) {
        console.error('خطأ في تهيئة قاعدة البيانات:', error);
    }
});


const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const tasksCounter = document.getElementById('tasks-counter');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clear-completed');
const desktopAppBtn = document.getElementById('desktop-app');

// تم إزالة وظيفة النمط الليلي
const themeToggleBtn = document.getElementById('theme-toggle');

// إعادة ضبط زر النمط الليلي
if (themeToggleBtn) {
    // إزالة النمط الليلي إذا كان مفعلاً
    document.body.classList.remove('dark-mode');
    
    // إعادة ضبط أيقونة ونص الزر
    themeToggleBtn.querySelector('i').classList.remove('fa-sun');
    themeToggleBtn.querySelector('i').classList.add('fa-moon');
    themeToggleBtn.querySelector('span').textContent = 'النمط الليلي';
    
    // إزالة الإعداد من localStorage
    localStorage.removeItem('dark-mode');
    
    // تعطيل وظيفة زر النمط الليلي
    themeToggleBtn.style.display = 'none';
}

const ITEMS_PER_PAGE = 9;
let currentPage = 1;

// تحديث وظيفة حفظ المهام
async function saveTasks() {
    // حفظ في التخزين المحلي
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    // تحديث واجهة المستخدم
    requestAnimationFrame(() => {
        updateTasksCounter();
        updateStats();
        updateDateFilter();
        updateRecentTasks();
    });
}

// تحديث عداد المهام
function updateTasksCounter() {
    const remainingTasks = tasks.filter(task => !task.completed).length;
    tasksCounter.textContent = `${remainingTasks} مهام متبقية`;
}

// تحسين وظيفة تحديث الإحصائيات
function updateDashboardStats() {
    const stats = {
        total: tasks.length,
        completed: tasks.filter(task => task.completed).length,
        active: tasks.filter(task => !task.completed).length
    };
    
    requestAnimationFrame(() => {
        // تحديث الإحصائيات
        document.getElementById('total-tasks').textContent = stats.total;
        document.getElementById('active-tasks').textContent = stats.active;
        document.getElementById('completed-tasks').textContent = stats.completed;
        
        // تحديث شريط التقدم
        const completionRate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
        document.getElementById('completion-rate').style.width = `${completionRate}%`;
        document.getElementById('progress-percent').textContent = `${completionRate}%`;
        
        // تحديث القوائم
        updateActivityList();
        updateCurrentTasks();
    });
}

// إضافة وظيفة تحديث قائمة النشاطات
function updateActivityList() {
    const activityList = document.querySelector('.activity-list');
    const recentActivities = tasks.slice(-5).reverse();
    
    if (activityList) {
        activityList.innerHTML = recentActivities.map(task => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="${task.completed ? 'fas fa-check' : 'fas fa-clock'}"></i>
                </div>
                <div class="activity-text">${task.text}</div>
                <div class="activity-time">
                    ${new Date(task.date).toLocaleDateString('ar-SA')}
                </div>
            </div>
        `).join('');
    }
}

// تحسين وظيفة تحديث المهام الحالية
function updateCurrentTasks() {
    const tasksOverview = document.querySelector('.tasks-overview');
    const allTasks = [...tasks].reverse();
    
    const oldCurrentTasks = tasksOverview?.querySelector('.current-tasks');
    if (oldCurrentTasks) {
        oldCurrentTasks.remove();
    }
    
    if (tasksOverview) {
        const currentTasksList = document.createElement('div');
        currentTasksList.className = 'current-tasks';
        currentTasksList.innerHTML = `
            <div class="tasks-header">
                <h2>جميع المهام</h2>
                <span class="tasks-count">${allTasks.length} مهمة</span>
            </div>
            <div class="tasks-list dashboard-tasks">
                ${allTasks.map(task => `
                    <div class="task-item ${task.completed ? 'completed' : 'active'}">
                        <div class="task-content">
                            <div class="task-main">
                                <div class="task-status">
                                    <i class="${task.completed ? 'fas fa-check-circle' : 'fas fa-clock'}"></i>
                                </div>
                                <span class="task-text">${task.text}</span>
                            </div>
                            <div class="task-info">
                                <span class="task-date">
                                    <i class="far fa-calendar-alt"></i>
                                    ${formatDate(task.date)}
                                </span>
                                <span class="task-badge ${task.completed ? 'completed' : 'active'}">
                                    ${task.completed ? 'مكتملة' : 'قيد التنفيذ'}
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        tasksOverview.appendChild(currentTasksList);
    }
}

// استبدال updateStats القديمة
function updateStats() {
    updateDashboardStats();
}

// تحسين وظيفة إضافة المهمة
async function addTask(text) {
    if (!text.trim()) return;
    
    const task = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        date: new Date().toISOString(),
        completedDate: null,
        lastModified: new Date().toISOString()
    };
    
    // إضافة المهمة للمصفوفة
    tasks.unshift(task);
    
    // تحديث الواجهة بشكل فوري
    requestAnimationFrame(() => {
        const taskHTML = createTaskElement(task);
        taskList.insertAdjacentHTML('afterbegin', taskHTML);
        const newTaskElement = taskList.firstElementChild;
        addTaskListeners(newTaskElement);
        
        // حفظ في localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // تحديث الإحصائيات
        updateStats();
        updateDateFilter();
        updateRecentTasks();
    });
    
    // إضافة المهمة إلى قاعدة البيانات
    try {
        await addTaskToDatabase(task);
    } catch (error) {
        console.error('خطأ في إضافة المهمة إلى قاعدة البيانات:', error);
    }
}

// إضافة وظيفة إنشاء عنصر المهمة
function createTaskElement(task) {
    return `
        <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <span class="task-date">
                    <i class="far fa-calendar-alt"></i>
                    ${formatDate(task.date)}
                </span>
            </div>
            <div class="task-actions">
                <button class="edit-btn" title="تعديل">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" title="حذف">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

// إضافة وظيفة مستمعات الأحداث للمهمة
function addTaskListeners(taskElement) {
    const id = Number(taskElement.dataset.id);
    const checkbox = taskElement.querySelector('.task-checkbox');
    const deleteBtn = taskElement.querySelector('.delete-btn');
    const editBtn = taskElement.querySelector('.edit-btn');
    
    checkbox?.addEventListener('change', () => toggleTask(id));
    deleteBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteTask(id);
    });
    editBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        editTask(id);
    });
}

// تحسين وظيفة حذف المهمة
async function deleteTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    if (!taskElement) return;

    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'confirm-dialog';
    confirmDialog.innerHTML = `
        <div class="confirm-content">
            <h3>تأكيد الحذف</h3>
            <p>هل أنت متأكد من حذف هذه المهمة؟</p>
            <div class="confirm-buttons">
                <button class="confirm-yes">نعم</button>
                <button class="confirm-no">لا</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmDialog);

    try {
        const confirmed = await new Promise((resolve) => {
            confirmDialog.querySelector('.confirm-yes').onclick = () => resolve(true);
            confirmDialog.querySelector('.confirm-no').onclick = () => resolve(false);
        });

        if (confirmed) {
            // إزالة العنصر من الواجهة فوراً
            taskElement.style.opacity = '0';
            setTimeout(() => {
                taskElement.remove();
                
                // تحديث المصفوفة و localStorage
                tasks = tasks.filter(task => task.id !== id);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                
                // تحديث الإحصائيات
                requestAnimationFrame(() => {
                    updateStats();
                    updateDateFilter();
                    updateRecentTasks();
                });
                
                // حذف المهمة من قاعدة البيانات
                try {
                    deleteTaskFromDatabase(id);
                } catch (error) {
                    console.error('خطأ في حذف المهمة من قاعدة البيانات:', error);
                }
            }, 300);
        }
    } finally {
        document.body.removeChild(confirmDialog);
    }
}

// تحديث معالج النموذج
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        addTask(text);
        taskInput.value = '';
        taskInput.focus();
    }
});

// تحديث وظيفة تحميل المهام
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTasks();
        updateStats();
        updateDateFilter();
    }
}

// تحديث وظيفة تبديل حالة المهمة
async function toggleTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return;

    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    tasks[taskIndex].completedDate = tasks[taskIndex].completed ? new Date().toISOString() : null;
    tasks[taskIndex].lastModified = new Date().toISOString();

    saveTasks();
    renderTasks();
    updateHistoryView();
    
    // تحديث المهمة في قاعدة البيانات
    try {
        await updateTaskInDatabase(tasks[taskIndex]);
    } catch (error) {
        console.error('خطأ في تحديث حالة المهمة في قاعدة البيانات:', error);
    }
}

// إضافة وظيفة تعديل المهمة
async function editTask(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return;

    // إنشاء نافذة منبثقة للتعديل
    const editDialog = document.createElement('div');
    editDialog.className = 'confirm-dialog';
    editDialog.innerHTML = `
        <div class="confirm-content">
            <h3>تعديل المهمة</h3>
            <input type="text" id="edit-task-input" value="${tasks[taskIndex].text}" class="edit-task-input">
            <div class="confirm-buttons">
                <button class="confirm-yes">حفظ</button>
                <button class="confirm-no">إلغاء</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(editDialog);
    const editInput = document.getElementById('edit-task-input');
    editInput.focus();
    editInput.select();

    try {
        const result = await new Promise((resolve) => {
            const saveBtn = editDialog.querySelector('.confirm-yes');
            const cancelBtn = editDialog.querySelector('.confirm-no');
            
            saveBtn.onclick = () => {
                const newText = editInput.value.trim();
                if (newText) {
                    resolve({ confirmed: true, text: newText });
                } else {
                    editInput.focus();
                }
            };
            
            cancelBtn.onclick = () => resolve({ confirmed: false });
            
            // إضافة إمكانية الحفظ بالضغط على Enter
            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const newText = editInput.value.trim();
                    if (newText) {
                        resolve({ confirmed: true, text: newText });
                    }
                }
            });
        });

        if (result.confirmed && result.text) {
            // تحديث المهمة
            tasks[taskIndex].text = result.text;
            tasks[taskIndex].lastModified = new Date().toISOString();
            
            // تحديث العنصر في واجهة المستخدم مباشرة
            const taskElement = document.querySelector(`[data-id="${id}"]`);
            if (taskElement) {
                const taskTextElement = taskElement.querySelector('.task-text');
                if (taskTextElement) {
                    taskTextElement.textContent = result.text;
                }
            }
            
            // حفظ التغييرات
            saveTasks();
            renderTasks();
            
            // تحديث المهمة في قاعدة البيانات
            try {
                await updateTaskInDatabase(tasks[taskIndex]);
            } catch (error) {
                console.error('خطأ في تحديث المهمة في قاعدة البيانات:', error);
            }
        }
    } finally {
        document.body.removeChild(editDialog);
    }
}

// تحسين وظيفة تحديث المهام
async function renderTasks(filter = 'all') {
    if (!taskList) return;

    // محاولة جلب المهام من قاعدة البيانات إذا كانت المصفوفة فارغة
    if (tasks.length === 0) {
        try {
            const dbTasks = await fetchTasks();
            if (dbTasks && dbTasks.length > 0) {
                tasks = dbTasks;
            }
        } catch (error) {
            console.error('خطأ في جلب المهام من قاعدة البيانات:', error);
        }
    }

    requestAnimationFrame(() => {
        let filteredTasks = [...tasks];
        if (filter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        taskList.innerHTML = filteredTasks.map(task => createTaskElement(task)).join('');
        addTaskEventListeners();
    });
}

// إضافة وظيفة مستمعي الأحداث للمهام
function addTaskEventListeners() {
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        const checkbox = item.querySelector('.task-checkbox');
        const deleteBtn = item.querySelector('.delete-btn');
        const editBtn = item.querySelector('.edit-btn');
        const id = Number(item.dataset.id);

        if (checkbox) {
            checkbox.addEventListener('change', () => toggleTask(id));
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(id);
            });
        }

        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                editTask(id);
            });
        }
    });
}

// تم إزالة وظيفة تصدير المهام لأنها لم تعد مطلوبة

// وظيفة تحديث قائمة التواريخ
function updateDateFilter() {
    const dateFilter = document.getElementById('date-filter');
    const dates = [...new Set(tasks
        .filter(task => task.completed)
        .map(task => task.completedDate?.split('T')[0])
        .filter(Boolean)
    )].sort().reverse();

    dateFilter.innerHTML = `
        <option value="">اختر التاريخ</option>
        ${dates.map(date => `
            <option value="${date}">${new Date(date).toLocaleDateString('ar-SA')}</option>
        `).join('')}
    `;
}

// تحديث وظيفة formatDate لتوحيد تنسيق التاريخ
function formatDate(date, includeTime = false) {
    if (!date) return '';
    const dateObj = new Date(date);
    const dateStr = dateObj.toLocaleDateString('ar', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    
    if (includeTime) {
        const timeStr = dateObj.toLocaleTimeString('ar', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${dateStr} ${timeStr}`;
    }
    
    return dateStr;
}

// وظيفة عرض المهام السابقة
function renderHistoryTasks(selectedDate = '') {
    const historyGroups = document.querySelector('.history-groups');
    let filteredTasks = [...tasks];

    // تصفية حسب التاريخ
    if (selectedDate) {
        const selectedDateStart = new Date(selectedDate);
        selectedDateStart.setHours(0, 0, 0, 0);
        const selectedDateEnd = new Date(selectedDate);
        selectedDateEnd.setHours(23, 59, 59, 999);

        filteredTasks = filteredTasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate >= selectedDateStart && taskDate <= selectedDateEnd;
        });
    }

    // تصفية حسب الحالة
    const status = document.getElementById('status-filter').value;
    if (status !== 'all') {
        filteredTasks = filteredTasks.filter(task => 
            status === 'completed' ? task.completed : !task.completed
        );
    }

    // تجميع المهام حسب التاريخ
    const groupedTasks = filteredTasks.reduce((groups, task) => {
        const date = task.date.split('T')[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(task);
        return groups;
    }, {});

    const sortedDates = Object.keys(groupedTasks).sort().reverse();

    if (sortedDates.length === 0) {
        historyGroups.innerHTML = '<div class="empty-state">لا توجد مهام في هذا التاريخ</div>';
        return;
    }

    historyGroups.innerHTML = sortedDates.map(date => `
        <div class="history-group">
            <div class="history-group-header">
                <span class="history-group-date">${formatDate(date)}</span>
                <span class="history-group-count">${groupedTasks[date].length} مهام</span>
            </div>
            <div class="history-tasks">
                ${groupedTasks[date].map(task => `
                    <div class="history-task-item ${task.completed ? 'completed' : ''}"
                         data-id="${task.id}">
                        <span class="history-task-time">
                            ${new Date(task.date).toLocaleTimeString('ar', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                        <span class="history-task-text">${task.text}</span>
                        <span class="history-task-status ${task.completed ? 'completed' : 'active'}">
                            ${task.completed ? 'مكتملة' : 'قيد التنفيذ'}
                        </span>
                        <div class="task-actions">
                            <button class="edit-btn" data-id="${task.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn" data-id="${task.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    // إضافة مستمعي الأحداث لأزرار التعديل والحذف في المهام السابقة
    addHistoryTaskEventListeners();
}

// تحديث عرض التاريخ المحدد
function updateSelectedDate(date) {
    const selectedDateEl = document.getElementById('selected-date');
    if (date) {
        selectedDateEl.textContent = formatDate(date);
    } else {
        selectedDateEl.textContent = 'اختر التاريخ';
    }
}

// إضافة مستمع لتغيير نوع التقويم
document.getElementById('calendar-type').addEventListener('change', (e) => {
    const datePicker = document.getElementById('date-picker');
    const selectedDate = datePicker.value;
    if (selectedDate) {
        updateSelectedDate(selectedDate);
    }
});

// إضافة مستمع الحدث للتقويم
document.getElementById('date-picker').addEventListener('change', (e) => {
    const selectedDate = e.target.value;
    updateSelectedDate(selectedDate);
    renderHistoryTasks(selectedDate);
});

// إضافة مستمع الحدث لزر التقويم
document.querySelector('.calendar-btn').addEventListener('click', () => {
    document.getElementById('date-picker').showPicker();
});

document.getElementById('status-filter').addEventListener('change', () => {
    const selectedDate = document.getElementById('date-picker').value;
    renderHistoryTasks(selectedDate);
});

// إضافة وظيفة التنقل بين الأقسام
function switchView(viewId) {
    requestAnimationFrame(() => {
        document.querySelectorAll('.view').forEach(view => {
            view.style.display = 'none';
        });
        document.querySelectorAll('.modern-nav-btn').forEach(link => {
            link.classList.remove('active');
        });
        
        const targetView = document.getElementById(`${viewId}-view`);
        const targetLink = document.querySelector(`[data-view="${viewId}"]`);
        
        if (targetView && targetLink) {
            targetView.style.display = 'block';
            targetLink.classList.add('active');
            
            // تحديث فوري للقسم المحدد
            switch(viewId) {
                case 'dashboard':
                    updateDashboardStats();
                    break;
                case 'tasks':
                    renderTasks();
                    break;
                case 'history':
                    renderHistoryTasks();
                    break;
            }
        }
    });
}

// إضافة مستمعي الأحداث للتنقل
document.querySelectorAll('.modern-nav-btn').forEach(link => {
    link.addEventListener('click', () => {
        switchView(link.dataset.view);
    });
});

// إضافة وظيفة تحديث المهام الأخيرة في لوحة التحكم
function updateRecentTasks() {
    const recentTasksList = document.querySelector('.recent-tasks-list');
    const recentTasks = tasks.slice(-5).reverse();
    
    recentTasksList.innerHTML = recentTasks.map(task => `
        <div class="recent-task-item ${task.completed ? 'completed' : ''}">
            <span class="task-text">${task.text}</span>
            <span class="task-date">${new Date(task.date).toLocaleDateString('ar-SA')}</span>
        </div>
    `).join('');
}

// إضافة وظيفة تحديث عرض التاريخ
function updateHistoryView() {
    const historyView = document.getElementById('history-view');
    if (historyView && historyView.style.display !== 'none') {
        renderHistoryTasks();
    }
}

// إضافة وظيفة مستمعي الأحداث للمهام السابقة
function addHistoryTaskEventListeners() {
    // إضافة مستمعي الأحداث لأزرار التعديل
    const editButtons = document.querySelectorAll('.history-tasks .edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = Number(button.getAttribute('data-id'));
            editTask(id);
        });
    });
    
    // إضافة مستمعي الأحداث لأزرار الحذف
    const deleteButtons = document.querySelectorAll('.history-tasks .delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = Number(button.getAttribute('data-id'));
            deleteTask(id);
        });
    });
}

// معالجة النماذج والأحداث
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        await addTask(text);
        taskInput.value = '';
        switchView('tasks'); // التأكد من عرض قسم المهام اليومية
    }
});

// حذف معالجات الأحداث القديمة للمهام
taskList.removeEventListener('click', null);

filterBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        renderTasks(e.target.dataset.filter);
    });
});

clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
    saveTasks();
});

// تحديث مستمعي الأحداث
document.querySelector('[data-filter="history"]').addEventListener('click', () => {
    document.querySelector('.tasks-container').style.display = 'none';
    document.querySelector('.history-dashboard').style.display = 'block';
    currentPage = 1;
    renderHistoryTasks('', 'all', currentPage);
});

document.getElementById('date-filter').addEventListener('change', (e) => {
    currentPage = 1;
    renderHistoryTasks(
        e.target.value,
        document.getElementById('status-filter').value,
        currentPage
    );
});

document.getElementById('status-filter').addEventListener('change', (e) => {
    currentPage = 1;
    renderHistoryTasks(
        document.getElementById('date-filter').value,
        e.target.value,
        currentPage
    );
});

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderHistoryTasks(
            document.getElementById('date-filter').value,
            document.getElementById('status-filter').value,
            currentPage
        );
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    currentPage++;
    renderHistoryTasks(
        document.getElementById('date-filter').value,
        document.getElementById('status-filter').value,
        currentPage
    );
});

// تم إزالة حدث النقر لزر التصدير

// إضافة وظائف تغيير حجم القائمة
function initNavResizer() {
    const nav = document.querySelector('.main-nav');
    const resizer = document.querySelector('.nav-resizer');
    let isResizing = false;

    function startResize(e) {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        resizer.classList.add('resizing');
    }

    function resize(e) {
        if (!isResizing) return;

        // حساب العرض الجديد نسبة لموقع المؤشر
        const containerRect = nav.parentElement.getBoundingClientRect();
        const newWidth = Math.min(300, Math.max(80, containerRect.right - e.clientX));
        
        nav.style.width = `${newWidth}px`;
        localStorage.setItem('navWidth', newWidth);
    }

    function stopResize() {
        isResizing = false;
        document.body.style.cursor = '';
        resizer.classList.remove('resizing');
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }

    // استرجاع الحجم المحفوظ
    const savedWidth = localStorage.getItem('navWidth');
    if (savedWidth) {
        const width = parseInt(savedWidth);
        if (width >= 80 && width <= 300) {
            nav.style.width = `${width}px`;
        }
    }

    resizer.addEventListener('mousedown', startResize);
}

// تحديث وظيفة تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    Promise.resolve().then(async () => {
        // تحميل المهام من localStorage
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }

        // تحديث جميع العناصر فوراً
        requestAnimationFrame(() => {
            // تحديث لوحة التحكم
            updateDashboardStats();
            
            // تحديث قائمة المهام
            renderTasks();
            
            // تحديث المؤشرات الأخرى
            updateTasksCounter();
            updateDateFilter();
            updateRecentTasks();
            
            // تهيئة المكونات
            initNavResizer();
            
            // إظهار القسم النشط
            const activeView = document.querySelector('.nav-link.active').dataset.view;
            switchView(activeView);
        });
    });
});

// إضافة السنة الحالية في حقوق النشر
document.getElementById('current-year').textContent = new Date().getFullYear();

// إضافة تأثير دوران للختم عند التمرير
let lastScrollTop = 0;
const copyrightStamp = document.querySelector('.copyright-stamp');

// إضافة تأثير حركة للختم عند التمرير
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (copyrightStamp) {
        // تغيير زاوية دوران الختم بناءً على مقدار التمرير بشكل أقل حدة
        const rotation = Math.min(Math.max(-2, (scrollTop / 300) * -1), 0);
        copyrightStamp.style.transform = `rotate(${rotation}deg)`;
    }
    
    // تحديث آخر موضع تمرير
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});
//});

// أضف هذه الأنماط إلى ملف CSS
const style = document.createElement('style');
style.textContent = `
    .dashboard-tasks {
        max-height: 400px;
        overflow-y: auto;
        padding-right: 10px;
    }

    .dashboard-tasks::-webkit-scrollbar {
        width: 8px;
    }

    .dashboard-tasks::-webkit-scrollbar-track {
        background: var(--bg-color);
        border-radius: 4px;
    }

    .dashboard-tasks::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 4px;
    }

    .dashboard-tasks .task-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        margin-bottom: 10px;
        background: var(--bg-color);
        border-radius: 12px;
        transition: all 0.3s ease;
    }

    .dashboard-tasks .task-item:hover {
        transform: translateX(-5px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .dashboard-tasks .task-status {
        color: var(--primary-color);
        font-size: 1.2em;
    }

    .dashboard-tasks .task-content {
        flex: 1;
    }

    .dashboard-tasks .task-date {
        display: block;
        font-size: 0.8em;
        color: var(--text-secondary);
        margin-top: 5px;
    }

    .dashboard-tasks .task-badge {
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 0.8em;
        font-weight: 600;
    }

    .dashboard-tasks .task-badge.completed {
        background: var(--primary-light);
        color: var(--primary-color);
    }

    .dashboard-tasks .task-badge.active {
        background: #fff8e7;
        color: #ffa500;
    }

    .dashboard-tasks .task-item.completed .task-text {
        text-decoration: line-through;
        color: var(--text-secondary);
    }

    .tasks-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }

    .tasks-header h2 {
        font-size: 1.5rem;
        color: var(--text-primary);
    }

    .tasks-count {
        background: var(--primary-light);
        color: var(--primary-color);
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 600;
    }

    .dashboard-tasks {
        max-height: 500px;
        overflow-y: auto;
        padding: 10px;
        background: var(--bg-color);
        border-radius: 16px;
    }

    .dashboard-tasks .task-item {
        background: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }

    .dashboard-tasks .task-item:hover {
        transform: translateX(-5px);
        border-color: var(--primary-color);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .task-main {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
    }

    .task-status {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
    }

    .task-item.active .task-status {
        background: #fff8e7;
        color: #ffa500;
    }

    .task-item.completed .task-status {
        background: var(--primary-light);
        color: var(--primary-color);
    }

    .task-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--border-color);
    }

    .task-date {
        color: var(--text-secondary);
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .task-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .task-badge.active {
        background: #fff8e7;
        color: #ffa500;
    }

    .task-badge.completed {
        background: var(--primary-light);
        color: var(--primary-color);
    }

    .dashboard-tasks .task-item.completed .task-text {
        text-decoration: line-through;
        color: var(--text-secondary);
    }

    .tasks-overview {
        display: grid;
        grid-template-columns: 1fr;
        gap: 30px;
    }

    @media (min-width: 1024px) {
        .tasks-overview {
            grid-template-columns: 1fr 1fr;
        }
    }
`;
document.head.appendChild(style);
