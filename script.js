/**
 * AI魔幻世界杯 - 交互脚本
 * 处理按钮波纹、导航激活状态等效果
 */

(function() {
    // DOM加载完成后执行
    document.addEventListener('DOMContentLoaded', function() {
        // 设置当前页面导航激活状态
        setActiveNav();
        
        // 添加按钮波纹效果
        addButtonRipple();
        
        // 添加角旗元素到卡片
        addCornerFlags();
    });

    /**
     * 设置当前页面导航激活状态
     */
    function setActiveNav() {
        // 获取当前页面URL
        const currentUrl = window.location.href;
        const pageName = currentUrl.split('/').pop().replace('.html', '') || 'index';
        
        // 找到对应的导航链接并添加active类
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href').replace('.html', '');
            
            if (linkHref === pageName) {
                link.classList.add('active');
            }
        });
    }

    /**
     * 添加按钮波纹效果
     */
    function addButtonRipple() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // 创建波纹元素
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                
                // 获取按钮位置和尺寸
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                // 设置波纹样式
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                // 添加到按钮
                this.appendChild(ripple);
                
                // 动画结束后移除波纹
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    /**
     * 添加角旗元素到卡片
     */
    function addCornerFlags() {
        // 为所有卡片添加角旗
        const cards = document.querySelectorAll('.feature-card, .story-card, .schedule-section');
        
        cards.forEach(card => {
            const cornerFlag = document.createElement('div');
            cornerFlag.className = 'corner-flag';
            card.appendChild(cornerFlag);
        });
    }
})();
