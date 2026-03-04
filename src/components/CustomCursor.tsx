'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const CustomCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        if (!cursor || !follower) return;

        const onMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;

            // Calculate center offsets
            const cursorOffset = 5; // 10px / 2
            const followerOffset = 20; // 40px / 2

            gsap.to(cursor, {
                x: clientX - cursorOffset,
                y: clientY - cursorOffset,
                duration: 0.1,
            });

            gsap.to(follower, {
                x: clientX - followerOffset,
                y: clientY - followerOffset,
                duration: 0.3,
            });
        };

        const onMouseEnterLink = () => {
            gsap.to(follower, {
                scale: 2,
                backgroundColor: 'rgba(232, 255, 71, 0.12)',
                duration: 0.3,
            });
        };

        const onMouseLeaveLink = () => {
            gsap.to(follower, {
                scale: 1,
                backgroundColor: 'transparent',
                duration: 0.3,
            });
        };

        window.addEventListener('mousemove', onMouseMove);

        const links = document.querySelectorAll('a, button, .interactive');
        links.forEach(link => {
            link.addEventListener('mouseenter', onMouseEnterLink);
            link.addEventListener('mouseleave', onMouseLeaveLink);
        });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            links.forEach(link => {
                link.removeEventListener('mouseenter', onMouseEnterLink);
                link.removeEventListener('mouseleave', onMouseLeaveLink);
            });
        };
    }, []);

    return (
        <>
            <div ref={cursorRef} className="custom-cursor" />
            <div ref={followerRef} className="custom-cursor-follower" />
        </>
    );
};
