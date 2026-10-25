// ==========================================================================
// Cloud Computing - Experiment 04: Interactive Architecture & Simulator
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSharedResponsibility();
  initCostEstimator();
  initQuiz();
});

/* --------------------------------------------------------------------------
   1. Theme Management
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  const savedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');

  setTheme(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      showToast(`Switched to ${next} theme`);
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
   2. Shared Responsibility Stack Model
   -------------------------------------------------------------------------- */
const STACK_LAYERS = [
  { id: 'app', name: 'Applications' },
  { id: 'data', name: 'Data & Databases' },
  { id: 'runtime', name: 'Runtime Environment' },
  { id: 'middleware', name: 'Middleware' },
  { id: 'os', name: 'Operating System' },
  { id: 'virt', name: 'Virtualization / Hypervisor' },
  { id: 'servers', name: 'Physical Servers' },
  { id: 'storage', name: 'Storage Hardware' },
  { id: 'net', name: 'Physical Networking & Data Center' }
];

const MODEL_RULES = {
  onprem: {
    title: 'On-Premises (Traditional Datacenter)',
    desc: 'You are 100% responsible for purchasing physical hardware, cabling, cooling, virtualization, OS patches, runtimes, backups, and applications.',
    userLayers: ['app', 'data', 'runtime', 'middleware', 'os', 'virt', 'servers', 'storage', 'net']
  },
  iaas: {
    title: 'Infrastructure as a Service (IaaS)',
    desc: 'The Cloud Provider guarantees physical datacenter security, power, hardware servers, storage arrays, and hypervisors. You manage the guest OS, security patches, network firewalls, and application runtimes.',
    userLayers: ['app', 'data', 'runtime', 'middleware', 'os']
  },
  paas: {
    title: 'Platform as a Service (PaaS)',
    desc: 'The Cloud Provider manages the OS, runtime engines, database engines, auto-scaling, and infrastructure maintenance. You focus purely on writing code, business logic, and dataset schemas.',
    userLayers: ['app', 'data']
  },
  saas: {
    title: 'Software as a Service (SaaS)',
    desc: 'The Cloud Provider handles the entire stack from physical facilities up to the finished application. You simply consume the software over a browser, configure user permissions, and input data.',
    userLayers: []
  }
};

function initSharedResponsibility() {
  const container = document.getElementById('layers-stack');
  const summaryEl = document.getElementById('stack-summary');
  const tabs = document.querySelectorAll('.model-tab');

  function renderModel(modelKey) {
    const config = MODEL_RULES[modelKey];
    if (!config || !container) return;

    container.innerHTML = '';

    STACK_LAYERS.forEach(layer => {
      const isUserManaged = config.userLayers.includes(layer.id);
      const layerEl = document.createElement('div');
      layerEl.className = `layer-bar ${isUserManaged ? 'managed-user' : 'managed-provider'}`;

      layerEl.innerHTML = `
        <span class="layer-label">
          <span>${isUserManaged ? '👤' : '☁️'}</span>
          <span>${layer.name}</span>
        </span>
        <span class="layer-status">${isUserManaged ? 'You Manage' : 'Provider Manages'}</span>
      `;
      container.appendChild(layerEl);
    });

    if (summaryEl) {
      summaryEl.innerHTML = `<strong>${config.title}:</strong> ${config.desc}`;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const model = tab.getAttribute('data-model');
      renderModel(model);
    });
  });

  // Default to PaaS
  renderModel('paas');
}

/* --------------------------------------------------------------------------
   3. Cloud Cost & Resource Estimator
   -------------------------------------------------------------------------- */
const PROVIDER_RATES = {
  aws: { cpuHourly: 0.032, ramHourly: 0.004, storageMonthly: 0.08, name: 'AWS' },
  gcp: { cpuHourly: 0.030, ramHourly: 0.0042, storageMonthly: 0.075, name: 'GCP' },
  azure: { cpuHourly: 0.033, ramHourly: 0.0039, storageMonthly: 0.082, name: 'Azure' }
};

function initCostEstimator() {
  const providerSelect = document.getElementById('provider-select');
  const sliderCpu = document.getElementById('slider-cpu');
  const sliderRam = document.getElementById('slider-ram');
  const sliderStorage = document.getElementById('slider-storage');
  const sliderHours = document.getElementById('slider-hours');

  const valCpu = document.getElementById('val-cpu');
  const valRam = document.getElementById('val-ram');
  const valStorage = document.getElementById('val-storage');
  const valHours = document.getElementById('val-hours');

  const displayMonthly = document.getElementById('calc-monthly');
  const displayHourly = document.getElementById('calc-hourly');
  const displayCostCpu = document.getElementById('cost-cpu');
  const displayCostRam = document.getElementById('cost-ram');
  const displayCostStorage = document.getElementById('cost-storage');

  function calculate() {
    const providerKey = providerSelect ? providerSelect.value : 'aws';
    const rate = PROVIDER_RATES[providerKey] || PROVIDER_RATES.aws;

    const cpus = parseInt(sliderCpu.value, 10);
    const ram = parseInt(sliderRam.value, 10);
    const storage = parseInt(sliderStorage.value, 10);
    const hoursPerDay = parseInt(sliderHours.value, 10);

    // Update value labels
    if (valCpu) valCpu.textContent = `${cpus} vCPU${cpus > 1 ? 's' : ''}`;
    if (valRam) valRam.textContent = `${ram} GB`;
    if (valStorage) valStorage.textContent = `${storage} GB SSD`;
    if (valHours) {
      valHours.textContent = hoursPerDay === 24 ? '24 Hours (Continuous)' : `${hoursPerDay} Hours / Day`;
    }

    // Calculations
    const hoursInMonth = hoursPerDay * 30.5;
    const cpuCostHourly = cpus * rate.cpuHourly;
    const ramCostHourly = ram * rate.ramHourly;
    const computeHourly = cpuCostHourly + ramCostHourly;

    const monthlyCompute = computeHourly * hoursInMonth;
    const monthlyStorage = storage * rate.storageMonthly;
    const totalMonthly = monthlyCompute + monthlyStorage;

    const effectiveHourly = totalMonthly / (30.5 * 24);

    if (displayMonthly) displayMonthly.textContent = `$${totalMonthly.toFixed(2)} / mo`;
    if (displayHourly) displayHourly.textContent = `(~$${effectiveHourly.toFixed(3)} / hour)`;
    if (displayCostCpu) displayCostCpu.textContent = `$${(cpuCostHourly * hoursInMonth).toFixed(2)}/mo`;
    if (displayCostRam) displayCostRam.textContent = `$${(ramCostHourly * hoursInMonth).toFixed(2)}/mo`;
    if (displayCostStorage) displayCostStorage.textContent = `$${monthlyStorage.toFixed(2)}/mo`;
  }

  [providerSelect, sliderCpu, sliderRam, sliderStorage, sliderHours].forEach(input => {
    if (input) input.addEventListener('input', calculate);
  });

  calculate();
}

/* --------------------------------------------------------------------------
   4. Interactive Cloud Computing Quiz
   -------------------------------------------------------------------------- */
const QUIZ_QUESTIONS = [
  {
    question: "Which NIST cloud characteristic allows computing resources to be provisioned and released automatically based on real-time demand?",
    options: [
      "Broad Network Access",
      "Rapid Elasticity",
      "Resource Pooling",
      "Measured Service"
    ],
    answer: 1,
    explanation: "Rapid Elasticity allows cloud capabilities to be elastically provisioned and released, scaling out or in quickly with fluctuating workload demands."
  },
  {
    question: "In the cloud Shared Responsibility Model, which layer is ALWAYS the customer's responsibility across IaaS, PaaS, and SaaS?",
    options: [
      "Physical Server Maintenance",
      "Customer Data & Access Credentials",
      "Hypervisor Configuration",
      "Operating System Security Patches"
    ],
    answer: 1,
    explanation: "Customer Data, user account security, and access credentials remain the responsibility of the customer across all cloud models (IaaS, PaaS, SaaS)."
  },
  {
    question: "Which of the following services is an example of Platform as a Service (PaaS)?",
    options: [
      "Amazon EC2 Virtual Instances",
      "Google Workspace (Gmail & Docs)",
      "AWS Elastic Beanstalk / Google App Engine",
      "Physical Storage Hard Drives"
    ],
    answer: 2,
    explanation: "AWS Elastic Beanstalk and Google App Engine provide managed platforms where developers deploy code without worrying about server or OS configuration."
  },
  {
    question: "What is the primary financial distinction between On-Premises computing and Cloud Computing?",
    options: [
      "Cloud uses CapEx (Capital Expenditure); On-Premises uses OpEx (Operational Expenditure)",
      "Cloud uses OpEx (Operational Expenditure); On-Premises requires heavy upfront CapEx",
      "Both require identical upfront hardware capital investments",
      "Cloud eliminates networking costs completely"
    ],
    answer: 1,
    explanation: "On-Premises requires upfront capital investment (CapEx) in servers and facilities, whereas Cloud Computing shifts expenses to an operational pay-as-you-go subscription model (OpEx)."
  },
  {
    question: "When an organization retains sensitive records in a private datacenter while offloading peak web traffic to AWS/Azure, which deployment model is being utilized?",
    options: [
      "Community Cloud",
      "Hybrid Cloud",
      "Dedicated Private Cloud",
      "Virtual Private Cloud only"
    ],
    answer: 1,
    explanation: "Hybrid Cloud binds together private and public cloud infrastructure, allowing sensitive data to remain on-premises while leveraging public cloud elasticity ('cloud bursting')."
  }
];

function initQuiz() {
  let currentIdx = 0;
  let score = 0;
  let hasAnswered = false;

  const questionText = document.getElementById('quiz-question-text');
  const optionsContainer = document.getElementById('quiz-options');
  const explanationEl = document.getElementById('quiz-explanation');
  const nextBtn = document.getElementById('btn-next-question');
  const progressFill = document.getElementById('quiz-progress');
  const qNumTracker = document.getElementById('quiz-question-number');
  const scoreTracker = document.getElementById('quiz-score-tracker');

  const quizCard = document.getElementById('quiz-card');
  const resultCard = document.getElementById('quiz-result-card');
  const finalScoreEl = document.getElementById('quiz-final-score');
  const feedbackEl = document.getElementById('quiz-feedback');
  const restartBtn = document.getElementById('btn-restart-quiz');

  function renderQuestion() {
    hasAnswered = false;
    const q = QUIZ_QUESTIONS[currentIdx];

    if (qNumTracker) qNumTracker.textContent = `Question ${currentIdx + 1} of ${QUIZ_QUESTIONS.length}`;
    if (scoreTracker) scoreTracker.textContent = `Score: ${score}`;
    if (progressFill) progressFill.style.width = `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%`;

    if (questionText) questionText.textContent = q.question;
    if (explanationEl) {
      explanationEl.style.display = 'none';
      explanationEl.textContent = '';
    }
    if (nextBtn) nextBtn.style.display = 'none';

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      q.options.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.innerHTML = `<strong>${String.fromCharCode(65 + optIdx)}.</strong> ${optText}`;
        btn.addEventListener('click', () => handleOptionClick(optIdx));
        optionsContainer.appendChild(btn);
      });
    }
  }

  function handleOptionClick(selectedIdx) {
    if (hasAnswered) return;
    hasAnswered = true;

    const q = QUIZ_QUESTIONS[currentIdx];
    const buttons = optionsContainer.querySelectorAll('.quiz-option-btn');

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.answer) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('wrong');
      }
    });

    if (selectedIdx === q.answer) {
      score++;
      if (scoreTracker) scoreTracker.textContent = `Score: ${score}`;
      showToast('Correct answer! +1 point');
    } else {
      showToast('Incorrect answer');
    }

    if (explanationEl) {
      explanationEl.innerHTML = `<strong>💡 Explanation:</strong> ${q.explanation}`;
      explanationEl.style.display = 'block';
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-block';
      nextBtn.textContent = currentIdx === QUIZ_QUESTIONS.length - 1 ? 'View Final Results 🏆' : 'Next Question →';
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIdx < QUIZ_QUESTIONS.length - 1) {
        currentIdx++;
        renderQuestion();
      } else {
        showResults();
      }
    });
  }

  function showResults() {
    if (quizCard) quizCard.style.display = 'none';
    if (resultCard) resultCard.style.display = 'block';

    if (finalScoreEl) {
      finalScoreEl.textContent = `You scored ${score} out of ${QUIZ_QUESTIONS.length} (${Math.round((score / QUIZ_QUESTIONS.length) * 100)}%)`;
    }

    if (feedbackEl) {
      if (score === 5) {
        feedbackEl.textContent = '🌟 Outstanding! You have mastered the core principles of Cloud Computing!';
      } else if (score >= 3) {
        feedbackEl.textContent = '👍 Solid understanding! Review the SPI service models and deployment topologies above.';
      } else {
        feedbackEl.textContent = '📚 Keep learning! Explore the interactive sections and re-take the quiz.';
      }
    }
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      if (quizCard) quizCard.style.display = 'block';
      if (resultCard) resultCard.style.display = 'none';
      renderQuestion();
    });
  }

  renderQuestion();
}

/* --------------------------------------------------------------------------
   5. Toast Notification Helper
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
  }, 2200);
}
