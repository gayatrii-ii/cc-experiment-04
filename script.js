// ==========================================================================
// Cloud Computing Lab - Experiment 04
// Interactive Demonstration Logic (Service Start/Stop & Scaling)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initServiceDemonstration();
});

function initServiceDemonstration() {
  const btnStart = document.getElementById('btn-start');
  const btnStop = document.getElementById('btn-stop');
  const statusPill = document.getElementById('service-status');
  const statusMessage = document.getElementById('status-message');
  
  // Scaling elements
  const scalingPanel = document.getElementById('scaling-panel');
  const btnScaleUp = document.getElementById('btn-scale-up');
  const btnScaleDown = document.getElementById('btn-scale-down');
  const instanceCountLabel = document.getElementById('instance-count');
  const instancesContainer = document.getElementById('instances-container');

  let isRunning = false;
  let activeInstances = 1;
  const MAX_INSTANCES = 4;
  const MIN_INSTANCES = 1;

  // 1. Start Cloud Service Handler
  btnStart.addEventListener('click', () => {
    isRunning = true;
    
    // Update status badge
    statusPill.textContent = 'Service Status: Running';
    statusPill.classList.remove('status-stopped');
    statusPill.classList.add('status-running');

    // Update message
    statusMessage.textContent = 'The cloud service has been provisioned and is currently running.';
    statusMessage.style.color = '#059669';

    // Toggle button states
    btnStart.disabled = true;
    btnStop.disabled = false;

    // Show scaling panel
    if (scalingPanel) {
      scalingPanel.classList.add('active');
    }
  });

  // 2. Stop Cloud Service Handler
  btnStop.addEventListener('click', () => {
    isRunning = false;

    // Update status badge
    statusPill.textContent = 'Service Status: Stopped';
    statusPill.classList.remove('status-running');
    statusPill.classList.add('status-stopped');

    // Update message
    statusMessage.textContent = 'The service is currently inactive.';
    statusMessage.style.color = '#64748b';

    // Toggle button states
    btnStart.disabled = false;
    btnStop.disabled = true;

    // Reset and hide scaling panel
    if (scalingPanel) {
      scalingPanel.classList.remove('active');
      activeInstances = 1;
      updateInstances();
    }
  });

  // 3. Scaling Controls Handler
  function updateInstances() {
    if (instanceCountLabel) {
      instanceCountLabel.textContent = `${activeInstances} Active Instance${activeInstances > 1 ? 's' : ''}`;
    }

    if (btnScaleDown) {
      btnScaleDown.disabled = activeInstances <= MIN_INSTANCES;
    }
    if (btnScaleUp) {
      btnScaleUp.disabled = activeInstances >= MAX_INSTANCES;
    }

    if (instancesContainer) {
      instancesContainer.innerHTML = '';
      for (let i = 1; i <= activeInstances; i++) {
        const box = document.createElement('div');
        box.className = 'instance-box active';
        box.innerHTML = `
          <span class="instance-icon">🖥️</span>
          <span class="instance-name">Instance-0${i} ${i === 1 ? '(Primary)' : '(Replica)'}</span>
          <span class="instance-state">Healthy</span>
        `;
        instancesContainer.appendChild(box);
      }
    }
  }

  if (btnScaleUp) {
    btnScaleUp.addEventListener('click', () => {
      if (activeInstances < MAX_INSTANCES) {
        activeInstances++;
        updateInstances();
        statusMessage.textContent = `Scale-Out event: Provisioned Instance-0${activeInstances} to handle incoming web traffic.`;
      }
    });
  }

  if (btnScaleDown) {
    btnScaleDown.addEventListener('click', () => {
      if (activeInstances > MIN_INSTANCES) {
        activeInstances--;
        updateInstances();
        statusMessage.textContent = `Scale-In event: Safely de-provisioned idle instance to reduce cloud cost.`;
      }
    });
  }
}
