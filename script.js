// PDF file paths - Use your actual PDF files
const PDF_FILES = {
    'revenue': 'pdfs/Revenue management.pdf',
    'smm': 'pdfs/Social Media Marketing workflow.pdf',
    'seo': 'pdfs/SEO services.pdf',
    'gmb': 'pdfs/GMB Services.pdf'
};

let loadedDrawers = new Set();

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c FLYBEE_SYSTEM_INITIALIZED', 'color: #00f3ff; font-size: 20px; font-weight: bold;');
    
    initParticles();
    initScrollEffects();
    initMobileMenu();
    initTypingEffect();
    
    console.log('%c [✓] All systems operational', 'color: #fd8549;');
});

// Toggle Drawer Function (called from HTML onclick)
function toggleDrawer(serviceId) {
    console.log('Toggle drawer:', serviceId);
    
    const drawer = document.getElementById('drawer-' + serviceId);
    const button = event.target.closest('.service-btn');
    const isOpen = drawer.classList.contains('open');

    // Close all other drawers
    document.querySelectorAll('.pdf-drawer').forEach(d => {
        if (d !== drawer) {
            d.classList.remove('open');
        }
    });
    
    // Reset all buttons
    document.querySelectorAll('.service-btn').forEach(b => {
        if (b !== button) {
            b.classList.remove('active');
        }
    });

    if (isOpen) {
        // Close this drawer
        drawer.classList.remove('open');
        button.classList.remove('active');
        console.log('Drawer closed');
    } else {
        // Open this drawer
        drawer.classList.add('open');
        button.classList.add('active');
        console.log('Drawer opened');
        
        // Load PDF if not already loaded
        if (!loadedDrawers.has(serviceId)) {
            loadPDF(serviceId);
            loadedDrawers.add(serviceId);
        }
        
        // Scroll to drawer smoothly
        setTimeout(() => {
            drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
}

// Load PDF into drawer
function loadPDF(serviceId) {
    console.log('Loading PDF for:', serviceId);
    
    const slidesContainer = document.getElementById('slides-' + serviceId);
    const loadingEl = slidesContainer.previousElementSibling;
    const pdfUrl = PDF_FILES[serviceId];

    if (!pdfUrl) {
        loadingEl.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <p>PDF NOT CONFIGURED</p>
            <p style="font-size: 0.9rem; margin-top: 10px; color: #888;">
                Please add the PDF file path for ${serviceId} in script.js
            </p>
        `;
        console.warn('No PDF found for:', serviceId);
        return;
    }

    // Show loading
    loadingEl.innerHTML = `
        <i class="fas fa-circle-notch fa-spin"></i>
        <p>LOADING PDF...</p>
    `;

    // Check if PDF exists
    fetch(pdfUrl, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                // PDF exists, display it
                loadingEl.style.display = 'none';
                
                const pdfContainer = document.createElement('div');
                pdfContainer.className = 'pdf-viewer-container';
                pdfContainer.innerHTML = `
                    <div class="pdf-controls">
                        <button class="pdf-control-btn" onclick="window.open('${pdfUrl}', '_blank')">
                            <i class="fas fa-external-link-alt"></i> OPEN IN NEW TAB
                        </button>
                        <button class="pdf-control-btn" onclick="downloadPDF('${pdfUrl}', '${serviceId}')">
                            <i class="fas fa-download"></i> DOWNLOAD
                        </button>
                    </div>
                    <iframe src="${pdfUrl}" class="pdf-iframe"></iframe>
                `;
                
                slidesContainer.appendChild(pdfContainer);
                console.log(`✅ PDF loaded for ${serviceId}`);
            } else {
                throw new Error('PDF not found');
            }
        })
        .catch(error => {
            console.error('PDF loading error:', error);
            loadingEl.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>PDF FILE NOT FOUND</p>
                <p style="font-size: 0.9rem; margin-top: 10px; color: #888;">
                    Make sure ${pdfUrl} exists in your project folder
                </p>
            `;
        });
}

// Download PDF function
function downloadPDF(pdfUrl, serviceId) {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = serviceId + '-presentation.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('Download started:', pdfUrl);
}

// Create particle background
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const delay = Math.random() * 20;
        const duration = 15 + Math.random() * 10;
        particle.style.animationDelay = delay + 's';
        particle.style.animationDuration = duration + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Scroll effects for navbar
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }
}

// Typing effect for motto
function initTypingEffect() {
    const text = 'INTELLIGENT REVENUE ARCHITECTURE';
    const typingElement = document.querySelector('.typing-text');
    
    if (!typingElement) return;
    
    typingElement.textContent = '';
    let index = 0;
    
    const type = () => {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    };
    
    setTimeout(type, 500);
}

// Glitch effect on scroll
window.addEventListener('scroll', () => {
    const glitchElement = document.querySelector('.glitch');
    if (!glitchElement) return;
    
    if (window.pageYOffset > 50) {
        glitchElement.style.animation = 'none';
    } else {
        glitchElement.style.animation = 'glitch-main 3s infinite';
    }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateMatrixMode();
    }
});

function activateMatrixMode() {
    console.log('%c MATRIX MODE ACTIVATED', 'color: #00ff00; font-size: 30px; font-weight: bold;');
    
    document.documentElement.style.setProperty('--cyan', '#00ff00');
    document.documentElement.style.setProperty('--orange', '#00ff00');
    
    setTimeout(() => {
        document.documentElement.style.setProperty('--cyan', '#00f3ff');
        document.documentElement.style.setProperty('--orange', '#fd8549');
    }, 10000);
}

// Performance monitoring
window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    if (perfData) {
        console.log(`⚡ Load Time: ${(perfData.loadEventEnd - perfData.fetchStart).toFixed(2)}ms`);
    }
});

// System status messages in console
const statusMessages = [
    'Initializing revenue protocols...',
    'Loading optimization algorithms...',
    'Connecting to neural network...',
    'Calibrating social matrix...',
    'System ready for deployment.'
];

statusMessages.forEach((msg, index) => {
    setTimeout(() => {
        console.log(`%c [${index + 1}/${statusMessages.length}] ${msg}`, 'color: #00f3ff;');
    }, index * 300);
});