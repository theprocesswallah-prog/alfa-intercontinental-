/* ==========================================================================
   ALFA INTERCONTINENTAL — DYNAMIC CUSTOM CURSOR SYSTEM (cursor.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. TOUCH ACCESSIBILITY AUDIT
    // Safely disable custom desktop physics on touch devices to preserve default mobile scrolling
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        return;
    }

    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    const cursorText = follower.querySelector('.cursor-inner-text');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    let cursorX = mouseX;
    let cursorY = mouseY;
    let followerX = mouseX;
    let followerY = mouseY;

    // Track real-time viewport mouse coordinates
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // 2. MECHANICAL CURSOR RENDERING (Spring Interpolation)
    function renderCursor() {
        cursorX = mouseX;
        cursorY = mouseY;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        // Delay physics on the outer ring to create organic visual trailing
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;

        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // 3. HOVER LOGIC CHANNELS
    // Dynamic tracking of interactive visual elements
    const updateInteractiveTriggers = () => {
        const interactiveElements = document.querySelectorAll('a, button, [data-cursor-action], .hamburger-menu');
        
        interactiveElements.forEach(element => {
            // Remove previous event listeners to avoid memory leaks during dynamic DOM shifts
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
            
            element.addEventListener('mouseenter', handleMouseEnter);
            element.addEventListener('mouseleave', handleMouseLeave);
        });
    };

    function handleMouseEnter(e) {
        const element = e.currentTarget;
        cursor.classList.add('hovering');
        follower.classList.add('hovering');
        
        const cursorAction = element.getAttribute('data-cursor-action');
        if (cursorAction === 'play') {
            follower.classList.add('play-hover');
            if (cursorText) cursorText.textContent = 'PLAY';
        }
    }

    function handleMouseLeave() {
        cursor.classList.remove('hovering');
        follower.classList.remove('hovering');
        follower.classList.remove('play-hover');
        if (cursorText) cursorText.textContent = '';
    }

    // Initialize triggers on initial load
    updateInteractiveTriggers();

    // 4. MAGNETIC GRID COMPONENT ENGINES
    const initMagneticElements = () => {
        const magneticElements = document.querySelectorAll('[data-magnetic]');
        
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                // Determine exact mouse offset from component coordinate center
                const x = e.clientX - rect.left - (rect.width / 2);
                const y = e.clientY - rect.top - (rect.height / 2);
                
                // Shift interactive target with a slight physical resistance
                gsap.to(el, {
                    x: x * 0.35,
                    y: y * 0.35,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Adjust outer tracker expansion ratio
                gsap.to(follower, {
                    scale: 1.15,
                    duration: 0.3
                });
            });

            el.addEventListener('mouseleave', () => {
                // Spring elements back to their absolute origin
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.5)"
                });
                
                gsap.to(follower, {
                    scale: 1,
                    duration: 0.3
                });
            });
        });
    };

    // Initialize magnetic elements on dependency check
    if (typeof gsap !== 'undefined') {
        initMagneticElements();
    } else {
        // Fallback safety check if DOM script loader has minor network lag
        const checkGsap = setInterval(() => {
            if (typeof gsap !== 'undefined') {
                initMagneticElements();
                clearInterval(checkGsap);
            }
        }, 100);
    }

    // Export internal updates hook for future pages & sections loading elements dynamically
    window.updateCustomCursorHooks = updateInteractiveTriggers;
});
