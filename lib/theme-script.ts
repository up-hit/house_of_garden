export const THEME_KEY = "hog-theme";

/**
 * Inline script placed in <head> so the saved (or system) theme is applied before first paint.
 * It also adds the "js" class that enables the scroll-reveal animations (content stays fully
 * visible when JavaScript is unavailable).
 */
export const themeInitScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=null;try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}if(t!=='light'&&t!=='dark'){t=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}d.setAttribute('data-theme',t);d.style.colorScheme=t}catch(e){d.setAttribute('data-theme','light')}})();`;
