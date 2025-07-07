// Reset Theme to Light Mode - Run this in browser console if needed
// This will reset any existing appearance preferences to light mode

// Clear localStorage
localStorage.setItem('appearance', 'light');

// Clear cookie
document.cookie = 'appearance=light;path=/;max-age=' + (365 * 24 * 60 * 60) + ';SameSite=Lax';

// Apply light theme immediately
document.documentElement.classList.remove('dark');

console.log('Theme reset to light mode');
