// ==UserScript==
// @name         ChatGPT Productivity Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Optimized shortcuts for ChatGPT: Ctrl+B for the sidebar and Ctrl+I for temporary mode.
// @author       Atari-01
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// ==/UserScript==
(function() {
  'use strict';
  const getTempBtn = () => [...document.querySelectorAll('button')].find(b => {
    const l = (b.getAttribute('aria-label') || b.title || '').toLowerCase();
    return l.includes('activar chat temporal') || l.includes('desactivar chat temporal');
  });
  const getSidebarClose = () => document.querySelector('#sidebar-header > div > button');
  const getSidebarOpen = () => [...document.querySelectorAll('button[aria-label], button[title]')].find(b => {
    const l = (b.getAttribute('aria-label') || b.title || '').toLowerCase();
    return l.includes('abrir barra lateral');
  });
  const tryClickSidebar = (max = 8, delay = 60) => {
    let count = 0;
    const i = setInterval(() => {
      const close = getSidebarClose();
      if (close) {
        close.click();
        clearInterval(i);
        return;
      }
      const open = getSidebarOpen();
      if (open) {
        open.click();
        clearInterval(i);
        return;
      }
      count++;
      if (count >= max) clearInterval(i);
    }, delay);
  };
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && !e.shiftKey && !e.altKey) {
      const k = e.key.toLowerCase();
      if (k === 'i') {
        e.preventDefault();
        const btn = getTempBtn();
        if (btn) btn.click();
      }
      if (k === 'b') {
        e.preventDefault();
        tryClickSidebar();
      }
    }
  });
})();
