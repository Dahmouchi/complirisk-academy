"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

interface AnimationProviderProps {
  children: React.ReactNode;
}

const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  useEffect(() => {
    const animatedElements = gsap.utils.toArray("[data-cues]") as HTMLElement[];

    animatedElements.forEach((element) => {
      const cue = element.getAttribute("data-cues");
      const groupName = element.getAttribute("data-group");

      let animation: gsap.core.Tween | gsap.core.Timeline;
      let animationConfig: gsap.TweenVars = {};

      // Define animations based on the data-cues value
      switch (cue) {
        case "slideInUp":
          animationConfig = {
            from: { y: 50, opacity: 0 },
            to: { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
          };
          break;
        case "slideInDown":
          animationConfig = {
            from: { y: -50, opacity: 0 },
            to: { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
          };
          break;
        case "slideInLeft":
          animationConfig = {
            from: { x: -50, opacity: 0 },
            to: { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
          };
          break;
        case "slideInRight":
          animationConfig = {
            from: { x: 50, opacity: 0 },
            to: { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
          };
          break;
        case "fadeIn":
          animationConfig = {
            from: { opacity: 0 },
            to: { opacity: 1, duration: 1, ease: "power3.out" },
          };
          break;
        case "zoomIn":
          animationConfig = {
            from: { scale: 0.8, opacity: 0 },
            to: { scale: 1, opacity: 1, duration: 1, ease: "power3.out" },
          };
          break;
        default:
          animationConfig = {
            from: { opacity: 0 },
            to: { opacity: 1, duration: 1, ease: "power3.out" },
          };
          break;
      }

      if (groupName) {
        // Handle group animations with staggered delays
        const childElements = Array.from(element.children) as HTMLElement[];

        if (childElements.length > 0) {
          // Create timeline for group animation
          const timeline = gsap.timeline({ paused: true });

          // Animate the parent element first
          timeline.fromTo(element, animationConfig.from, {
            ...animationConfig.to,
            duration: 0.8,
          });

          // Then animate children with stagger
          childElements.forEach((child, index) => {
            timeline.fromTo(
              child,
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
                delay: index * 0.1, // Stagger delay of 0.1s between each child
              },
              "-=0.6" // Start before previous animation completes
            );
          });

          ScrollTrigger.create({
            trigger: element,
            animation: timeline,
            toggleActions: "play none none none",
            start: "top 90%",
          });
        } else {
          // If no children, treat as regular element
          animation = gsap.fromTo(
            element,
            animationConfig.from,
            animationConfig.to
          );

          ScrollTrigger.create({
            trigger: element,
            animation: animation,
            toggleActions: "play none none none",
            start: "top 90%",
          });
        }
      } else {
        // Handle individual elements without group
        animation = gsap.fromTo(
          element,
          animationConfig.from,
          animationConfig.to
        );

        ScrollTrigger.create({
          trigger: element,
          animation: animation,
          toggleActions: "play none none none",
          start: "top 90%",
        });
      }
    });

    // Cleanup ScrollTrigger instances on component unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
};

export default AnimationProvider;
