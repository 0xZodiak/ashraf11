document.addEventListener('DOMContentLoaded', () => {
  /* --- Navbar Scroll Effect --- */
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
    // Check on load
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    }
  }

  /* --- Mobile Menu Toggle --- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });
  }

  /* --- Animate Elements on Scroll (Optional generic intersection observer) --- */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  /* Note: adding a class .fade-in-up in CSS if needed */

  /* --- Property Card Flip Logic --- */
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.property-card');
    if (card) {
      // Prevent flip if clicking the WhatsApp button (let it open the link)
      if (e.target.closest('.btn-whatsapp')) return;
      
      card.classList.toggle('flipped');
    }
  });
});


/* ============================
   Real Estate Property Filter
============================ */
function filterProperties(btn) {
  // Toggle active tab
  document.querySelectorAll('.re-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const filter = btn.dataset.filter;
  const msg = document.getElementById('reFilterMsg');
  const accordions = document.querySelectorAll('.accordion-item');

  // Get or create the flat results container
  let flatGrid = document.getElementById('reFilterGrid');
  if (!flatGrid) {
    flatGrid = document.createElement('div');
    flatGrid.id = 'reFilterGrid';
    flatGrid.style.cssText = 'display:none; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; margin-top: 30px;';
    document.getElementById('reFilterMsg').after(flatGrid);
  }

  if (filter === 'all') {
    // Show accordions, hide flat grid
    accordions.forEach(acc => acc.style.display = '');
    flatGrid.style.display = 'none';
    msg.style.display = 'none';
    return;
  }

  // Hide all accordion sections
  accordions.forEach(acc => acc.style.display = 'none');

  // Collect matching cards
  const matchingCards = Array.from(document.querySelectorAll('.property-card[data-type]'))
    .filter(card => card.dataset.type === filter);

  if (matchingCards.length === 0) {
    flatGrid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:40px 20px; color:#888;">
        <i class="fas fa-search" style="font-size:3rem; display:block; margin-bottom:15px; color:#555;"></i>
        <h4 style="color:#ccc; margin-bottom:10px;">لا يوجد من هذا النوع حالياً</h4>
        <p style="color:#777;">تواصل معنا وسنوفر لك ما تريد</p>
        <a href="https://wa.me/201114570201" class="btn btn-whatsapp" style="display:inline-flex; margin-top:20px;">
          <i class="fab fa-whatsapp"></i> تواصل معنا
        </a>
      </div>`;
    flatGrid.style.display = 'grid';
    msg.style.display = 'none';
    return;
  }

  // Clone and display matching cards in flat grid
  flatGrid.innerHTML = '';
  matchingCards.forEach(card => {
    flatGrid.appendChild(card.cloneNode(true));
  });
  flatGrid.style.display = 'grid';

  const labels = { land: 'الأراضي', apartment: 'الشقق', villa: 'الفيلل', commercial: 'المحلات التجارية' };
  msg.textContent = `عرض ${matchingCards.length} عقار من نوع: ${labels[filter] || filter}`;
  msg.style.display = 'block';
}
