"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Landing-page motion: Lenis smooth scroll and section reveals.
 * Both are skipped under prefers-reduced-motion; content is visible without this component.
 */
export function LandingMotion() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const lenis = new Lenis({ anchors: { offset: -72 } });
        let frame = requestAnimationFrame(function raf(time) {
            lenis.raf(time);
            frame = requestAnimationFrame(raf);
        });

        const root = document.documentElement;
        const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
        // Elements already on screen at load stay visible; only content below the fold animates in.
        const below = targets.filter((el) => el.getBoundingClientRect().top > window.innerHeight);
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    entry.target.classList.add("is-revealed");
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin: "0px 0px -10% 0px" }
        );
        targets.forEach((el) => {
            if (!below.includes(el)) el.classList.add("is-revealed");
            else observer.observe(el);
        });
        root.classList.add("reveal-ready");

        return () => {
            cancelAnimationFrame(frame);
            lenis.destroy();
            observer.disconnect();
            root.classList.remove("reveal-ready");
        };
    }, []);

    return null;
}
