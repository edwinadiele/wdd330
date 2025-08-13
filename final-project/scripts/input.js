  [
    {
      "name": "Nebula Tech",
      "category": "Software",
      "location": "Lagos, Nigeria",
      "logo": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=256&auto=format&fit=crop",
      "website": "https://example.com"
    },
    {
      "name": "Coastal Cafe",
      "category": "Food & Drink",
      "location": "Owerri, Nigeria",
      "logo": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=256&auto=format&fit=crop",
      "website": "https://example.com"
    },
    {
      "name": "GreenPeak Studio",
      "category": "Design",
      "location": "Abuja, Nigeria",
      "logo": "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=256&auto=format&fit=crop",
      "website": "https://example.com"
    },
    {
      "name": "Savanna Fitness",
      "category": "Health",
      "location": "Port Harcourt, Nigeria",
      "logo": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=256&auto=format&fit=crop",
      "website": "https://example.com"
    }
  ]
  

    // ---------- Utilities ----------
    const $ = sel => document.querySelector(sel);
    const $$ = sel => document.querySelectorAll(sel);

    // ---------- Theme (Dark / Light) ----------
    (function initTheme(){
      const root = document.documentElement;
      const saved = localStorage.getItem('theme');
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      if(saved === 'light' || (!saved && prefersLight)) root.classList.add('light');

      const btn = $('#themeBtn');
      const setPressed = () => btn.setAttribute('aria-pressed', root.classList.contains('light') ? 'true' : 'false');
      setPressed();

      btn.addEventListener('click', () => {
        root.classList.toggle('light');
        localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
        setPressed();
      });
    })();

    // ---------- Nav / Hamburger / Current section highlight ----------
    (function initNav(){
      const menuBtn = $('#menuBtn');
      const navList = $('#navList');
      menuBtn.addEventListener('click', () => {
        const open = navList.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });

      // Close menu on link click (mobile)
      navList.addEventListener('click', e => {
        if(e.target.matches('a[data-nav]')) {
          navList.classList.remove('open');
          menuBtn.setAttribute('aria-expanded','false');
        }
      });

      // Highlight current link on hash change
      function updateActive(){
        const hash = window.location.hash || '#home';
        $$('a[data-nav]').forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === hash ? 'page' : 'false'));
      }
      window.addEventListener('hashchange', updateActive);
      updateActive();
    })();

    // ---------- Year in Footer ----------
    $('#year').textContent = new Date().getFullYear();

    // ---------- Directory: Render from JSON + View toggle ----------
    (function initDirectory(){
      const wrap = $('#dirWrap');
      const dataEl = $('#directoryData');
      let items = [];
      try { items = JSON.parse(dataEl.textContent.trim()); } catch(e){ items = []; }

      function makeCard(item){
        const div = document.createElement('article');
        div.className = 'item';
        div.innerHTML = `
          <img loading="lazy" alt="${item.name} logo" src="${item.logo}" width="64" height="64">
          <div>
            <strong>${item.name}</strong><br>
            <span class="meta">${item.location}</span><br>
            <span class="badge">${item.category}</span>
          </div>
          <div style="justify-self:end">
            <a class="btn" href="${item.website}" target="_blank" rel="noopener">Visit</a>
          </div>
        `;
        return div;
      }

      function render(){
        wrap.innerHTML = '';
        items.forEach(it => wrap.appendChild(makeCard(it)));
      }

      render();

      // View toggle with persistence
      const gridBtn = $('#gridBtn');
      const listBtn = $('#listBtn');
      const saved = localStorage.getItem('directoryView') || 'grid';
      setView(saved);

      function setView(view){
        if(view === 'list'){ wrap.classList.add('list'); }
        else { wrap.classList.remove('list'); }
        localStorage.setItem('directoryView', view);
        gridBtn.setAttribute('aria-pressed', view === 'grid' ? 'true' : 'false');
        listBtn.setAttribute('aria-pressed', view === 'list' ? 'true' : 'false');
      }

      gridBtn.addEventListener('click', () => setView('grid'));
      listBtn.addEventListener('click', () => setView('list'));
    })();

    // ---------- Review Form: populate dropdown, validate, count submissions ----------
    (function initReviewForm(){
      const products = [
        { id:'p1', name:'Nebula OS' },
        { id:'p2', name:'Coastal Beans' },
        { id:'p3', name:'GreenPeak Kit' },
        { id:'p4', name:'Savanna Band' },
      ];
      const select = $('#product');
      products.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id; opt.textContent = p.name;
        select.appendChild(opt);
      });

      const form = $('#reviewForm');
      const rating = $('#rating');
      const text = $('#reviewText');
      const msg = $('#reviewMsg');

      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        msg.className = 'helper';

        // Validation
        if(!select.value){ return showError('Please choose a product.'); }
        const r = Number(rating.value);
        if(!Number.isFinite(r) || r < 1 || r > 5){ return showError('Rating must be a number from 1 to 5.'); }
        if(text.value.trim().length < 10){ return showError('Please write at least 10 characters.'); }

        // Count submissions
        const count = Number(localStorage.getItem('reviewCount') || '0') + 1;
        localStorage.setItem('reviewCount', String(count));

        // Simulated "save"
        form.reset();
        msg.className = 'success';
        msg.textContent = `Thanks! Your review was recorded. Total submissions on this device: ${count}.`;
      });

      function showError(t){
        msg.className = 'error';
        msg.textContent = t;
      }
    })();

    // ---------- Contact Form: auto-save draft + confirmation ----------
    (function initContactForm(){
      const form = $('#contactForm');
      const msg = $('#contactMsg');

      // Restore draft
      const draft = JSON.parse(localStorage.getItem('contactDraft') || '{}');
      if(draft.name) $('#name').value = draft.name;
      if(draft.email) $('#email').value = draft.email;
      if(draft.message) $('#message').value = draft.message;

      form.addEventListener('input', ()=>{
        const data = {
          name: $('#name').value.trim(),
          email: $('#email').value.trim(),
          message: $('#message').value.trim()
        };
        localStorage.setItem('contactDraft', JSON.stringify(data));
      });

      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        // naive validation
        if(!$('#name').value.trim() || !$('#email').value.trim() || !$('#message').value.trim()){
          msg.className = 'error';
          msg.textContent = 'Please fill out all fields.';
          return;
        }
        // Simulate "send"
        localStorage.removeItem('contactDraft');
        form.reset();
        msg.className = 'success';
        msg.textContent = 'Thanks! Your message has been sent (simulated).';
      });
    })();

    // ---------- Scroll to section on first load ----------
    if(!location.hash) location.hash = '#home';
