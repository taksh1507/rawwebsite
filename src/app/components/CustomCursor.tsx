/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    const cursorDot = document.querySelector('.cursor-dot') as HTMLElement;
    const cursorOutline = document.querySelector('.cursor-outline') as HTMLElement;

    if (!cursorDot || !cursorOutline) return;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot moves instantly
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Animate outline with trailing effect
    const animateOutline = () => {
      outlineX += (mouseX - outlineX) * 0.2; // 0.2 = smoothing factor
      outlineY += (mouseY - outlineY) * 0.2;

      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;

      requestAnimationFrame(animateOutline);
    };

    animateOutline();

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, .btn, .card, [role="button"], input[type="submit"], input[type="button"]'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.classList.remove('hovered');
      });
    });

    return () => {
      // Cleanup
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', () => {});
        el.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return null;
}
