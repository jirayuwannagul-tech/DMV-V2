/**
 * home.js — Logic สำหรับหน้าหลัก (index.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  renderLicenseGrid();
  initSupportModal();
});

function renderLicenseGrid() {
  const grid = document.getElementById('license-grid');
  if (!grid) return;

  LICENSE_TYPES.forEach(lic => {
    const anyAvailable = Object.values(lic.modes).some(m => m.available && m.url);
    const card = document.createElement('a');
    card.className = 'license-card';
    card.href = `license.html?type=${lic.id}`;
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', lic.name);
    card.style.setProperty('--card-color', lic.color);

    card.innerHTML = `
      <div class="license-card-top"></div>
      <div class="license-card-body">
        <div class="license-card-icon">${lic.icon}</div>
        <div class="license-card-code">${lic.code}</div>
        <div class="license-card-name">${lic.name.replace(/^[^—]+— /, '')}</div>
        <div class="license-card-desc">${lic.desc}</div>
        <div class="license-card-footer">
          <span class="license-card-status ${anyAvailable ? 'status-available' : 'status-soon'}">
            ${anyAvailable ? 'พร้อมใช้งาน' : 'เร็ว ๆ นี้'}
          </span>
          <svg class="license-card-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initSupportModal() {
  const openBtn = document.getElementById('support-open');
  const modal = document.getElementById('support-modal');
  if (!openBtn || !modal) return;

  const closeTargets = modal.querySelectorAll('[data-support-close]');

  openBtn.addEventListener('click', () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  });

  closeTargets.forEach((target) => {
    target.addEventListener('click', () => closeSupportModal(modal));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeSupportModal(modal);
    }
  });
}

function closeSupportModal(modal) {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}
