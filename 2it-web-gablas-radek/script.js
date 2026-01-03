// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// DOM Elements
const loader = document.getElementById('loader');
const progressBar = document.getElementById('progress');
const nav = document.querySelector('nav');
const heroChar = document.querySelector('.hero-char');
const heroTexts = document.querySelectorAll('.hero-text');
const waterCanvas = document.getElementById('water-canvas');
const ctx = waterCanvas.getContext('2d');
const body = document.body;

// State
// Removed isPneuma toggle state - Permanently Ousia (Dark)

// --- Loading Sequence ---
window.addEventListener('load', () => {
    // Simulate loading time for effect
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            gsap.to(progressBar, { width: '100%', duration: 0.5, onComplete: finishLoading });
        } else {
            progressBar.style.width = `${progress}%`;
        }
    }, 200);
});

function finishLoading() {
    gsap.to(loader, {
        opacity: 0,
        duration: 1,
        pointerEvents: 'none',
        onComplete: () => {
            initHeroAnimations();
            nav.classList.remove('nav-hidden');
            gsap.to(nav, { opacity: 1, duration: 1 });
        }
    });
}

function initHeroAnimations() {
    const tl = gsap.timeline();

    tl.to(heroChar, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out"
    })
        .to(heroTexts, {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 1,
            ease: "power2.out"
        }, "-=1.0");
}

// --- Parallax & Scroll Animations & Cursor Trail ---
document.addEventListener('mousemove', (e) => {
    // Parallax
    const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.02;

    gsap.to(heroChar, {
        x: moveX,
        y: moveY,
        duration: 1,
        ease: "power1.out"
    });

    gsap.to('.parallax-bg', {
        x: -moveX * 0.5,
        y: -moveY * 0.5,
        duration: 1
    });

    // Cursor Trail - Spawn particles
    // Spawn multiple for a richer effect
    for (let i = 0; i < 2; i++) {
        particles.push(new Particle(e.clientX, e.clientY, 'trail'));
    }
});

// Scroll Triggers for Sections
gsap.utils.toArray('[data-aos]').forEach(element => {
    const animation = element.getAttribute('data-aos');
    let xVal = 0, yVal = 0;

    if (animation === 'fade-up') yVal = 50;
    if (animation === 'fade-right') xVal = -50;
    if (animation === 'fade-left') xVal = 50;

    gsap.fromTo(element,
        { autoAlpha: 0, x: xVal, y: yVal },
        {
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 1,
            ease: "power2.out"
        }
    );
});

// --- Water Canvas Effects ---
let particles = [];
let width, height;

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    waterCanvas.width = width;
    waterCanvas.height = height;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'bubble', 'splash', or 'trail'

        if (type === 'trail') {
            this.size = Math.random() * 4 + 2;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.life = 40 + Math.random() * 20; // Shorter life for trail
            this.decay = 0.05 + Math.random() * 0.05; // Size removal rate
        } else {
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = (Math.random() - 0.5) * 1;
            this.life = 100;
            this.decay = 0;
        }

        this.alpha = Math.random() * 0.5 + 0.3;
    }

    update() {
        if (this.type === 'trail') {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size -= this.decay; // Shrink over time
            if (this.size < 0) this.life = 0;
        } else {
            this.y -= this.speedY; // Float up
            this.x += this.speedX;
            if (this.type === 'splash') {
                this.speedY -= 0.05; // Gravity
            }
        }
        this.life--;
    }

    draw(ctx) {
        if (this.life <= 0 || (this.type === 'trail' && this.size <= 0)) return;

        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2);

        let color = `rgba(135, 206, 250, ${this.alpha * (this.life / 100)})`; // Default Blue
        if (this.type === 'trail') {
            // Azure/Cyan mix for trail
            color = `rgba(64, 224, 208, ${this.alpha})`;
        }

        ctx.fillStyle = color;
        ctx.fill();
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    // Spawn ambient bubbles
    if (Math.random() < 0.1) {
        particles.push(new Particle(Math.random() * width, height + 10, 'bubble'));
    }

    particles.forEach((p, index) => {
        p.update();
        p.draw(ctx);
        if (p.life <= 0) particles.splice(index, 1);
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// Scroll Splash Effect
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const diff = Math.abs(currentScrollY - lastScrollY);

    if (diff > 20) {
        // Spawn splash particles at bottom
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(Math.random() * width, height, 'splash'));
        }
    }
    lastScrollY = currentScrollY;
});


// --- Removed Arkhe Toggle Logic ---

