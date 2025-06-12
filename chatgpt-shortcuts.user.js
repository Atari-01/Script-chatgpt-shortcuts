// ==UserScript==
// @name         ChatGPT Productivity Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Optimized shortcuts for ChatGPT: Ctrl+B for the sidebar and Ctrl+I for temporary mode.
// @author       Atari-01
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/Atari-01/Script-chatgpt-shortcuts/main/chatgpt-shortcuts.user.js
// ==/UserScript==
(function () {
  'use strict';

  const tempKeywords = ['activar chat temporal', 'desactivar chat temporal'];
  const sidebarKey = 'abrir barra lateral';

  let tempBtnCache = null;
  let avatarCache = null;

  const labelMatches = (el, keywords) => {
    const label = (el.getAttribute('aria-label') || el.title || '').toLowerCase();
    return keywords.some(k => label.includes(k));
  };

  const findButton = (keywords) =>
    Array.from(document.querySelectorAll('button[aria-label], button[title]'))
      .find(btn => labelMatches(btn, keywords)) || null;

  const getTempButton = () =>
    (tempBtnCache && document.contains(tempBtnCache)) ? tempBtnCache : (tempBtnCache = findButton(tempKeywords));

  const getSidebarOpen = () => findButton([sidebarKey]);
  const getSidebarClose = () => document.querySelector('#sidebar-header > div > button');

  const tryToggleSidebar = (maxTries = 8) => {
    let attempts = 0;
    const loop = () => {
      const closeBtn = getSidebarClose();
      if (closeBtn) return closeBtn.click();
      const openBtn = getSidebarOpen();
      if (openBtn) return openBtn.click();
      if (++attempts < maxTries) requestAnimationFrame(loop);
    };
    loop();
  };

  const toggleAvatar = () => {
    if (!avatarCache || !document.contains(avatarCache)) {
      avatarCache = document.querySelector('img[src^="https://lh3.googleusercontent.com/"][alt="User"]');
    }
    if (avatarCache) {
      const isHidden = avatarCache.style.display === 'none';
      avatarCache.style.setProperty('display', isHidden ? 'inline-block' : 'none', 'important');
    }
  };

  document.addEventListener('keydown', (e) => {
    if (!e.ctrlKey || e.altKey) return;

    const key = e.key.toLowerCase();

    if (key === 'i' && !e.shiftKey) {
      e.preventDefault();
      getTempButton()?.click();
    } else if (key === 'b' && !e.shiftKey) {
      e.preventDefault();
      tryToggleSidebar();
    } else if (key === 'h' && e.shiftKey) {
      e.preventDefault();
      toggleAvatar();
    }
  }, { passive: false });

})();
