/**
 * ملف التوتوريال - يستخدم مكتبة Intro.js لإنشاء دليل تفاعلي للمستخدم
 */

// تهيئة التوتوريال عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // التأكد من تحميل جميع العناصر قبل إضافة زر التوتوريال
    setTimeout(() => {
        // إضافة زر التوتوريال إلى الصفحة
        addTutorialButton();
        
        // إضافة مستمع لزر التوتوريال
        const tutorialBtn = document.getElementById('start-tutorial');
        if (tutorialBtn) {
            tutorialBtn.addEventListener('click', startTutorial);
        } else {
            console.warn('لم يتم العثور على زر التوتوريال');
        }
        
        // التحقق من بدء التوتوريال تلقائياً للمستخدمين الجدد
        checkAutoStartTutorial();
    }, 1000);
});

/**
 * إضافة زر التوتوريال إلى الصفحة
 */
function addTutorialButton() {
    // التحقق من عدم وجود الزر مسبقاً لتجنب التكرار
    if (document.getElementById('start-tutorial')) {
        return;
    }
    
    const header = document.querySelector('.modern-nav');
    if (header) {
        const tutorialBtn = document.createElement('button');
        tutorialBtn.id = 'start-tutorial';
        tutorialBtn.className = 'modern-nav-btn tutorial-btn';
        tutorialBtn.setAttribute('title', 'عرض دليل استخدام التطبيق');
        tutorialBtn.innerHTML = `
            <i class="fas fa-question-circle"></i>
            <span>دليل الاستخدام ✨</span>
        `;
        header.appendChild(tutorialBtn);
        console.log('تم إضافة زر دليل الاستخدام بنجاح');
    } else {
        console.warn('لم يتم العثور على عنصر القائمة لإضافة زر التوتوريال');
    }
}

/**
 * بدء التوتوريال
 */
function startTutorial() {
    const intro = introJs();
    
    // تجهيز خطوات التوتوريال مع التحقق من وجود العناصر
    const tutorialSteps = [];
    
    // الخطوة 1: الترحيب
    const headerBrand = document.querySelector('.header-brand');
    if (headerBrand) {
        tutorialSteps.push({
            element: headerBrand,
            intro: '👋 مرحبًا بك في مُحكم! هذا دليل سريع لمساعدتك على استخدام التطبيق.',
            position: 'bottom'
        });
    }
    
    // الخطوة 2: لوحة التحكم
    const dashboardBtn = document.querySelector('[data-view="dashboard"]');
    if (dashboardBtn) {
        tutorialSteps.push({
            element: dashboardBtn,
            intro: '📊 هذا هو زر لوحة التحكم، يمكنك من خلاله عرض إحصائيات المهام والنشاطات الأخيرة.',
            position: 'bottom'
        });
    }
    
    // الخطوة 3: المهام اليومية
    const tasksBtn = document.querySelector('[data-view="tasks"]');
    if (tasksBtn) {
        tutorialSteps.push({
            element: tasksBtn,
            intro: '✅ انقر هنا للوصول إلى المهام اليومية وإدارتها.',
            position: 'bottom'
        });
    }
    
    // الخطوة 4: المهام السابقة
    const historyBtn = document.querySelector('[data-view="history"]');
    if (historyBtn) {
        tutorialSteps.push({
            element: historyBtn,
            intro: '🕒 يمكنك الوصول إلى سجل المهام السابقة من هنا.',
            position: 'bottom'
        });
    }
    
    // الخطوة 5: تبديل النمط
    const themeToggle = document.querySelector('#theme-toggle');
    if (themeToggle) {
        tutorialSteps.push({
            element: themeToggle,
            intro: '🌓 يمكنك تبديل النمط بين الوضع الليلي والنهاري من هنا.',
            position: 'bottom'
        });
    }
    
    // الخطوة 6: إحصائيات المهام
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        tutorialSteps.push({
            element: statsContainer,
            intro: '📈 هنا يمكنك رؤية إحصائيات المهام الخاصة بك.',
            position: 'top'
        });
    }
    
    // الخطوة 7: إعدادات إمكانية الوصول
    const a11yToggleBtn = document.querySelector('.a11y-toggle-btn');
    if (a11yToggleBtn) {
        tutorialSteps.push({
            element: a11yToggleBtn,
            intro: '♿ يمكنك الوصول إلى إعدادات إمكانية الوصول من هذا الزر لتخصيص تجربة المستخدم.',
            position: 'left'
        });
    }
    
    // الخطوة 8: نموذج إضافة المهام
    const taskForm = document.querySelector('#task-form');
    if (taskForm) {
        tutorialSteps.push({
            element: taskForm,
            intro: '➕ استخدم هذا النموذج لإضافة مهام جديدة.',
            position: 'top'
        });
    }
    
    // تخصيص الخطوات
    intro.setOptions({
        nextLabel: 'التالي ⏭️',
        prevLabel: 'السابق ⏮️',
        skipLabel: 'تخطي ⏹️',
        doneLabel: 'إنهاء ✅',
        hidePrev: true,
        hideNext: false,
        tooltipClass: 'customTooltip',
        highlightClass: 'customHighlight',
        steps: tutorialSteps
    });

    // تخصيص السلوك
    intro.onbeforechange(function(targetElement) {
        // التحقق من وجود العنصر المستهدف
        if (!targetElement) {
            console.warn('العنصر المستهدف غير موجود في الخطوة الحالية');
            return;
        }
        
        try {
            // التأكد من أن العنصر مرئي قبل عرض الخطوة
            const view = targetElement.closest('.view');
            if (view && view.style.display === 'none') {
                // إذا كان العنصر في قسم غير مرئي، قم بتبديل العرض إلى ذلك القسم
                const viewId = view.id;
                const navBtn = document.querySelector(`[data-view="${viewId.replace('-view', '')}"]`);
                if (navBtn) {
                    navBtn.click();
                }
            }
            
            // التأكد من أن العنصر مرئي في نافذة العرض
            if (targetElement.scrollIntoView) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } catch (error) {
            console.error('حدث خطأ أثناء تغيير الخطوة:', error);
        }
    });

    intro.onexit(function() {
        // يمكن إضافة إجراءات عند الخروج من التوتوريال
        console.log('تم إنهاء التوتوريال');
    });

    intro.oncomplete(function() {
        // إجراءات عند إكمال التوتوريال
        console.log('تم إكمال التوتوريال');
        
        // تخزين حالة في localStorage لعدم إظهار التوتوريال مرة أخرى
        localStorage.setItem('tutorialCompleted', 'true');
        
        // إظهار رسالة ترحيبية للمستخدم بعد إكمال التوتوريال
        showWelcomeMessage();
    });
    
    // بدء التوتوريال
    intro.start();
}

/**
 * إظهار رسالة ترحيبية للمستخدم بعد إكمال التوتوريال
 */
function showWelcomeMessage() {
    // إنشاء عنصر الرسالة
    const messageDiv = document.createElement('div');
    messageDiv.className = 'welcome-message';
    messageDiv.innerHTML = `
        <div class="welcome-content">
            <h3>🎉 مرحباً بك في مُحكم!</h3>
            <p>أنت الآن جاهز لاستخدام التطبيق بكفاءة. ابدأ بإضافة مهمتك الأولى!</p>
            <button class="welcome-btn">ابدأ الآن</button>
        </div>
    `;
    
    // إضافة الرسالة إلى الصفحة
    document.body.appendChild(messageDiv);
    
    // إضافة نمط CSS للرسالة
    const style = document.createElement('style');
    style.textContent = `
        .welcome-message {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.5s ease;
        }
        
        .welcome-content {
            background: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }
        
        .welcome-content h3 {
            margin-top: 0;
            color: var(--primary-color);
        }
        
        .welcome-btn {
            background: var(--gradient-primary);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 30px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 15px;
            transition: all 0.3s ease;
        }
        
        .welcome-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // إضافة مستمع للزر
    const welcomeBtn = messageDiv.querySelector('.welcome-btn');
    welcomeBtn.addEventListener('click', function() {
        messageDiv.remove();
        style.remove();
        
        // توجيه المستخدم إلى قسم المهام
        const tasksBtn = document.querySelector('[data-view="tasks"]');
        if (tasksBtn) {
            tasksBtn.click();
        }
    });
}

/**
 * التحقق مما إذا كان يجب عرض التوتوريال تلقائيًا للمستخدمين الجدد
 */
function checkAutoStartTutorial() {
    try {
        // التحقق مما إذا كان المستخدم قد زار الموقع من قبل
        const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
        const tutorialCompleted = localStorage.getItem('tutorialCompleted');
        
        if (!hasVisitedBefore) {
            // تسجيل أول زيارة للمستخدم
            localStorage.setItem('hasVisitedBefore', 'true');
            
            // إظهار رسالة ترحيبية للمستخدمين الجدد
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'tutorial-welcome';
            welcomeMessage.innerHTML = `
                <div class="tutorial-welcome-content">
                    <h3>👋 مرحباً بك في مُحكم!</h3>
                    <p>هل ترغب في مشاهدة دليل استخدام سريع للتطبيق؟</p>
                    <div class="tutorial-welcome-buttons">
                        <button class="tutorial-welcome-btn start-btn">نعم، أرني كيفية الاستخدام</button>
                        <button class="tutorial-welcome-btn skip-btn">لا، شكراً</button>
                    </div>
                </div>
            `;
            document.body.appendChild(welcomeMessage);
            
            // إضافة أنماط CSS للرسالة الترحيبية
            const style = document.createElement('style');
            style.textContent = `
                .tutorial-welcome {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    direction: rtl;
                }
                
                .tutorial-welcome-content {
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    text-align: center;
                    max-width: 400px;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                }
                
                .tutorial-welcome-content h3 {
                    margin-top: 0;
                    color: var(--a11y-primary-dark, #00897b);
                }
                
                .tutorial-welcome-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-top: 20px;
                }
                
                .tutorial-welcome-btn {
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-family: 'Cairo', sans-serif;
                    transition: all 0.3s ease;
                }
                
                .start-btn {
                    background: var(--a11y-gradient-primary, linear-gradient(135deg, #4db6ac 0%, #00897b 100%));
                    color: white;
                    border: none;
                }
                
                .skip-btn {
                    background: transparent;
                    color: var(--a11y-text-color, #333);
                    border: 1px solid var(--a11y-border-color, #e0e0e0);
                }
                
                .tutorial-welcome-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                
                /* تخصيص للوضع الداكن */
                .dark-mode .tutorial-welcome-content {
                    background: #333;
                    color: #fff;
                }
                
                .dark-mode .skip-btn {
                    color: #eee;
                    border-color: #555;
                }
            `;
            document.head.appendChild(style);
            
            // إضافة مستمعي الأحداث للأزرار
            const startBtn = welcomeMessage.querySelector('.start-btn');
            const skipBtn = welcomeMessage.querySelector('.skip-btn');
            
            if (startBtn) {
                startBtn.addEventListener('click', function() {
                    welcomeMessage.remove();
                    style.remove();
                    // بدء التوتوريال بعد تأخير قصير
                    setTimeout(() => {
                        startTutorial();
                    }, 500);
                });
            }
            
            if (skipBtn) {
                skipBtn.addEventListener('click', function() {
                    welcomeMessage.remove();
                    style.remove();
                    // تسجيل تخطي التوتوريال
                    localStorage.setItem('tutorialSkipped', 'true');
                });
            }
        } else if (!tutorialCompleted && !localStorage.getItem('tutorialSkipped')) {
            // إذا كان المستخدم قد زار الموقع من قبل ولكن لم يكمل التوتوريال ولم يتخطاه
            // إضافة تلميح بسيط للمستخدم حول وجود دليل الاستخدام
            const tutorialBtn = document.getElementById('start-tutorial');
            if (tutorialBtn) {
                tutorialBtn.classList.add('tutorial-highlight');
                
                // إضافة نمط للتلميح
                const highlightStyle = document.createElement('style');
                highlightStyle.textContent = `
                    .tutorial-highlight {
                        animation: pulse-highlight 2s infinite;
                    }
                    
                    @keyframes pulse-highlight {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(highlightStyle);
                
                // إزالة التلميح بعد فترة
                setTimeout(() => {
                    tutorialBtn.classList.remove('tutorial-highlight');
                    highlightStyle.remove();
                }, 10000);
            }
        }
    } catch (error) {
        console.error('حدث خطأ أثناء التحقق من بدء التوتوريال تلقائيًا:', error);
    }
}