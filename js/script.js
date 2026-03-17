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

  /* --- Accordion Toggle Logic --- */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all other accordions (optional: remove this block to allow multiple open)
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle clicked accordion
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* --- Property Card Flip Logic --- */
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.property-card');
    if (card) {
      // Prevent flip if clicking the WhatsApp button (let it open the link)
      if (e.target.closest('.btn-whatsapp')) return;
      // Prevent flip if clicking accordion header
      if (e.target.closest('.accordion-header')) return;
      
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

  let matchCount = 0;

  if (filter === 'all') {
    // Show all accordions and all cards within them
    accordions.forEach(acc => {
      acc.style.display = '';
      // Also ensure content is visible if it was hidden
      const content = acc.querySelector('.accordion-content');
      if(content) content.style.display = '';
      
      const cards = acc.querySelectorAll('.property-card[data-type]');
      cards.forEach(card => card.classList.remove('hidden-card'));
    });
    msg.style.display = 'none';
    
    // Hide the empty state message if it exists
    const emptyMsg = document.getElementById('reEmptyMsg');
    if(emptyMsg) emptyMsg.style.display = 'none';
    return;
  }

  // Handle specific filters
  accordions.forEach(acc => {
    let hasVisibleCards = false;
    const cards = acc.querySelectorAll('.property-card[data-type]');
    
    cards.forEach(card => {
      if (card.dataset.type === filter) {
        card.classList.remove('hidden-card');
        hasVisibleCards = true;
        matchCount++;
      } else {
        card.classList.add('hidden-card');
      }
    });

    // Hide the entire accordion section if it has no matching cards
    if (hasVisibleCards) {
      acc.style.display = '';
      // Ensure the accordion content is visible (force open when filtering)
      acc.classList.add('active');
    } else {
      acc.style.display = 'none';
    }
  });

  // Handle empty state
  let emptyMsg = document.getElementById('reEmptyMsg');
  if (matchCount === 0) {
    if (!emptyMsg) {
      // Create empty message container only when needed
      const container = document.querySelector('.re-filter-header').parentNode;
      emptyMsg = document.createElement('div');
      emptyMsg.id = 'reEmptyMsg';
      emptyMsg.style.cssText = 'text-align:center; padding:40px 20px; color:#888; margin-top: 30px;';
      emptyMsg.innerHTML = `
        <i class="fas fa-search" style="font-size:3rem; display:block; margin-bottom:15px; color:#555;"></i>
        <h4 style="color:#ccc; margin-bottom:10px; font-size:1.5rem;">لا يوجد من هذا النوع حالياً</h4>
        <p style="color:#777; font-size:1.1rem;">تواصل معنا وسنوفر لك ما تريد</p>
        <a href="https://wa.me/201114570201" class="btn btn-whatsapp" style="display:inline-flex; margin-top:20px;">
          <i class="fab fa-whatsapp"></i> تواصل معنا
        </a>`;
      // Insert after the accordions or filter header (finding appropriate place)
      const lastAccordion = Array.from(accordions).pop();
      if(lastAccordion) {
          lastAccordion.parentNode.insertBefore(emptyMsg, lastAccordion.nextSibling);
      }
    }
    emptyMsg.style.display = 'block';
  } else {
    // Hide empty state if there are matches
    if(emptyMsg) emptyMsg.style.display = 'none';
  }

  const labels = { land: 'الأراضي', apartment: 'الشقق', villa: 'الفيلل', commercial: 'المحلات التجارية' };
  msg.textContent = `عرض ${matchCount} عقار من نوع: ${labels[filter] || filter}`;
  msg.style.display = 'block';
}
