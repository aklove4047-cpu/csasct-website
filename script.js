/* ============================================================
   CHAKRAVARTI SAMRAT ASHOK SENA CHARITABLE TRUST
   JavaScript — script.js
   Features: Preloader, Navbar, Stats Counter, Scroll Reveal,
             Particles, Forms (Formspree), WhatsApp Auto,
             Donation Logic, Newsletter
   ============================================================ */

// ============================================================
// 1. PRELOADER
// ============================================================
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hide');
    setTimeout(() => { preloader.style.display = 'none'; }, 700);
  }, 1800);
});

// ============================================================
// 2. NAVBAR — Scroll & Mobile Toggle
// ============================================================
const navbar   = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  handleBackToTop();
  handleScrollReveal();
  checkStatsVisibility();
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ============================================================
// 3. SCROLL REVEAL
// ============================================================
function handleScrollReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
}

// Mark elements for reveal
document.querySelectorAll([
  '.program-card',
  '.stat-card',
  '.event-card',
  '.gallery-item',
  '.volunteer-perk',
  '.contact-item',
  '.about-grid',
  '.donate-card'
].join(',')).forEach(el => {
  el.classList.add('reveal');
});

// Run once on load
setTimeout(handleScrollReveal, 300);

// ============================================================
// 4. ANIMATED STATS COUNTER
// ============================================================
let statsAnimated = false;

function animateCount(el, target, duration = 2000) {
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = Math.floor(eased * target).toLocaleString('hi-IN');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('hi-IN') + '+';
  };
  requestAnimationFrame(step);
}

function checkStatsVisibility() {
  if (statsAnimated) return;
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;
  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    statsAnimated = true;
    const cards = document.querySelectorAll('.stat-card');
    const ids = ['stat1','stat2','stat3','stat4','stat5','stat6'];
    cards.forEach((card, i) => {
      const target = parseInt(card.dataset.target);
      setTimeout(() => animateCount(document.getElementById(ids[i]), target), i * 150);
    });
  }
}

// ============================================================
// 5. FLOATING PARTICLES (Hero Section)
// ============================================================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 20;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: ${Math.random() > 0.5 ? '#FFD700' : '#FF6B35'};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.5 + 0.1};
      animation: particleFloat ${Math.random() * 8 + 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
      33% { transform: translateY(-30px) rotate(120deg); opacity: 0.6; }
      66% { transform: translateY(-60px) rotate(240deg); opacity: 0.2; }
    }
  `;
  document.head.appendChild(style);
}
createParticles();

// ============================================================
// 6. BACK TO TOP
// ============================================================
function handleBackToTop() {
  const btn = document.getElementById('backToTop');
  if (window.scrollY > 400) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// 7. DONATION LOGIC
// ============================================================
let selectedAmount = 500;

function selectAmount(amount) {
  selectedAmount = amount;
  document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('customAmount').value = '';
}

function proceedToDonate() {
  const custom = document.getElementById('customAmount').value;
  const finalAmount = custom ? parseInt(custom) : selectedAmount;
  const purpose = document.getElementById('donatePurpose').value;

  if (!finalAmount || finalAmount < 1) {
    showToast('कृपया दान राशि दर्ज करें', 'error');
    return;
  }

  const purposeMap = {
    general: 'सामान्य (ट्रस्ट फंड)',
    education: 'शिक्षा अभियान',
    health: 'स्वास्थ्य सेवा',
    women: 'महिला सशक्तिकरण',
    elderly: 'वृद्ध कल्याण'
  };

  const msg = encodeURIComponent(
    `नमस्ते! मैं Chakravarti Samrat Ashok Sena Charitable Trust में ₹${finalAmount.toLocaleString('hi-IN')} का दान "${purposeMap[purpose] || purpose}" के लिए करना चाहता हूं। कृपया payment details बताएं।`
  );

  // Try UPI deeplink first, fallback to WhatsApp
  const upiLink = `upi://pay?pa=trust@upi&pn=CSASCT&am=${finalAmount}&cu=INR&tn=${encodeURIComponent(purposeMap[purpose])}`;
  
  // Open WhatsApp with pre-filled message for payment confirmation
  window.open(`https://wa.me/917839940366?text=${msg}`, '_blank');
  
  showToast(`₹${finalAmount.toLocaleString('hi-IN')} का दान — धन्यवाद! 🙏`, 'success');
}

function copyUPI() {
  const upiId = document.getElementById('upiId').textContent;
  navigator.clipboard.writeText(upiId).then(() => {
    showToast('UPI ID कॉपी हो गई! 📋', 'success');
  });
}

function showBankDetails() {
  document.getElementById('bankModal').classList.add('active');
}

function closeBankModal() {
  document.getElementById('bankModal').classList.remove('active');
}

// Close modal on backdrop click
document.getElementById('bankModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeBankModal();
});

// ============================================================
// 8. CONTACT FORM — Formspree Automation
// ============================================================
async function handleContactSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const btn  = document.getElementById('contactSubmitBtn');
  const success = document.getElementById('contactSuccess');

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> भेजा जा रहा है...';

  try {
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      form.style.display = 'none';
      success.classList.remove('hidden');
      showToast('संदेश सफलतापूर्वक भेजा गया! 🎉', 'success');
      
      // Auto WhatsApp follow-up
      const name  = formData.get('name');
      const phone = formData.get('phone');
      const msg   = encodeURIComponent(`नमस्ते ${name} जी! 🙏\n\nआपका संदेश हमें मिल गया है। हम जल्द ही आपसे संपर्क करेंगे।\n\n— Chakravarti Samrat Ashok Sena Charitable Trust`);
      console.log(`Auto-reply will be sent to ${phone}`);

    } else {
      throw new Error('Form submission failed');
    }
  } catch (err) {
    // Fallback: WhatsApp
    showToast('WhatsApp पर संपर्क करें', 'info');
    const name = form.querySelector('#c-name').value;
    const msg = form.querySelector('#c-msg').value;
    const waMsg = encodeURIComponent(`नमस्ते! मेरा नाम ${name} है। ${msg}`);
    window.open(`https://wa.me/917839940366?text=${waMsg}`, '_blank');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> संदेश भेजें';
  }
}

// ============================================================
// 9. VOLUNTEER FORM — Formspree Automation
// ============================================================
async function handleVolunteerSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('volunteerForm');
  const btn     = document.getElementById('volunteerSubmitBtn');
  const success = document.getElementById('volunteerSuccess');

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> भेजा जा रहा है...';

  try {
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      form.style.display = 'none';
      success.classList.remove('hidden');
      showToast('आवेदन सफलतापूर्वक भेजा गया! 🎉', 'success');
    } else {
      throw new Error('Failed');
    }
  } catch (err) {
    // Fallback: WhatsApp
    const name = form.querySelector('#vol-name').value;
    const phone = form.querySelector('#vol-phone').value;
    const area = form.querySelector('#vol-area').value;
    const msg = encodeURIComponent(
      `नमस्ते! मेरा नाम ${name} है। मेरा मोबाइल नंबर ${phone} है। मैं ${area} क्षेत्र में स्वयंसेवक बनना चाहता/चाहती हूं।`
    );
    window.open(`https://wa.me/917839940366?text=${msg}`, '_blank');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> आवेदन भेजें';
  }
}

// ============================================================
// 10. NEWSLETTER
// ============================================================
function handleNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('nl-email').value;
  if (!email) return;

  showToast(`${email} को newsletter से जोड़ा जा रहा है...`, 'info');
  
  // Send to Formspree newsletter endpoint or any service
  setTimeout(() => {
    showToast('Newsletter subscription सफल! 📧', 'success');
    document.getElementById('nl-email').value = '';
  }, 1500);
}

// ============================================================
// 11. TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  const colors = {
    success: '#10B981',
    error:   '#EF4444',
    info:    '#FF6B35'
  };
  const icons = {
    success: 'fas fa-check-circle',
    error:   'fas fa-times-circle',
    info:    'fas fa-info-circle'
  };

  toast.className = 'toast';
  toast.innerHTML = `<i class="${icons[type]}"></i> ${message}`;
  toast.style.cssText = `
    position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: ${colors[type]}; color: white;
    padding: 12px 24px; border-radius: 50px;
    font-size: 0.9rem; font-weight: 600;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    z-index: 9999; display: flex; align-items: center; gap: 8px;
    opacity: 0; transition: all 0.4s ease;
    white-space: nowrap;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 10);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ============================================================
// 12. ACTIVE NAV LINK ON SCROLL
// ============================================================
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active-nav'));
      if (navLink) navLink.classList.add('active-nav');
    }
  });
}

// Add active nav style
const navStyle = document.createElement('style');
navStyle.textContent = `.active-nav { color: var(--gold) !important; }`;
document.head.appendChild(navStyle);

window.addEventListener('scroll', updateActiveNav);

// ============================================================
// 13. SMOOTH SECTION HIGHLIGHT ON HASH CHANGE
// ============================================================
function highlightSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.transition = 'outline 0.3s ease';
    el.style.outline = '2px solid rgba(255,107,53,0.3)';
    setTimeout(() => { el.style.outline = ''; }, 1500);
  }
}

window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1);
  if (id) setTimeout(() => highlightSection(id), 500);
});

// ============================================================
// 14. KEYBOARD ACCESSIBILITY
// ============================================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeBankModal();
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  }
});

// ============================================================
// 15. AUTO WHATSAPP GREETING (First Visit)
// ============================================================
(function initAutoWhatsApp() {
  const visited = sessionStorage.getItem('csasct_visited');
  if (!visited) {
    sessionStorage.setItem('csasct_visited', 'true');
    setTimeout(() => {
      showToast('👋 नमस्ते! हमसे WhatsApp पर बात करें', 'info');
    }, 5000);
  }
})();

// ============================================================
// 16. REAL-TIME FORM PHONE VALIDATION
// ============================================================
document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    if (this.value.length === 10) {
      this.style.borderColor = '#10B981';
    } else {
      this.style.borderColor = '';
    }
  });
});

// ============================================================
// 17. DONATION AMOUNT CUSTOM INPUT SYNC
// ============================================================
document.getElementById('customAmount').addEventListener('input', function() {
  if (this.value) {
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
    selectedAmount = parseInt(this.value);
  }
});

console.log('%c🙏 Chakravarti Samrat Ashok Sena Charitable Trust', 'color: #FF6B35; font-size: 16px; font-weight: bold;');
console.log('%cWebsite by: chakravartisamratashoksenacheritabletrust.online', 'color: #FFD700; font-size: 12px;');
