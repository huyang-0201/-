/**
 * AI魔幻世界杯 - 动态粒子背景
 * 深蓝色基调，金色和白色粒子飘浮、连接
 * 添加足球元素和国旗色粒子
 */

(function() {
    // 画布设置
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 将canvas添加到页面最底层
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-2';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    document.body.appendChild(canvas);

    // 粒子配置
    const config = {
        particleCount: 80,           // 粒子数量
        minRadius: 1,                // 最小半径
        maxRadius: 3,                // 最大半径
        minSpeed: 0.1,               // 最小移动速度
        maxSpeed: 0.4,               // 最大移动速度
        connectDistance: 150,        // 连接距离
        mouseRadius: 100,            // 鼠标吸引范围
        attractionForce: 0.05,       // 吸引力系数
        lineColor: 'rgba(255,215,0,0.2)',  // 连接线颜色
        backgroundColor: '#0a1628',  // 背景颜色（深蓝色）
        footballCount: isMobile() ? 2 : 5,  // 漂浮足球数量（移动端减少）
        flagColorRatio: 0.15         // 国旗色粒子比例
    };

    // 参赛国国旗主色调
    const flagColors = [
        '#009B3A', '#FFCC00',   // 巴西 - 绿色、黄色
        '#75AADB', '#FFFFFF',    // 阿根廷 - 浅蓝、白色
        '#0055A4', '#FFFFFF', '#CE1126', // 法国 - 蓝白红
        '#C60B1E', '#F1BF00',    // 西班牙 - 红、黄
        '#02256D', '#CE1126',    // 葡萄牙 - 蓝、红
        '#002FA7', '#FFFFFF',    // 德国 - 黑、红、金（简化为蓝白）
        '#003594', '#FFCC00',    // 意大利 - 蓝、白、红（简化为蓝黄）
        '#0066B3', '#FFFFFF',    // 英格兰 - 蓝白
        '#00A859', '#FFDF00',    // 墨西哥 - 绿白红（简化为绿黄）
        '#154734', '#FFDF00',    // 美国 - 红白蓝（简化为绿黄）
        '#009E60', '#FFD700',    // 日本 - 红白（简化为绿金）
        '#000080', '#FF0000',    // 韩国 - 红蓝
        '#007A33', '#FF8C00',    // 乌拉圭 - 蓝白（简化为绿橙）
        '#1E90FF', '#DC143C',    // 荷兰 - 橙（简化为红蓝）
        '#0066CC', '#FFFFFF'     // 克罗地亚 - 红白格（简化为蓝白）
    ];

    // 粒子数组
    let particles = [];
    // 漂浮足球数组
    let footballs = [];
    // 鼠标位置
    let mouse = { x: null, y: null, active: false };

    // 粒子类
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            // 随机位置
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            
            // 随机速度（方向和大小）
            const angle = Math.random() * Math.PI * 2;
            const speed = config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed);
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            
            // 随机半径
            this.radius = config.minRadius + Math.random() * (config.maxRadius - config.minRadius);
            
            // 随机颜色（金色、白色或国旗色）
            this.color = this.getRandomColor();
            
            // 透明度
            this.opacity = 0.3 + Math.random() * 0.7;
            
            // 拖尾数组
            this.trail = [];
            this.trailLength = 5;
        }

        // 获取随机颜色（包含国旗色）
        getRandomColor() {
            // 15%概率使用国旗色
            if (Math.random() < config.flagColorRatio) {
                return flagColors[Math.floor(Math.random() * flagColors.length)];
            }
            // 否则使用金色或白色
            return Math.random() > 0.3 ? '#ffd700' : '#ffffff';
        }

        // 更新粒子位置
        update() {
            // 保存当前位置用于拖尾
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.trailLength) {
                this.trail.shift();
            }

            // 鼠标吸引效果（仅桌面端）
            if (mouse.active && !isMobile()) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.mouseRadius) {
                    // 计算吸引力
                    const force = (config.mouseRadius - distance) / config.mouseRadius;
                    this.vx += (dx / distance) * force * config.attractionForce;
                    this.vy += (dy / distance) * force * config.attractionForce;
                }
            }

            // 更新位置
            this.x += this.vx;
            this.y += this.vy;

            // 速度衰减（避免速度过快）
            this.vx *= 0.99;
            this.vy *= 0.99;

            // 边界检测
            if (this.x < 0 || this.x > canvas.width) {
                this.vx *= -1;
                this.x = Math.max(0, Math.min(canvas.width, this.x));
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.vy *= -1;
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }
        }

        // 绘制粒子
        draw() {
            // 绘制拖尾
            this.trail.forEach((pos, index) => {
                const trailOpacity = (index / this.trail.length) * this.opacity * 0.5;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, this.radius * (index / this.trail.length), 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = trailOpacity;
                ctx.fill();
            });

            // 绘制粒子本体
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // 漂浮足球类
    class FloatingFootball {
        constructor() {
            this.reset();
        }

        reset() {
            // 随机位置
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            
            // 随机速度（方向和大小，比粒子慢）
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.05 + Math.random() * 0.15;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            
            // 大小
            this.size = isMobile() ? 15 : (20 + Math.random() * 10);
            
            // 透明度
            this.opacity = 0.2 + Math.random() * 0.2;
            
            // 旋转角度
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }

        update() {
            // 更新位置
            this.x += this.vx;
            this.y += this.vy;
            
            // 更新旋转
            this.rotation += this.rotationSpeed;

            // 边界检测（从另一边出现）
            if (this.x < -this.size) this.x = canvas.width + this.size;
            if (this.x > canvas.width + this.size) this.x = -this.size;
            if (this.y < -this.size) this.y = canvas.height + this.size;
            if (this.y > canvas.height + this.size) this.y = -this.size;
        }

        // 绘制足球
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            
            // 使用文字绘制足球
            ctx.font = `${this.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⚽', 0, 0);
            
            ctx.restore();
        }
    }

    // 检查是否为移动端
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 初始化粒子
    function initParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // 初始化漂浮足球
    function initFootballs() {
        footballs = [];
        for (let i = 0; i < config.footballCount; i++) {
            footballs.push(new FloatingFootball());
        }
    }

    // 绘制连接线
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectDistance) {
                    // 连接线透明度随距离变化
                    const opacity = (1 - distance / config.connectDistance) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255,215,0,${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    // 动画循环
    function animate() {
        // 清空画布
        ctx.globalAlpha = 1;
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 更新和绘制所有粒子
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // 绘制连接线
        drawConnections();

        // 更新和绘制漂浮足球
        footballs.forEach(football => {
            football.update();
            football.draw();
        });

        // 重置透明度
        ctx.globalAlpha = 1;

        // 继续动画
        requestAnimationFrame(animate);
    }

    // 处理窗口大小变化
    function handleResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // 如果粒子位置超出新边界，重新设置
        particles.forEach(particle => {
            particle.x = Math.min(particle.x, canvas.width);
            particle.y = Math.min(particle.y, canvas.height);
        });
    }

    // 处理鼠标移动
    function handleMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    }

    // 处理鼠标离开
    function handleMouseLeave() {
        mouse.active = false;
    }

    // 处理触摸移动（简化版，不吸引粒子）
    function handleTouchMove(e) {
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        mouse.active = false; // 移动端关闭吸引效果
    }

    // 初始化
    function init() {
        // 设置画布大小
        handleResize();

        // 创建粒子
        initParticles();
        
        // 创建漂浮足球
        initFootballs();

        // 添加事件监听
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('touchmove', handleTouchMove);

        // 开始动画
        animate();
    }

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();