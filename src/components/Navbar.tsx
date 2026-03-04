'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';

export const Navbar = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav id="navbar">
            <div className="nav-logo">
                Mayank<span>.</span>
            </div>

            <ul className="nav-links">
                <li><a className="interactive" href="#about">About</a></li>
                <li><a className="interactive" href="#work">Work</a></li>
                <li><a className="interactive" href="#skills">Skills</a></li>
                <li><a className="interactive" href="#contact">Contact</a></li>
            </ul>

            <div className="nav-right">
                <div className="available-dot">Available</div>
                <button
                    type="button"
                    className="theme-toggle interactive"
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                    title="Toggle theme"
                />
            </div>
        </nav>
    );
};
