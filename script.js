// ==========================================================================
// Cloud Computing - Experiment 04
// Interactive Scripts
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initThemeToggle();
  initCounter();
  initColorGenerator();
  initGreetingForm();
});

/* --------------------------------------------------------------------------
   1. Live Clock & Date
   -------------------------------------------------------------------------- */
function initClock() {
  const clockEl = document.getElementById('live-clock');
  const dateEl = document.getElementById('live-date');

  function updateTime() {
    const now = new Date();
    
    // Time format: HH:MM:SS AM/PM
    const timeString = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    
    // Date format: e.g. Friday, October 25, 2026
    const dateString = now.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (clockEl) clockEl.textContent = timeString;
    if (dateEl) dateEl.textContent = dateString;
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* --------------------------------------------------------------------------
   2. Theme Toggle (Light / Dark)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Check persisted theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
}

/* --------------------------------------------------------------------------
   3. Interactive Counter
   -------------------------------------------------------------------------- */
function initCounter() {
  const counterDisplay = document.getElementById('counter-value');
  const btnInc = document.getElementById('btn-increment');
  const btnDec = document.getElementById('btn-decrement');
  const btnReset = document.getElementById('btn-reset');

  let count = 0;

  function updateDisplay() {
    if (counterDisplay) {
      counterDisplay.textContent = count;
      if (count > 0) {
        counterDisplay.style.color = '#10b981';
      } else if (count < 0) {
        counterDisplay.style.color = '#ef4444';
      } else {
        counterDisplay.style.color = 'inherit';
      }
    }
  }

  if (btnInc) {
    btnInc.addEventListener('click', () => {
      count++;
      updateDisplay();
    });
  }

  if (btnDec) {
    btnDec.addEventListener('click', () => {
      count--;
      updateDisplay();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      count = 0;
      updateDisplay();
      showToast('Counter reset to 0');
    });
  }
}

/* --------------------------------------------------------------------------
   4. Random Color Generator & Copy
   -------------------------------------------------------------------------- */
function initColorGenerator() {
  const colorBox = document.getElementById('color-box');
  const colorCode = document.getElementById('color-code');
  const btnGenerate = document.getElementById('btn-random-color');

  function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function applyRandomColor() {
    const randomColor = getRandomHexColor();
    if (colorBox) colorBox.style.backgroundColor = randomColor;
    if (colorCode) colorCode.textContent = randomColor;
  }

  if (btnGenerate) {
    btnGenerate.addEventListener('click', () => {
      applyRandomColor();
    });
  }

  // Allow clicking on color box or code to copy to clipboard
  const previewBox = document.querySelector('.color-preview-box');
  if (previewBox) {
    previewBox.style.cursor = 'pointer';
    previewBox.title = 'Click to copy color code';
    previewBox.addEventListener('click', () => {
      const code = colorCode ? colorCode.textContent : '';
      if (code && navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
          showToast(`Copied ${code} to clipboard!`);
        });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   5. Interactive Greeting Form
   -------------------------------------------------------------------------- */
function initGreetingForm() {
  const form = document.getElementById('greeting-form');
  const input = document.getElementById('visitor-name');
  const output = document.getElementById('greeting-output');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = input ? input.value.trim() : '';
      if (name) {
        const greetings = [
          `Welcome to Cloud Computing Experiment 04, ${name}! 🎉`,
          `Great to have you here, ${name}! 🚀`,
          `Hello ${name}! Successfully connected to GitHub Pages 🌐`,
          `Hi ${name}! Hope you enjoy this static web app ✨`
        ];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        if (output) {
          output.textContent = randomGreeting;
        }
        showToast(`Greeting displayed for ${name}`);
        if (input) input.value = '';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. Toast Notification Helper
   -------------------------------------------------------------------------- */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}
