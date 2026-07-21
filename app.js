(function () {
  'use strict';

  var STORAGE_KEY = 'persistent-form-data';
  var TOTAL_STEPS = 3;

  var currentStep = 1;

  var formFields = [
    'fullName', 'email', 'phone', 'age', 'gender',
    'role', 'experience', 'notifyEmail', 'notifySms', 'notifyNewsletter', 'theme'
  ];

  /* ============================================
     DOM References
     ============================================ */
  var els = {
    stepCards: [null, document.getElementById('step1'), document.getElementById('step2'), document.getElementById('step3')],
    successState: document.getElementById('successState'),
    footerActions: document.getElementById('footerActions'),
    stepperLineFill: document.getElementById('stepperLineFill'),
    progressRingFill: document.getElementById('progressRingFill'),
    progressPercent: document.getElementById('progressPercent'),
    progressStepLabel: document.getElementById('progressStepLabel'),
    clearFormBtn: document.getElementById('clearFormBtn'),
    clearDialog: document.getElementById('clearDialog'),
    cancelClear: document.getElementById('cancelClear'),
    confirmClear: document.getElementById('confirmClear'),
    submitForm: document.getElementById('submitForm'),
    startNew: document.getElementById('startNew'),
    footerPrev: document.getElementById('footerPrev'),
    footerNext: document.getElementById('footerNext'),
    age: document.getElementById('age'),
    stepItems: document.querySelectorAll('.step-item')
  };

  /* ============================================
     Initialize
     ============================================ */
  function init() {
    populateAgeDropdown();
    loadSavedData();
    bindEvents();
    lucide.createIcons();
    goToStep(currentStep, false);
  }

  /* ============================================
     Age Dropdown
     ============================================ */
  function populateAgeDropdown() {
    var fragment = document.createDocumentFragment();
    for (var i = 18; i <= 80; i++) {
      var opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = String(i);
      fragment.appendChild(opt);
    }
    els.age.appendChild(fragment);
  }

  /* ============================================
     localStorage
     ============================================ */
  function loadSavedData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var data = JSON.parse(raw);
      if (data && typeof data === 'object') {
        populateForm(data);
        if (data.currentStep && data.currentStep >= 1 && data.currentStep <= TOTAL_STEPS) {
          currentStep = data.currentStep;
        }
      }
    } catch (e) {
      // corrupt data — ignore
    }
  }

  function saveToStorage() {
    var data = collectFormData();
    data.currentStep = currentStep;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // storage full — fail silently
    }
  }

  function clearStorage() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }

  /* ============================================
     Collect & Populate
     ============================================ */
  function collectFormData() {
    var data = {};
    formFields.forEach(function (key) {
      var el = document.getElementById(key);
      if (!el) return;
      if (el.type === 'checkbox') {
        data[key] = el.checked;
      } else if (el.tagName === 'SELECT') {
        data[key] = el.value;
      } else {
        data[key] = el.value;
      }
    });
    return data;
  }

  function populateForm(data) {
    formFields.forEach(function (key) {
      var el = document.getElementById(key);
      if (!el || data[key] === undefined || data[key] === null) return;
      if (el.type === 'checkbox') {
        el.checked = Boolean(data[key]);
      } else {
        el.value = String(data[key]);
      }
    });
  }

  /* ============================================
     Step Navigation
     ============================================ */
  function goToStep(step, animate) {
    if (step < 1 || step > TOTAL_STEPS) return;
    currentStep = step;
    saveToStorage();

    els.stepCards.forEach(function (card, i) {
      if (card) card.classList.toggle('hidden', i !== step);
    });

    els.stepItems.forEach(function (item) {
      var s = parseInt(item.getAttribute('data-step'), 10);
      item.classList.remove('active', 'completed');
      if (s === step) {
        item.classList.add('active');
        item.querySelector('.step-circle').setAttribute('aria-current', 'step');
      } else {
        item.querySelector('.step-circle').removeAttribute('aria-current');
        if (s < step) item.classList.add('completed');
      }
    });

    var linePercent = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
    els.stepperLineFill.style.width = linePercent + '%';

    updateProgressRing(step);
    updateFooterNav(step);

    if (step === TOTAL_STEPS) {
      populateReview();
    }

    window.scrollTo({ top: 0, behavior: animate !== false ? 'smooth' : 'auto' });
  }

  /* ============================================
     Progress Ring
     ============================================ */
  function updateProgressRing(step) {
    var circumference = 2 * Math.PI * 52;
    var percent = Math.round((step / TOTAL_STEPS) * 100);
    var offset = circumference * (1 - step / TOTAL_STEPS);

    els.progressRingFill.style.strokeDashoffset = offset;
    els.progressPercent.textContent = percent + '%';
    els.progressStepLabel.textContent = 'Step ' + step + ' of ' + TOTAL_STEPS;
  }

  /* ============================================
     Footer Navigation
     ============================================ */
  function updateFooterNav(step) {
    var isReview = step === TOTAL_STEPS;
    var prevBtn = els.footerPrev;
    var nextBtn = els.footerNext;

    prevBtn.style.display = step === 1 ? 'none' : 'inline-flex';

    if (isReview) {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'inline-flex';
      nextBtn.querySelector('span').textContent = 'Next Step';
    }
  }

  /* ============================================
     Review Step
     ============================================ */
  function populateReview() {
    var data = collectFormData();
    setText('reviewFullName', data.fullName || '—');
    setText('reviewEmail', data.email || '—');
    setText('reviewPhone', data.phone || '—');
    setText('reviewAge', data.age ? data.age + ' years' : '—');
    setText('reviewGender', data.gender || '—');
    setText('reviewRole', formatSelect(data.role));
    setText('reviewExperience', formatSelect(data.experience));
    setText('reviewTheme', formatSelect(data.theme));
    setText('reviewNotifications', formatNotifications(data));
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function formatSelect(val) {
    if (!val) return '—';
    return val.charAt(0).toUpperCase() + val.slice(1);
  }

  function formatNotifications(data) {
    var items = [];
    if (data.notifyEmail) items.push('Email');
    if (data.notifySms) items.push('SMS');
    if (data.notifyNewsletter) items.push('Newsletter');
    return items.length ? items.join(', ') : 'None selected';
  }

  /* ============================================
     Clear Form
     ============================================ */
  function openClearDialog() {
    els.clearDialog.showModal();
  }

  function closeClearDialog() {
    els.clearDialog.close();
  }

  function clearAll() {
    formFields.forEach(function (key) {
      var el = document.getElementById(key);
      if (!el) return;
      if (el.type === 'checkbox') {
        el.checked = false;
      } else if (el.tagName === 'SELECT') {
        el.selectedIndex = 0;
      } else {
        el.value = '';
      }
    });
    clearStorage();
    currentStep = 1;
    goToStep(1, false);
    closeClearDialog();
  }

  /* ============================================
     Submit
     ============================================ */
  function handleSubmit() {
    clearStorage();
    els.stepCards.forEach(function (card) {
      if (card) card.classList.add('hidden');
    });
    els.successState.classList.remove('hidden');
    els.footerActions.style.display = 'none';

    els.stepItems.forEach(function (item) {
      item.classList.remove('active');
      item.classList.add('completed');
    });
    els.stepperLineFill.style.width = '100%';
    updateProgressRing(TOTAL_STEPS);

    lucide.createIcons();
  }

  function startNewForm() {
    formFields.forEach(function (key) {
      var el = document.getElementById(key);
      if (!el) return;
      if (el.type === 'checkbox') {
        el.checked = false;
      } else if (el.tagName === 'SELECT') {
        el.selectedIndex = 0;
      } else {
        el.value = '';
      }
    });
    els.successState.classList.add('hidden');
    els.footerActions.style.display = '';
    currentStep = 1;
    goToStep(1, false);
  }

  /* ============================================
     Event Binding
     ============================================ */
  function bindEvents() {
    // Auto-save on every input/change
    formFields.forEach(function (key) {
      var el = document.getElementById(key);
      if (!el) return;
      var evtType = (el.type === 'checkbox' || el.tagName === 'SELECT') ? 'change' : 'input';
      el.addEventListener(evtType, saveToStorage);
    });

    // Step buttons inside cards
    document.getElementById('nextToStep2').addEventListener('click', function () { goToStep(2); });
    document.getElementById('nextToStep3').addEventListener('click', function () { goToStep(3); });
    document.getElementById('backToStep1').addEventListener('click', function () { goToStep(1); });
    document.getElementById('backToStep2').addEventListener('click', function () { goToStep(2); });

    // Footer nav
    els.footerPrev.addEventListener('click', function () { goToStep(currentStep - 1); });
    els.footerNext.addEventListener('click', function () { goToStep(currentStep + 1); });

    // Stepper clicks
    els.stepItems.forEach(function (item) {
      item.querySelector('.step-circle').addEventListener('click', function () {
        var target = parseInt(item.getAttribute('data-step'), 10);
        if (target <= currentStep) goToStep(target);
      });
    });

    // Clear form
    els.clearFormBtn.addEventListener('click', openClearDialog);
    els.cancelClear.addEventListener('click', closeClearDialog);
    els.confirmClear.addEventListener('click', clearAll);

    // Submit
    els.submitForm.addEventListener('click', handleSubmit);

    // Start new
    els.startNew.addEventListener('click', startNewForm);

    // Close dialog on backdrop click
    els.clearDialog.addEventListener('click', function (e) {
      if (e.target === els.clearDialog) closeClearDialog();
    });
  }

  /* ============================================
     Boot
     ============================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
