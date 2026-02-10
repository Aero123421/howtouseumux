// ===== Navigation =====
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile menu toggle
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
            }
        });
    });
});

// ===== Hero Typing Animation =====
document.addEventListener('DOMContentLoaded', () => {
    const typingElements = document.querySelectorAll('.typing');
    
    typingElements.forEach(el => {
        const text = el.dataset.text;
        if (!text) return;
        
        let i = 0;
        el.textContent = '';
        
        function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, 100);
            } else {
                // Show output after typing
                setTimeout(() => {
                    const output = el.closest('.terminal-line').nextElementSibling;
                    if (output) {
                        output.classList.remove('hidden');
                        output.style.animation = 'fadeInUp 0.5s ease';
                    }
                }, 500);
            }
        }
        
        // Start typing after delay
        setTimeout(type, 1000);
    });
});

// ===== Pane Demo =====
document.addEventListener('DOMContentLoaded', () => {
    const demoPanes = document.getElementById('demo-panes');
    const keys = document.querySelectorAll('.key');
    const pressedKeysDisplay = document.querySelector('.pressed-keys');
    
    let isPrefixPressed = false;
    let currentLayout = 'single'; // single, horizontal, vertical, four, grid
    
    const layouts = {
        single: () => `
            <div class="pane-single active">
                <div class="pane-label">0:bash*</div>
                <div class="pane-content-area">
                    <span class="prompt">$</span> <span class="cursor">_</span>
                </div>
            </div>
        `,
        horizontal: () => `
            <div class="demo-pane active" style="grid-column: 1; grid-row: 1;">
                <span class="pane-label">0:bash*</span>
                <div style="padding-top: 20px;"><span class="prompt">$</span> vim app.js</div>
            </div>
            <div class="demo-pane" style="grid-column: 2; grid-row: 1;">
                <span class="pane-label">1:bash</span>
                <div style="padding-top: 20px;"><span class="prompt">$</span> npm start</div>
            </div>
        `,
        vertical: () => `
            <div class="demo-pane active" style="grid-column: 1; grid-row: 1;">
                <span class="pane-label">0:bash*</span>
                <div style="padding-top: 20px;"><span class="prompt">$</span> top</div>
            </div>
            <div class="demo-pane" style="grid-column: 1; grid-row: 2;">
                <span class="pane-label">1:bash</span>
                <div style="padding-top: 20px;"><span class="prompt">$</span> <span class="cursor">_</span></div>
            </div>
        `,
        four: () => `
            <div class="demo-pane active" style="grid-column: 1; grid-row: 1;">
                <span class="pane-label">0:bash*</span>
                <div style="padding-top: 20px; font-size: 0.7rem;">vim</div>
            </div>
            <div class="demo-pane" style="grid-column: 2; grid-row: 1;">
                <span class="pane-label">1:bash</span>
                <div style="padding-top: 20px; font-size: 0.7rem;">server</div>
            </div>
            <div class="demo-pane" style="grid-column: 1; grid-row: 2;">
                <span class="pane-label">2:bash</span>
                <div style="padding-top: 20px; font-size: 0.7rem;">logs</div>
            </div>
            <div class="demo-pane" style="grid-column: 2; grid-row: 2;">
                <span class="pane-label">3:bash</span>
                <div style="padding-top: 20px; font-size: 0.7rem;">git</div>
            </div>
        `,
        zoom: () => `
            <div class="pane-single active">
                <div class="pane-label">0:bash* (ZOOM)</div>
                <div class="pane-content-area">
                    <span class="prompt">$</span> vim app.js
                    <div style="margin-top: 10px; color: var(--term-blue);">const app = require('express')();</div>
                    <div style="color: var(--term-blue);">app.listen(3000);</div>
                </div>
            </div>
        `
    };
    
    function updateLayout(layoutName) {
        currentLayout = layoutName;
        if (demoPanes && layouts[layoutName]) {
            demoPanes.innerHTML = layouts[layoutName]();
            demoPanes.className = 'terminal-body';
            
            if (layoutName === 'horizontal') {
                demoPanes.style.gridTemplateColumns = '1fr 1fr';
                demoPanes.style.gridTemplateRows = '1fr';
            } else if (layoutName === 'vertical') {
                demoPanes.style.gridTemplateColumns = '1fr';
                demoPanes.style.gridTemplateRows = '1fr 1fr';
            } else if (layoutName === 'four') {
                demoPanes.style.gridTemplateColumns = '1fr 1fr';
                demoPanes.style.gridTemplateRows = '1fr 1fr';
            } else {
                demoPanes.style.gridTemplateColumns = '1fr';
                demoPanes.style.gridTemplateRows = '1fr';
            }
        }
    }
    
    function showPressedKeys(keys) {
        if (pressedKeysDisplay) {
            pressedKeysDisplay.textContent = keys;
            pressedKeysDisplay.style.opacity = '1';
            setTimeout(() => {
                pressedKeysDisplay.style.opacity = '0.5';
            }, 1000);
        }
    }
    
    keys.forEach(key => {
        key.addEventListener('click', () => {
            const keyType = key.dataset.key;
            
            // Visual feedback
            key.classList.add('active');
            setTimeout(() => key.classList.remove('active'), 200);
            
            // Handle prefix key
            if (keyType === 'prefix') {
                isPrefixPressed = true;
                showPressedKeys('Ctrl+b');
                setTimeout(() => { isPrefixPressed = false; }, 2000);
                return;
            }
            
            // Handle other keys
            if (isPrefixPressed) {
                showPressedKeys(`Ctrl+b → ${key.textContent}`);
                
                switch(keyType) {
                    case 'percent':
                        updateLayout('horizontal');
                        break;
                    case 'quote':
                        updateLayout('vertical');
                        break;
                    case 'left':
                    case 'right':
                    case 'up':
                    case 'down':
                        // Cycle active pane
                        const panes = demoPanes?.querySelectorAll('.demo-pane, .pane-single');
                        if (panes) {
                            const activeIndex = Array.from(panes).findIndex(p => p.classList.contains('active'));
                            const nextIndex = (activeIndex + 1) % panes.length;
                            panes[activeIndex]?.classList.remove('active');
                            panes[nextIndex]?.classList.add('active');
                        }
                        break;
                    case 'z':
                        if (currentLayout === 'zoom') {
                            updateLayout('horizontal');
                        } else {
                            updateLayout('zoom');
                        }
                        break;
                    case 'x':
                        updateLayout('single');
                        break;
                    case 'ctrl':
                        isPrefixPressed = true;
                        break;
                }
            } else {
                showPressedKeys(key.textContent);
            }
        });
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            isPrefixPressed = true;
            showPressedKeys('Ctrl+b');
            
            const prefixKey = document.querySelector('[data-key="prefix"]');
            prefixKey?.classList.add('active');
            setTimeout(() => prefixKey?.classList.remove('active'), 200);
            
            setTimeout(() => { isPrefixPressed = false; }, 2000);
        }
    });
});

// ===== Cheatsheet Filter =====
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categories = document.querySelectorAll('.cheatsheet-category');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter categories
            categories.forEach(category => {
                if (filter === 'all' || category.dataset.category === filter) {
                    category.style.display = 'block';
                    category.style.animation = 'fadeInUp 0.4s ease';
                } else {
                    category.style.display = 'none';
                }
            });
        });
    });
});

// ===== Copy to Clipboard =====
document.addEventListener('DOMContentLoaded', () => {
    const toast = document.getElementById('toast');
    
    function showToast(message) {
        if (!toast) return;
        
        const toastMessage = toast.querySelector('.toast-message');
        if (toastMessage) {
            toastMessage.textContent = message;
        }
        
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
    
    // Copy buttons in cheatsheet
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const item = btn.closest('.command-item');
            const text = item?.dataset.clipboard || item?.dataset.keys;
            
            if (text) {
                try {
                    await navigator.clipboard.writeText(text);
                    showToast('コピーしました！');
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            }
        });
    });
    
    // Copy config buttons
    document.querySelectorAll('.copy-config-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const block = btn.closest('.config-block');
            const code = block?.querySelector('code');
            
            if (code) {
                try {
                    await navigator.clipboard.writeText(code.textContent);
                    showToast('設定をコピーしました！');
                    btn.textContent = 'コピー済み';
                    setTimeout(() => {
                        btn.textContent = 'コピー';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            }
        });
    });
});

// ===== Config Tabs =====
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Update buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update panels
            tabPanels.forEach(panel => {
                if (panel.dataset.panel === tabId) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });
});

// ===== Intersection Observer for Animations =====
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.feature-card, .concept-card, .cheatsheet-category, .scenario-card').forEach(el => {
        observer.observe(el);
    });
});

// ===== Scroll Progress =====
document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
});

// ===== Keyboard Shortcuts Help =====
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (e) => {
        // Press '?' to show help
        if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
            // Find and click the help link
            const helpLink = document.querySelector('a[href="#cheatsheet"]');
            helpLink?.click();
        }
        
        // Press '1', '2', '3' to jump to sections
        if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.metaKey) {
            const sections = ['#intro', '#concepts', '#cheatsheet', '#practice', '#config'];
            const index = parseInt(e.key) - 1;
            if (sections[index]) {
                document.querySelector(sections[index])?.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ===== Active Navigation Link =====
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// ===== Mobile Menu Styles =====
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border-color);
            padding: var(--space-lg);
            flex-direction: column;
            gap: var(--space-md);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Inject mobile menu styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);

// ===== Console Welcome Message =====
console.log('%c🖥️ tmux マスターガイド', 'font-size: 24px; font-weight: bold; color: #58a6ff;');
console.log('%cキーボードショートカット:', 'font-size: 14px; font-weight: bold; color: #8b949e;');
console.log('%c  ?  %cチートシートを表示', 'background: #21262d; padding: 2px 6px; border-radius: 4px;', 'color: #8b949e;');
console.log('%c  1-5%cセクションにジャンプ', 'background: #21262d; padding: 2px 6px; border-radius: 4px;', 'color: #8b949e;');