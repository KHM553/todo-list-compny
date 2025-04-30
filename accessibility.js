document.addEventListener('DOMContentLoaded', function() {
    // إضافة قائمة إمكانية الوصول إلى الصفحة
    const accessibilityMenuHTML = `
        <div class="a11y-menu-container">
            <button class="a11y-toggle-btn" id="a11y-toggle" aria-label="قائمة إمكانية الوصول">
                <i class="fas fa-universal-access"></i>
            </button>
            <div class="a11y-menu" id="a11y-menu">
                <div class="a11y-menu-header">
                    <h3 class="a11y-menu-title">قائمة إمكانية الوصول</h3>
                    <button class="a11y-close-btn" id="a11y-close" aria-label="إغلاق القائمة">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="a11y-section">
                    <h4 class="a11y-section-title">تعديلات المحتوى</h4>
                    
                    <!-- تعديل حجم الخط -->
                    <div class="a11y-option">
                        <div class="a11y-option-header">
                            <span class="a11y-option-icon"><i class="fas fa-text-height"></i></span>
                            <span class="a11y-option-title">تعديل حجم الخط</span>
                        </div>
                        <div class="a11y-font-size-control">
                            <button class="a11y-size-decrease" id="a11y-font-decrease" aria-label="تصغير الخط">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="a11y-size-value" id="a11y-font-size-value">100%</span>
                            <button class="a11y-size-increase" id="a11y-font-increase" aria-label="تكبير الخط">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- خيارات إضافية -->
                    <div class="a11y-options-grid">
                        <!-- خط القراءة -->
                        <div class="a11y-grid-option" id="a11y-reading-font" tabindex="0">
                            <div class="a11y-grid-icon">
                                <i class="fas fa-font"></i>
                            </div>
                            <div class="a11y-grid-text">
                                <span>خط القراءة</span>
                                <span class="a11y-grid-subtext">لمن يعانون من عسر القراءة</span>
                            </div>
                        </div>
                        
                        <!-- مؤشر التركيز -->
                        <div class="a11y-grid-option" id="a11y-focus-indicator" tabindex="0">
                            <div class="a11y-grid-icon">
                                <i class="fas fa-mouse-pointer"></i>
                            </div>
                            <div class="a11y-grid-text">
                                <span>مؤشر التركيز</span>
                                <span class="a11y-grid-subtext">تحديد العنصر النشط</span>
                            </div>
                        </div>
                        
                        <!-- إيقاف الرسوم المتحركة -->
                        <div class="a11y-grid-option" id="a11y-stop-animations" tabindex="0">
                            <div class="a11y-grid-icon">
                                <i class="fas fa-ban"></i>
                            </div>
                            <div class="a11y-grid-text">
                                <span>إيقاف الرسوم</span>
                                <span class="a11y-grid-subtext">إيقاف الحركة</span>
                            </div>
                        </div>
                        
                        <!-- دليل القراءة -->
                        <div class="a11y-grid-option" id="a11y-reading-guide" tabindex="0">
                            <div class="a11y-grid-icon">
                                <i class="fas fa-book-reader"></i>
                            </div>
                            <div class="a11y-grid-text">
                                <span>دليل القراءة</span>
                                <span class="a11y-grid-subtext">مساعدة للقراءة</span>
                            </div>
                        </div>
                        
                        <!-- سماكة الخط -->
                        <div class="a11y-grid-option" id="a11y-font-weight" tabindex="0">
                            <div class="a11y-grid-icon">
                                <i class="fas fa-bold"></i>
                            </div>
                            <div class="a11y-grid-text">
                                <span>سماكة الخط</span>
                            </div>
                        </div>
                        
                        <!-- ارتفاع السطر -->
                        <div class="a11y-grid-option" id="a11y-line-height" tabindex="0">
                            <div class="a11y-grid-icon">
                                <i class="fas fa-arrows-alt-v"></i>
                            </div>
                            <div class="a11y-grid-text">
                                <span>ارتفاع السطر</span>
                            </div>
                        </div>
                        
                        <!-- تباعد الحروف -->
                        <div class="a11y-grid-option" id="a11y-letter-spacing" tabindex="0">
                            <div class="a11y-grid-icon">
                                <i class="fas fa-text-width"></i>
                            </div>
                            <div class="a11y-grid-text">
                                <span>تباعد الحروف</span>
                            </div>
                        </div>
                        
                        <!-- إيقاف الرسوم المتحركة -->
                        <div class="a11y-grid-option" id="a11y-sound-links" tabindex="0">
                            <div class="a11y-grid-icon">
                                <i class="fas fa-volume-up"></i>
                            </div>
                            <div class="a11y-grid-text">
                                <span>صوت للروابط</span>
                                <span class="a11y-grid-subtext">تنبيه صوتي</span>
                            </div>
                        </div>
                        
                        <!-- تنبيه صوتي للعناوين -->
                        <div class="a11y-grid-option" id="a11y-sound-headers" tabindex="0">
                            <div class="a11y-grid-icon">
                                <i class="fas fa-heading"></i>
                            </div>
                            <div class="a11y-grid-text">
                                <span>صوت للعناوين</span>
                                <span class="a11y-grid-subtext">تنبيه صوتي</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- تعديلات الألوان -->
                <div class="a11y-section">
                    <h4 class="a11y-section-title">تعديلات الألوان</h4>
                    <div class="a11y-color-options">
                        <button class="a11y-color-option" id="a11y-color-contrast" aria-label="وضع التباين العالي">
                            <div class="a11y-color-icon">
                                <i class="fas fa-adjust"></i>
                            </div>
                            <span class="a11y-color-label">تباين عالي</span>
                        </button>
                        <button class="a11y-color-option" id="a11y-color-light" aria-label="الوضع الفاتح">
                            <div class="a11y-color-icon">
                                <i class="fas fa-sun"></i>
                            </div>
                            <span class="a11y-color-label">وضع فاتح</span>
                        </button>
                        <button class="a11y-color-option" id="a11y-color-dark" aria-label="الوضع الداكن">
                            <div class="a11y-color-icon">
                                <i class="fas fa-moon"></i>
                            </div>
                            <span class="a11y-color-label">وضع داكن</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // إضافة القائمة إلى نهاية الصفحة
    document.body.insertAdjacentHTML('beforeend', accessibilityMenuHTML);
    
    // إضافة تأثير ظهور للقائمة
    setTimeout(() => {
        document.querySelector('.a11y-menu-container').classList.add('loaded');
    }, 500);
    
    // الحصول على العناصر
    const toggleButton = document.getElementById('a11y-toggle');
    const closeButton = document.getElementById('a11y-close');
    const menu = document.getElementById('a11y-menu');
    const fontIncreaseBtn = document.getElementById('a11y-font-increase');
    const fontDecreaseBtn = document.getElementById('a11y-font-decrease');
    const fontSizeValue = document.getElementById('a11y-font-size-value');
    const readingFontBtn = document.getElementById('a11y-reading-font');
    const fontWeightBtn = document.getElementById('a11y-font-weight');
    const lineHeightBtn = document.getElementById('a11y-line-height');
    const letterSpacingBtn = document.getElementById('a11y-letter-spacing');
    const colorContrastBtn = document.getElementById('a11y-color-contrast');
    const colorLightBtn = document.getElementById('a11y-color-light');
    const colorDarkBtn = document.getElementById('a11y-color-dark');
    
    // الميزات الجديدة
    const focusIndicatorBtn = document.getElementById('a11y-focus-indicator');
    const stopAnimationsBtn = document.getElementById('a11y-stop-animations');
    const readingGuideBtn = document.getElementById('a11y-reading-guide');
    const linksSoundBtn = document.getElementById('a11y-sound-links');
    const headersSoundBtn = document.getElementById('a11y-sound-headers');
    
    // متغيرات لحفظ الإعدادات
    let currentFontSize = 100; // النسبة المئوية لحجم الخط
    const fontSizeStep = 10; // مقدار التغيير في كل نقرة
    const fontSizeMin = 80; // الحد الأدنى لحجم الخط
    const fontSizeMax = 200; // الحد الأقصى لحجم الخط
    let isReadingFontActive = false;
    let isFontWeightActive = false;
    let isLineHeightActive = false;
    let isLetterSpacingActive = false;
    let isLinksSoundActive = false;
    let isHeadersSoundActive = false;
    let currentColorMode = 'light'; // light, dark, contrast
    
    // متغيرات للميزات الجديدة
    let isFocusIndicatorActive = false;
    let isStopAnimationsActive = false;
    let isReadingGuideActive = false;
    let readingGuideElement = null;
    
    // استعادة الإعدادات المحفوظة
    function loadSettings() {
        if (localStorage.getItem('a11y-font-size')) {
            currentFontSize = parseInt(localStorage.getItem('a11y-font-size'));
            updateFontSize();
        }
        
        if (localStorage.getItem('a11y-reading-font') === 'true') {
            isReadingFontActive = true;
            readingFontBtn.classList.add('active');
            document.body.classList.add('reading-font');
        }
        
        if (localStorage.getItem('a11y-links-sound') === 'true') {
            isLinksSoundActive = true;
            linksSoundBtn.classList.add('active');
            document.body.classList.add('links-sound');
        }
        
        if (localStorage.getItem('a11y-headers-sound') === 'true') {
            isHeadersSoundActive = true;
            headersSoundBtn.classList.add('active');
            document.body.classList.add('headers-sound');
        }
        
        if (localStorage.getItem('a11y-font-weight') === 'true') {
            isFontWeightActive = true;
            fontWeightBtn.classList.add('active');
            document.body.classList.add('bold-font');
        }
        
        if (localStorage.getItem('a11y-line-height') === 'true') {
            isLineHeightActive = true;
            lineHeightBtn.classList.add('active');
            document.body.classList.add('increased-line-height');
        }
        
        if (localStorage.getItem('a11y-letter-spacing') === 'true') {
            isLetterSpacingActive = true;
            letterSpacingBtn.classList.add('active');
            document.body.classList.add('increased-letter-spacing');
        }
        
        if (localStorage.getItem('a11y-focus-indicator') === 'true') {
            isFocusIndicatorActive = true;
            focusIndicatorBtn.classList.add('active');
            document.body.classList.add('focus-indicator');
        }
        
        if (localStorage.getItem('a11y-stop-animations') === 'true') {
            isStopAnimationsActive = true;
            stopAnimationsBtn.classList.add('active');
            document.body.classList.add('stop-animations');
        }
        
        if (localStorage.getItem('a11y-reading-guide') === 'true') {
            isReadingGuideActive = true;
            readingGuideBtn.classList.add('active');
            activateReadingGuide();
        }
        
        if (localStorage.getItem('a11y-color-mode')) {
            currentColorMode = localStorage.getItem('a11y-color-mode');
            applyColorMode(currentColorMode);
        }
    }
    
    // حفظ الإعدادات
    function saveSettings() {
        localStorage.setItem('a11y-font-size', currentFontSize);
        localStorage.setItem('a11y-reading-font', isReadingFontActive);
        localStorage.setItem('a11y-links-sound', isLinksSoundActive);
        localStorage.setItem('a11y-headers-sound', isHeadersSoundActive);
        localStorage.setItem('a11y-font-weight', isFontWeightActive);
        localStorage.setItem('a11y-line-height', isLineHeightActive);
        localStorage.setItem('a11y-letter-spacing', isLetterSpacingActive);
        localStorage.setItem('a11y-focus-indicator', isFocusIndicatorActive);
        localStorage.setItem('a11y-stop-animations', isStopAnimationsActive);
        localStorage.setItem('a11y-reading-guide', isReadingGuideActive);
        localStorage.setItem('a11y-color-mode', currentColorMode);
    }
    
    // تحديث حجم الخط
    function updateFontSize() {
        document.documentElement.style.fontSize = `${currentFontSize}%`;
        fontSizeValue.textContent = `${currentFontSize}%`;
    }
    
    // تطبيق وضع الألوان
    function applyColorMode(mode) {
        // إزالة جميع أوضاع الألوان السابقة
        document.body.classList.remove('high-contrast', 'dark-mode');
        
        // تطبيق الوضع الجديد
        switch(mode) {
            case 'contrast':
                document.body.classList.add('high-contrast');
                // تحديث localStorage للتزامن مع الواجهة الرئيسية
                localStorage.setItem('dark-mode', 'false');
                break;
            case 'dark':
                document.body.classList.add('dark-mode');
                // تحديث localStorage للتزامن مع الواجهة الرئيسية
                localStorage.setItem('dark-mode', 'true');
                break;
            case 'light':
                // تحديث localStorage للتزامن مع الواجهة الرئيسية
                localStorage.setItem('dark-mode', 'false');
                break;
        }
        
        currentColorMode = mode;
    }
    
    // تبديل حالة الخيار
    function toggleOption(button, isActive, className) {
        if (isActive) {
            button.classList.remove('active');
            document.body.classList.remove(className);
        } else {
            button.classList.add('active');
            document.body.classList.add(className);
        }
        
        return !isActive;
    }
    
    // تفعيل دليل القراءة
    function activateReadingGuide() {
        if (!readingGuideElement) {
            readingGuideElement = document.createElement('div');
            readingGuideElement.className = 'a11y-reading-guide-bar';
            document.body.appendChild(readingGuideElement);
            
            document.addEventListener('mousemove', function(e) {
                if (isReadingGuideActive) {
                    readingGuideElement.style.top = (e.clientY - 10) + 'px';
                }
            });
        }
        
        readingGuideElement.style.display = isReadingGuideActive ? 'block' : 'none';
    }
    
    // إيقاف الرسوم المتحركة
    function toggleAnimations() {
        const animations = document.querySelectorAll('*');
        if (isStopAnimationsActive) {
            animations.forEach(element => {
                if (window.getComputedStyle(element).animationName !== 'none') {
                    element.style.animation = 'none';
                    element.style.transition = 'none';
                }
            });
        } else {
            animations.forEach(element => {
                element.style.animation = '';
                element.style.transition = '';
            });
        }
    }
    
    // فتح/إغلاق القائمة
    toggleButton.addEventListener('click', function() {
        menu.classList.toggle('active');
        if (menu.classList.contains('active')) {
            toggleButton.setAttribute('aria-expanded', 'true');
        } else {
            toggleButton.setAttribute('aria-expanded', 'false');
        }
    });
    
    closeButton.addEventListener('click', function() {
        menu.classList.remove('active');
        toggleButton.setAttribute('aria-expanded', 'false');
    });
    
    // زيادة حجم الخط
    fontIncreaseBtn.addEventListener('click', function() {
        if (currentFontSize < fontSizeMax) {
            currentFontSize += fontSizeStep;
            updateFontSize();
            saveSettings();
        }
    });
    
    // تقليل حجم الخط
    fontDecreaseBtn.addEventListener('click', function() {
        if (currentFontSize > fontSizeMin) {
            currentFontSize -= fontSizeStep;
            updateFontSize();
            saveSettings();
        }
    });
    
    // خط القراءة
    readingFontBtn.addEventListener('click', function() {
        isReadingFontActive = toggleOption(this, isReadingFontActive, 'reading-font');
        saveSettings();
    });
    
    // تنسيق الصوت على الروابط
    linksSoundBtn.addEventListener('click', function() {
        isLinksSoundActive = toggleOption(this, isLinksSoundActive, 'links-sound');
        saveSettings();
    });
    
    // تنسيق الصوت على العناوين
    headersSoundBtn.addEventListener('click', function() {
        isHeadersSoundActive = toggleOption(this, isHeadersSoundActive, 'headers-sound');
        saveSettings();
    });
    
    // مؤشر التركيز
    focusIndicatorBtn.addEventListener('click', function() {
        isFocusIndicatorActive = toggleOption(this, isFocusIndicatorActive, 'focus-indicator');
        saveSettings();
    });
    
    // إيقاف الرسوم المتحركة
    stopAnimationsBtn.addEventListener('click', function() {
        isStopAnimationsActive = toggleOption(this, isStopAnimationsActive, 'stop-animations');
        toggleAnimations();
        saveSettings();
    });
    
    // دليل القراءة
    readingGuideBtn.addEventListener('click', function() {
        isReadingGuideActive = toggleOption(this, isReadingGuideActive, 'reading-guide');
        activateReadingGuide();
        saveSettings();
    });
    
    // سماكة الخط
    fontWeightBtn.addEventListener('click', function() {
        isFontWeightActive = toggleOption(this, isFontWeightActive, 'bold-font');
        saveSettings();
    });
    
    // ارتفاع السطر
    lineHeightBtn.addEventListener('click', function() {
        isLineHeightActive = toggleOption(this, isLineHeightActive, 'increased-line-height');
        saveSettings();
    });
    
    // تباعد الحروف
    letterSpacingBtn.addEventListener('click', function() {
        isLetterSpacingActive = toggleOption(this, isLetterSpacingActive, 'increased-letter-spacing');
        saveSettings();
    });
    
    // أوضاع الألوان
    colorContrastBtn.addEventListener('click', function() {
        applyColorMode('contrast');
        saveSettings();
    });
    
    colorLightBtn.addEventListener('click', function() {
        applyColorMode('light');
        
        // تحديث زر النمط الليلي في الواجهة الرئيسية
        const themeToggleBtn = document.getElementById('theme-toggle');
        if (themeToggleBtn) {
            themeToggleBtn.querySelector('i').classList.remove('fa-sun');
            themeToggleBtn.querySelector('i').classList.add('fa-moon');
            themeToggleBtn.querySelector('span').textContent = 'النمط الليلي';
        }
        saveSettings();
    });
    
    colorDarkBtn.addEventListener('click', function() {
        applyColorMode('dark');
        
        // تحديث زر النمط الليلي في الواجهة الرئيسية
        const themeToggleBtn = document.getElementById('theme-toggle');
        if (themeToggleBtn) {
            themeToggleBtn.querySelector('i').classList.remove('fa-moon');
            themeToggleBtn.querySelector('i').classList.add('fa-sun');
            themeToggleBtn.querySelector('span').textContent = 'النمط النهاري';
        }
        
        // حفظ الإعداد في localStorage للتزامن مع الواجهة الرئيسية
        localStorage.setItem('dark-mode', 'true');
        saveSettings();
    });
    
    // دعم لوحة المفاتيح
    document.addEventListener('keydown', function(e) {
        // فتح/إغلاق القائمة باستخدام Alt+A
        if (e.altKey && e.key === 'a') {
            e.preventDefault();
            menu.classList.toggle('active');
            if (menu.classList.contains('active')) {
                toggleButton.setAttribute('aria-expanded', 'true');
            } else {
                toggleButton.setAttribute('aria-expanded', 'false');
            }
        }
        
        // إغلاق القائمة باستخدام Escape
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            menu.classList.remove('active');
            toggleButton.setAttribute('aria-expanded', 'false');
        }
    });
    
    // تحميل الإعدادات المحفوظة عند بدء التشغيل
    loadSettings();
    
    // تفعيل الميزات عند التحميل
    if (isStopAnimationsActive) {
        toggleAnimations();
    }
    
    if (isReadingGuideActive) {
        activateReadingGuide();
    }
    
    // إضافة أصوات للروابط والعناوين
    if (isLinksSoundActive || isHeadersSoundActive) {
        document.addEventListener('mouseover', function(e) {
            if (isLinksSoundActive && e.target.tagName === 'A') {
                // يمكن إضافة صوت هنا باستخدام Web Audio API
                console.log('تم التحويم على رابط');
            }
            
            if (isHeadersSoundActive && ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(e.target.tagName)) {
                // يمكن إضافة صوت هنا باستخدام Web Audio API
                console.log('تم التحويم على عنوان');
            }
        });
    }
});