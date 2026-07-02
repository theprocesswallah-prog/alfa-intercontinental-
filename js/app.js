/* ==========================================================================
   ALFA INTERCONTINENTAL — GLOBAL CONTROLLER & MOTION ENGINE (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DYNAMIC PRELOADER & SYSTEMS PROGRESS OVERLAY
    const bar = document.getElementById('preloader-bar');
    const percentageText = document.getElementById('preloader-percentage');
    let currentProgress = 0;

    const preloaderTimeline = gsap.timeline({
        onComplete: () => {
            // Restore structural page scrolls on progress completion
            document.body.classList.remove('no-scroll');
            initializeHeroTimeline();
        }
    });

    // Simulated initialization progress of critical systems channels
    const loaderInterval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 12) + 4;
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(loaderInterval);
        }
        
        percentageText.textContent = currentProgress.toString().padStart(2, '0');
        gsap.to(bar, { width: `${currentProgress}%`, duration: 0.1 });
    }, 60);

    // Fade out preloader and split open screen panels on window load completion
    window.addEventListener('load', () => {
        clearInterval(loaderInterval);
        percentageText.textContent = "100";
        
        preloaderTimeline.to(bar, {
            width: "100%",
            duration: 0.3,
            onComplete: () => {
                // Fade loading text content
                gsap.to('.preloader-content', {
                    opacity: 0,
                    y: -30,
                    duration: 0.5,
                    ease: "power3.inOut"
                });
                
                // Sweep structural preloader split panels open
                gsap.to('.preloader-panel-left', {
                    x: "-100%",
                    duration: 1.0,
                    ease: "power4.inOut"
                });
                
                gsap.to('.preloader-panel-right', {
                    x: "100%",
                    duration: 1.0,
                    ease: "power4.inOut",
                    onComplete: () => {
                        const preloader = document.getElementById('preloader');
                        if (preloader) preloader.style.display = 'none';
                    }
                });
            }
        });
    });

    // 2. STICKY HEADER SCROLLTRIGGER STYLING
    function initScrollTriggers() {
        gsap.registerPlugin(ScrollTrigger);

        const header = document.getElementById('main-header');
        
        // Transition transparent navbar to solid frosted glass on page scroll
        ScrollTrigger.create({
            trigger: "body",
            start: "top -10px",
            onEnter: () => header.classList.add('scrolled'),
            onLeaveBack: () => header.classList.remove('scrolled'),
        });
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initScrollTriggers();
    } else {
        const checkScrollTrigger = setInterval(() => {
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                initScrollTriggers();
                clearInterval(checkScrollTrigger);
            }
        }, 100);
    }

    // 3. RESPONSIVE MOBILE NAVIGATION DRAWER TOGGLE
    const hamburgerTrigger = document.getElementById('hamburger-trigger');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');

    hamburgerTrigger.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.contains('open');
        hamburgerTrigger.setAttribute('aria-expanded', !isOpen);
        
        hamburgerTrigger.classList.toggle('active');
        mobileDrawer.classList.toggle('open');
        document.body.classList.toggle('no-scroll');

        if (!isOpen) {
            mobileDrawer.setAttribute('aria-hidden', 'false');
            
            // Staggered reveal of mobile navigation links
            gsap.fromTo('.drawer-link', {
                y: 40,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                stagger: 0.08,
                duration: 0.6,
                ease: "power3.out",
                delay: 0.35
            });
        } else {
            mobileDrawer.setAttribute('aria-hidden', 'true');
        }
    });

    // Close the drawer automatically when clicking drawer links
    const drawerLinks = document.querySelectorAll('.drawer-link');
    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerTrigger.classList.remove('active');
            mobileDrawer.classList.remove('open');
            document.body.classList.remove('no-scroll');
            mobileDrawer.setAttribute('aria-hidden', 'true');
        });
    });

    // 4. GSAP CINEMATIC HERO ENTER SEQUENCE
    function initializeHeroTimeline() {
        const heroTimeline = gsap.timeline();

        // 1px structural grid lines scale up
        heroTimeline.fromTo('.grid-line', {
            scaleY: 0,
            transformOrigin: "top"
        }, {
            scaleY: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: "power3.inOut"
        });

        // Slide down the header panel
        heroTimeline.fromTo('.main-header', {
            y: -100,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power4.out"
        }, "-=0.6");

        // Vertical mask reveal of hero title split lines
        heroTimeline.fromTo('.title-line', {
            y: "115%",
            opacity: 0
        }, {
            y: "0%",
            opacity: 1,
            stagger: 0.15,
            duration: 1.1,
            ease: "power4.out"
        }, "-=0.75");

        // Subheading and tagline slide up and fade in
        heroTimeline.fromTo(['.hero-tagline-wrapper', '.hero-description'], {
            y: 35,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.9,
            ease: "power3.out"
        }, "-=0.8");

        // Primary action group buttons fade in
        heroTimeline.fromTo('#hero-actions', {
            y: 20,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.75");

        // Slide in spec indicator side panel elements
        heroTimeline.fromTo('.spec-node', {
            x: 60,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.8");

        // Reveal scroll-down anchor indicator
        heroTimeline.fromTo('#hero-scroll-anchor', {
            opacity: 0,
            y: 15
        }, {
            opacity: 1,
            y: 0,
            duration: 0.6
        }, "-=0.35");
    }

    // 5. VIDEO PLAYBACK FALLBACK HANDLE
    const backgroundVideo = document.getElementById('hero-video');
    if (backgroundVideo) {
        const playPromise = backgroundVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // If standard browser privacy limits block video, render static image fallback
                const fallback = document.querySelector('.fallback-hero-image');
                if (fallback) fallback.style.display = 'block';
                backgroundVideo.style.display = 'none';
            });
        }
    }
});
