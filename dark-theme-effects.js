// تم تعطيل تأثيرات النمط الليلي

document.addEventListener('DOMContentLoaded', () => {
    // إزالة النمط الليلي إذا كان مفعلاً
    document.body.classList.remove('dark-mode');
    localStorage.removeItem('dark-mode');
    
    // إخفاء زر تبديل النمط
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.style.display = 'none';
    }
});

// تم تعطيل وظائف النمط الليلي
// لا يتم استخدام هذه الوظائف بعد الآن
/*
function initDarkModeEffects() {
    // تم تعطيل هذه الوظيفة
}

function removeDarkModeEffects() {
    // تم تعطيل هذه الوظيفة
}
*/

// إضافة تأثير توهج للعناصر المهمة
function addGlowEffects() {
    // إضافة تأثير توهج للأزرار
    const buttons = document.querySelectorAll('.modern-nav-btn, .add-btn, .filter-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseover', addButtonGlow);
        button.addEventListener('mouseout', removeButtonGlow);
    });
    
    // إضافة تأثير توهج للبطاقات
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach(card => {
        card.addEventListener('mouseover', addCardGlow);
        card.addEventListener('mouseout', removeCardGlow);
    });
}

// إزالة تأثير التوهج
function removeGlowEffects() {
    // إزالة تأثير التوهج من الأزرار
    const buttons = document.querySelectorAll('.modern-nav-btn, .add-btn, .filter-btn');
    buttons.forEach(button => {
        button.removeEventListener('mouseover', addButtonGlow);
        button.removeEventListener('mouseout', removeButtonGlow);
    });
    
    // إزالة تأثير التوهج من البطاقات
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach(card => {
        card.removeEventListener('mouseover', addCardGlow);
        card.removeEventListener('mouseout', removeCardGlow);
    });
}

// إضافة تأثير توهج للأزرار
function addButtonGlow(e) {
    if (document.body.classList.contains('dark-mode')) {
        e.target.style.boxShadow = '0 0 15px rgba(122, 226, 207, 0.5), 0 0 30px rgba(122, 226, 207, 0.3)';
        e.target.style.transform = 'translateY(-2px)';
    }
}

// إزالة تأثير التوهج من الأزرار
function removeButtonGlow(e) {
    e.target.style.boxShadow = '';
    e.target.style.transform = '';
}

// إضافة تأثير توهج للبطاقات
function addCardGlow(e) {
    if (document.body.classList.contains('dark-mode')) {
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(122, 226, 207, 0.3)';
        e.currentTarget.style.transform = 'translateY(-5px)';
        
        // تأثير توهج للأيقونة داخل البطاقة
        const icon = e.currentTarget.querySelector('i');
        if (icon) {
            icon.style.filter = 'drop-shadow(0 0 8px rgba(122, 226, 207, 0.6))';
            icon.style.transform = 'scale(1.1)';
        }
    }
}

// إزالة تأثير التوهج من البطاقات
function removeCardGlow(e) {
    e.currentTarget.style.boxShadow = '';
    e.currentTarget.style.transform = '';
    
    // إزالة تأثير التوهج من الأيقونة
    const icon = e.currentTarget.querySelector('i');
    if (icon) {
        icon.style.filter = '';
        icon.style.transform = '';
    }
}

// إنشاء جزيئات متحركة في الخلفية
function createParticles() {
    // التحقق من وجود حاوية الجزيئات
    let particlesContainer = document.getElementById('particles-container');
    
    // إذا كانت موجودة بالفعل، قم بإزالتها
    if (particlesContainer) {
        particlesContainer.remove();
    }
    
    // إنشاء حاوية جديدة للجزيئات
    particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles-container';
    particlesContainer.style.position = 'fixed';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.zIndex = '-1';
    document.body.appendChild(particlesContainer);
    
    // إنشاء الجزيئات
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

// إنشاء جزيء متحرك
function createParticle(container) {
    const particle = document.createElement('div');
    
    // تعيين خصائص الجزيء
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 3 + 1 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = 'rgba(122, 226, 207, ' + (Math.random() * 0.3 + 0.1) + ')';
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = '0 0 ' + (Math.random() * 5 + 2) + 'px rgba(122, 226, 207, 0.5)';
    
    // تعيين موقع الجزيء بشكل عشوائي
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    particle.style.left = posX + '%';
    particle.style.top = posY + '%';
    
    // إضافة حركة للجزيء
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    
    // إضافة الجزيء إلى الحاوية
    container.appendChild(particle);
    
    // إضافة تعريف الرسوم المتحركة إذا لم يكن موجودًا
    if (!document.getElementById('particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes float {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0.3;
                }
                25% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
                    opacity: 0.6;
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
                    opacity: 0.3;
                }
                75% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg);
                    opacity: 0.6;
                }
                100% {
                    transform: translate(0, 0) rotate(0deg);
                    opacity: 0.3;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// تحسين تأثيرات البطاقات
function enhanceCardEffects() {
    // إضافة تأثير انتقالي للبطاقات
    const cards = document.querySelectorAll('.stat-card, .task-item');
    cards.forEach((card, index) => {
        // تأخير ظهور البطاقات بشكل متتالي
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}