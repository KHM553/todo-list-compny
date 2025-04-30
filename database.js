// ملف قاعدة البيانات Supabase

// استيراد مكتبة Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// معلومات الاتصال بقاعدة البيانات
const supabaseUrl = 'https://oxtbiidyhsomyubkiyta.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dGJpaWR5aHNvbXl1YmtpeXRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NzAzNzIsImV4cCI6MjA2MTQ0NjM3Mn0.PAL2JeX1XFezawffaC4uhxHs6ZmN5sVk4P_ibMvU4AI';

// معلومات الاتصال المباشر بقاعدة البيانات PostgreSQL
const postgresConnection = 'postgresql://postgres:[YOUR-PASSWORD]@db.oxtbiidyhsomyubkiyta.supabase.co:5432/postgres';

// ملاحظة: استبدل [YOUR-PASSWORD] بكلمة المرور الخاصة بك عند استخدام الاتصال المباشر

// إنشاء عميل Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// الحصول على عنوان IP الخاص بالمستخدم
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('خطأ في الحصول على عنوان IP:', error.message);
        // في حالة الفشل، نستخدم معرف فريد محلي
        return localStorage.getItem('user_device_id') || generateDeviceId();
    }
}

// إنشاء معرف فريد للجهاز في حالة عدم القدرة على الحصول على عنوان IP
function generateDeviceId() {
    const deviceId = 'device_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('user_device_id', deviceId);
    return deviceId;
}

// تخزين عنوان IP في متغير عام
let userIP = '';

// إنشاء جدول المهام إذا لم يكن موجودًا
async function initDatabase() {
    try {
        // الحصول على عنوان IP
        userIP = await getUserIP();
        console.log('عنوان IP الخاص بالمستخدم:', userIP);
        
        // التحقق من وجود جدول المهام
        const { data, error } = await supabase
            .from('tasks')
            .select('id')
            .limit(1);

        if (error) {
            console.log('جاري إنشاء جدول المهام...');
            // يمكن إضافة كود لإنشاء الجدول هنا إذا كان لديك صلاحيات SQL
        } else {
            console.log('تم الاتصال بقاعدة البيانات بنجاح');
        }

        return true;
    } catch (error) {
        console.error('خطأ في الاتصال بقاعدة البيانات:', error.message);
        return false;
    }
}

// جلب جميع المهام الخاصة بالمستخدم الحالي
async function fetchTasks() {
    try {
        // التأكد من وجود عنوان IP
        if (!userIP) {
            userIP = await getUserIP();
        }
        
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_ip', userIP) // فلترة المهام حسب عنوان IP
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('خطأ في جلب المهام:', error.message);
        // في حالة الخطأ، نعيد المهام من التخزين المحلي كنسخة احتياطية
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }
}

// إضافة مهمة جديدة
async function addTaskToDatabase(task) {
    try {
        // التأكد من وجود عنوان IP
        if (!userIP) {
            userIP = await getUserIP();
        }
        
        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                id: task.id,
                text: task.text,
                completed: task.completed,
                created_at: new Date(task.date).toISOString(),
                completed_at: task.completedDate,
                last_modified: new Date(task.lastModified).toISOString(),
                user_ip: userIP // إضافة عنوان IP للمهمة
            }]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('خطأ في إضافة المهمة:', error.message);
        return false;
    }
}

// تحديث مهمة
async function updateTaskInDatabase(task) {
    try {
        // التأكد من وجود عنوان IP
        if (!userIP) {
            userIP = await getUserIP();
        }
        
        const { data, error } = await supabase
            .from('tasks')
            .update({
                text: task.text,
                completed: task.completed,
                completed_at: task.completed ? new Date().toISOString() : null,
                last_modified: new Date().toISOString()
            })
            .eq('id', task.id)
            .eq('user_ip', userIP); // التأكد من تحديث المهام الخاصة بالمستخدم فقط

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('خطأ في تحديث المهمة:', error.message);
        return false;
    }
}

// حذف مهمة
async function deleteTaskFromDatabase(taskId) {
    try {
        // التأكد من وجود عنوان IP
        if (!userIP) {
            userIP = await getUserIP();
        }
        
        const { data, error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId)
            .eq('user_ip', userIP); // التأكد من حذف المهام الخاصة بالمستخدم فقط

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('خطأ في حذف المهمة:', error.message);
        return false;
    }
}

// مزامنة المهام المحلية مع قاعدة البيانات
async function syncTasks(localTasks) {
    try {
        // التأكد من وجود عنوان IP
        if (!userIP) {
            userIP = await getUserIP();
        }
        
        // جلب المهام من قاعدة البيانات
        const dbTasks = await fetchTasks();
        
        // إذا لم تكن هناك مهام محلية، نعيد مهام قاعدة البيانات
        if (!localTasks || localTasks.length === 0) {
            return dbTasks;
        }
        
        // إذا لم تكن هناك مهام في قاعدة البيانات، نقوم برفع المهام المحلية
        if (dbTasks.length === 0 && localTasks.length > 0) {
            for (const task of localTasks) {
                await addTaskToDatabase(task);
            }
            return localTasks;
        }
        
        // دمج المهام المحلية مع مهام قاعدة البيانات
        const mergedTasks = [...dbTasks];
        const dbTaskIds = dbTasks.map(task => task.id);
        
        for (const localTask of localTasks) {
            if (!dbTaskIds.includes(localTask.id)) {
                await addTaskToDatabase(localTask);
                mergedTasks.push(localTask);
            }
        }
        
        return mergedTasks;
    } catch (error) {
        console.error('خطأ في مزامنة المهام:', error.message);
        return localTasks;
    }
}

// تصدير الوظائف
export {
    supabase,
    initDatabase,
    fetchTasks,
    addTaskToDatabase,
    updateTaskInDatabase,
    deleteTaskFromDatabase,
    syncTasks,
    postgresConnection,
    getUserIP
};