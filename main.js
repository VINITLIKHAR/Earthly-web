'use strict';

const header   = document.getElementById('header');
const navbar   = document.getElementById('navbar');
const menuBtn  = document.getElementById('menuBtn');
const backTop  = document.getElementById('backTop');
const navLinks = document.querySelectorAll('.navbar ul li a');
const sections = document.querySelectorAll('section[id]');
const video    = document.querySelector('.donate video');

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
}, { once: true, passive: true });

menuBtn.addEventListener('click', () => {
    navbar.classList.toggle('nav-toggle');
    menuBtn.classList.toggle('fa-times');
});

navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
    navbar.classList.remove('nav-toggle');
    menuBtn.classList.remove('fa-times');
}

let lastY   = 0;
let ticking = false;

function onScroll() {
    lastY = window.scrollY;
    if (!ticking) {
        requestAnimationFrame(processScroll);
        ticking = true;
    }
}

function processScroll() {
    const y = lastY;
    header.classList.toggle('scrolled', y > 60);
    highlightNav(y);
    backTop.classList.toggle('show', y > 400);
    ticking = false;
}

window.addEventListener('scroll', onScroll, { passive: true });

function highlightNav(scrollY) {
    let current = '';

    sections.forEach(sec => {
        if (scrollY >= sec.offsetTop - 200) {
            current = sec.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold:  0.12,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

if (video) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.25 });

    videoObserver.observe(video);
}

if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imgObserver.unobserve(img);
            }
        });
    }, { rootMargin: '150px 0px' });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imgObserver.observe(img);
    });
}

const newsletterForm = document.querySelector('.footer form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value.trim()) {
            emailInput.value = '';
            alert('Thank you for subscribing!');
        }
    });
}

const donateForm = document.querySelector('.donate form');
if (donateForm) {
    donateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your donation!');
        donateForm.reset();
    });
}