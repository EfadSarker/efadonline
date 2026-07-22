(function(){
  "use strict";

  /* ---------- Preloader ---------- */
  window.addEventListener('load', function(){
    var pre = document.getElementById('preloader');
    setTimeout(function(){ pre.classList.add('hide'); }, 600);
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Scroll progress + header state ---------- */
  var header = document.getElementById('siteHeader');
  var progress = document.getElementById('scroll-progress');
  function onScroll(){
    var h = document.documentElement;
    var scrollPct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = scrollPct + '%';
    header.classList.toggle('scrolled', h.scrollTop > 40);
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');
  navToggle.addEventListener('click', function(){
    var open = siteNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.nav-link').forEach(function(link){
    link.addEventListener('click', function(){
      siteNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  var navObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        navLinks.forEach(function(l){ l.classList.remove('active'); });
        var active = document.querySelector('.nav-link[data-sec="'+entry.target.id+'"]');
        if(active) active.classList.add('active');
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px'});
  sections.forEach(function(s){ navObserver.observe(s); });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  var revealObserver = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  revealEls.forEach(function(el){ revealObserver.observe(el); });

  /* ---------- Stat counters ---------- */
  var statEls = document.querySelectorAll('.stat-num');
  var statObserver = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffixEl = el.querySelector('.grad');
        var suffix = suffixEl ? suffixEl.outerHTML : '';
        var current = 0;
        var duration = 1400;
        var startTime = null;
        function step(ts){
          if(!startTime) startTime = ts;
          var progressPct = Math.min((ts - startTime) / duration, 1);
          current = Math.floor(progressPct * target);
          el.innerHTML = current + suffix;
          if(progressPct < 1) requestAnimationFrame(step);
          else el.innerHTML = target + suffix;
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, {threshold:0.4});
  statEls.forEach(function(el){ statObserver.observe(el); });

  /* ---------- Skill bars ---------- */
  var skillBars = document.querySelectorAll('.skill-bar-fill');
  var skillObserver = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.style.width = entry.target.getAttribute('data-width') + '%';
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.3});
  skillBars.forEach(function(el){ skillObserver.observe(el); });

  /* ---------- Typing animation ---------- */
  var roles = ['Digital Marketing Intern', 'Multimedia Journalist', 'Marketing Strategist', 'Content Creator'];
  var roleEl = document.getElementById('typedRole');
  var ri = 0, ci = 0, deleting = false;
  function typeLoop(){
    var current = roles[ri];
    if(!deleting){
      ci++;
      roleEl.textContent = current.slice(0, ci);
      if(ci === current.length){ deleting = true; setTimeout(typeLoop, 1500); return; }
    } else {
      ci--;
      roleEl.textContent = current.slice(0, ci);
      if(ci === 0){ deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(typeLoop, deleting ? 40 : 75);
  }
  setTimeout(typeLoop, 900);

  /* ---------- Mouse glow + custom cursor (desktop only) ---------- */
  var isTouch = window.matchMedia('(pointer: coarse)').matches;
  var mouseGlow = document.getElementById('mouseGlow');
  var cursorDot = document.getElementById('cursor-dot');
  var cursorRing = document.getElementById('cursor-ring');
  if(!isTouch){
    document.documentElement.classList.add('has-cursor');
    var mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', function(e){
      mx = e.clientX; my = e.clientY;
      mouseGlow.style.left = mx + 'px';
      mouseGlow.style.top = my + 'px';
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
    });
    function ringLoop(){
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
      requestAnimationFrame(ringLoop);
    }
    ringLoop();
    document.querySelectorAll('a, button, .glass').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cursorRing.classList.add('active'); });
      el.addEventListener('mouseleave', function(){ cursorRing.classList.remove('active'); });
    });
  } else {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
    mouseGlow.style.display = 'none';
  }

  /* ---------- Particle background ---------- */
  var canvas = document.getElementById('bg-canvas');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var W, H;
  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = document.documentElement.scrollHeight;
  }
  function initParticles(){
    particles = [];
    var count = Math.min(70, Math.floor((W*H)/38000));
    for(var i=0;i<count;i++){
      particles.push({
        x: Math.random()*W, y: Math.random()*H,
        r: Math.random()*1.6+0.4,
        vx: (Math.random()-0.5)*0.15,
        vy: (Math.random()-0.5)*0.15,
        hue: Math.random() > 0.5 ? '79,124,255' : '34,224,224'
      });
    }
  }
  function drawParticles(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(function(p){
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0) p.x = W; if(p.x > W) p.x = 0;
      if(p.y < 0) p.y = H; if(p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba('+p.hue+',0.5)';
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  window.addEventListener('resize', function(){ resize(); initParticles(); });
  resize(); initParticles();
  drawParticles();

  /* ---------- Back to top ---------- */
  document.getElementById('back-to-top').addEventListener('click', function(){
    window.scrollTo({top:0, behavior:'smooth'});
  });

  /* ---------- Download CV button ---------- */
  document.getElementById('downloadCvBtn').addEventListener('click', function(e){
    e.preventDefault();
    alert('Add your CV PDF file to the project folder and update the Download CV button link to point to it.');
  });

  /* ---------- Contact form (mailto handoff, no backend) ---------- */
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('cf-name').value.trim();
    var email = document.getElementById('cf-email').value.trim();
    var subject = document.getElementById('cf-subject').value.trim();
    var message = document.getElementById('cf-message').value.trim();
    var note = document.getElementById('formNote');
    if(!name || !email || !subject || !message){
      note.textContent = 'Please fill in every field before sending.';
      note.style.color = '#f87171';
      return;
    }
    var body = encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')');
    var mailto = 'mailto:mdefads@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + body;
    window.location.href = mailto;
    note.textContent = 'Opening your email client...';
    note.style.color = 'var(--cyan)';
  });

})();
