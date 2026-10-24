(() => {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const loader = document.querySelector(".loader");
    const loaderBefore = document.querySelector(".loader-before");

    const site = document.querySelector(".site");
    const progress = document.querySelector(".loader-progress");
    const count = document.querySelector(".loader-count span");
    const menuButton = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    // Mobile navigation
    menuButton.addEventListener("click", () => {
        const open = navLinks.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.querySelector("span").textContent = open ? "×" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) =>
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");

            menuButton.setAttribute("aria-expanded", "false");
            menuButton.querySelector("span").textContent = "☰";
        }),
    );

    // Keep the experience usable if GSAP CDN is unavailable.
    if (!window.gsap || reducedMotion) {
        document.body.classList.remove("is-loading");
        loader.remove();
        site.style.opacity = "1";
        return;
    }

    const loadState = { value: 0 };

    gsap.to(loadState, {
        value: 100,
        duration: 2.1,
        ease: "power2.inOut",

        onUpdate: () => {
            const n = Math.round(loadState.value);
            progress.style.width = n + "%";
            count.textContent = String(n).padStart(2, "0");
        },
        onComplete: () => {
            const intro = gsap.timeline({
                defaults: { ease: "power3.out" },
                onComplete: () => {
                    document.body.classList.remove("is-loading");

                    loader.remove();
                    ScrollTrigger.refresh();

                    startFloatingAnimations();
                },
            });

            intro
                .to(".loader-inner", {
                    y: -18,
                    opacity: 0,
                    duration: 0.35,
                })
                .to(loaderBefore, { yPercent: -120, duration: 0.01 }, 0)
                .to(
                    loader,
                    {
                        clipPath: "inset(0 0 100% 0 round 0 0 45% 45%)",
                        duration: 0.85,
                        ease: "power4.inOut",
                    },
                    "-=.05",
                )
                .to(site, { opacity: 1, duration: 0.1 }, "<")
                .from(".nav", { y: -22, opacity: 0, duration: 0.7 }, "-=.25")
                .from(".eyebrow", { y: 18, opacity: 0, duration: 0.6 }, "-=.35")
                .from(
                    "h1 .line",
                    { yPercent: 115, stagger: 0.13, duration: 0.9 },
                    "-=.35",
                )
                .from(
                    ".hero-description",
                    { y: 18, opacity: 0, duration: 0.65 },
                    "-=.5",
                )
                .from(
                    ".hero-actions",
                    { y: 15, opacity: 0, duration: 0.6 },
                    "-=.45",
                )
                .from(
                    ".plane-wrap",
                    {
                        x: 130,
                        y: 70,
                        rotation: -18,
                        scale: 0.65,
                        opacity: 0,
                        duration: 1.4,
                        ease: "power3.out",
                    },
                    "-=1.1",
                )
                .from(
                    ".sun",
                    {
                        scale: 0.4,
                        rotation: -35,
                        opacity: 0,
                        duration: 1,
                    },
                    "-=1.2",
                )
                .from(
                    ".balloon",
                    {
                        y: 70,
                        opacity: 0,
                        stagger: 0.16,
                        duration: 1.1,
                    },
                    "-=1",
                )
                .from(
                    ".cloud",
                    {
                        x: (i) => (i % 2 ? 65 : -65),
                        opacity: 0,
                        stagger: 0.12,
                        duration: 1,
                    },
                    "-=1",
                )

                .from(
                    ".scroll-cue, .bottom-label",
                    {
                        opacity: 0,
                        y: 10,
                        stagger: 0.1,
                        duration: 0.6,
                    },
                    "-=.5",
                );
        },
    });

    /* =========================================
        GENTLE PAPER-FLIGHT MOTION
        Smooth floating — no sudden jumps
    ========================================= */

    function startFloatingAnimations() {
        // Airplane: slow, weightless gliding
        gsap.to(".plane-float", {
            y: "-=12",
            x: "+=25",
            rotation: "+=1",
            duration: 4.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // Balloons: independent, gentle drifting
        gsap.to(".balloon-a .balloon-float", {
            y: "-=12",
            x: "+=3",
            rotation: "+=1",
            duration: 5.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        gsap.to(".balloon-b .balloon-float", {
            y: "-=9",
            x: "-=3",
            rotation: "-=1",
            duration: 4.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // Sun: almost imperceptible movement
        gsap.to(".sun-wrap", {
            rotation: "+=40",
            duration: 18,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // Clouds: slow lateral drifting
        gsap.to(".cloud-a", {
            x: "+=60",
            duration: 12,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        gsap.to(".cloud-b", {
            x: "-=85",
            duration: 14,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        gsap.to(".cloud-c", {
            y: "-=15",
            x: "+=10",
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });
    }

    /* =========================================
        PAPER LANDSCAPE — GENTLE PARALLAX
    ========================================= */

    // Small mouse movement creates a miniature diorama effect.
    // Each layer travels a different distance to suggest depth.

    const hero = document.querySelector(".hero");

    if (hero && !reducedMotion) {
        const parallaxLayers = [
            { selector: ".mountain-far", x: 5, y: 2 },
            { selector: ".mountain-mid", x: 10, y: 4 },
            { selector: ".paper-hills", x: 15, y: 5 },
            { selector: ".tree-row-back", x: 20, y: 4 },
            { selector: ".tree-row-front", x: 26, y: 6 },
            { selector: ".grass-details", x: 12, y: 3 },
        ];

        const cleanups = [];

        parallaxLayers.forEach(({ selector, x, y }) => {
            const elements = hero.querySelectorAll(selector);

            elements.forEach((element) => {
                const moveX = gsap.quickTo(element, "x", {
                    duration: 1.2,
                    ease: "power3.out",
                });

                const moveY = gsap.quickTo(element, "y", {
                    duration: 1.2,
                    ease: "power3.out",
                });

                cleanups.push(() => {
                    gsap.set(element, { x: 0, y: 0 });
                });

                element.dataset.parallaxX = String(x);
                element.dataset.parallaxY = String(y);

                element._paperMoveX = moveX;
                element._paperMoveY = moveY;
            });
        });

        const handlePointerMove = (event) => {
            const bounds = hero.getBoundingClientRect();

            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;

            parallaxLayers.forEach(({ selector }) => {
                hero.querySelectorAll(selector).forEach((element) => {
                    element._paperMoveX?.(
                        -x * Number(element.dataset.parallaxX),
                    );
                    element._paperMoveY?.(
                        -y * Number(element.dataset.parallaxY),
                    );
                });
            });
        };

        const resetParallax = () => {
            cleanups.forEach((cleanup) => cleanup());
        };

        // Mouse movement only: no extra work on touch devices.
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            hero.addEventListener("pointermove", handlePointerMove);
            hero.addEventListener("pointerleave", resetParallax);
        }

        // Scroll parallax: very subtle vertical movement.
        gsap.to(".mountain-far", {
            y: 12,
            ease: "none",
            scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
        });

        gsap.to(".mountain-mid", {
            y: 24,
            ease: "none",
            scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
        });

        gsap.to(".paper-hills", {
            y: 34,
            ease: "none",
            scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
        });
    }
})();
