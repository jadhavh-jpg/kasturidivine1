const CLIENT_ID = "90337719169-46noqr1o6if5rf0n3d5ldr75eheg28nl.apps.googleusercontent.com";

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if(target){ e.preventDefault(); target.scrollIntoView({behavior: 'smooth'}); }
  });
});

// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('header .nav');
toggle.addEventListener('click', () => nav.classList.toggle('open'));

// --- Auth & LMS ---
const userChip = document.getElementById('userChip');
const userPic  = document.getElementById('userPic');
const userName = document.getElementById('userName');
const logoutBtn= document.getElementById('logoutBtn');
const lmsGate  = document.getElementById('lmsGate');
const lmsContent = document.getElementById('lmsContent');

// Demo LMS videos (replace with your own URLs)
const videos = [
  { title: 'Basics of Astrology – Session 1', url: 'https://www.youtube.com/watch?v=fDEQWNFNHVo' },
  { title: 'Remedies Workshop – Part A', url: 'https://www.youtube.com/embed/4qAtW5M2zq4' },
  { title: 'Q&A with Mentors', url: 'https://www.youtube.com/embed/tU1Q75MDdK4' }
];

function renderLMS(){
  lmsContent.innerHTML = '';
  videos.forEach(v => {
    const card = document.createElement('div');
    card.className = 'lms-card';
    card.innerHTML = `<iframe src="${v.url}" allowfullscreen></iframe><div class="meta">${v.title}</div>`;
    lmsContent.appendChild(card);
  });
}

// Restore session
(function initAuth(){
  try{
    const raw = localStorage.getItem('kd_user');
    if(raw){
      const u = JSON.parse(raw);
      setUser(u);
    } else {
      clearUser();
    }
  }catch(e){ clearUser(); }
})();

// Google Sign-In callback
window.onGoogleSignIn = (response) => {
  // WARNING: For production, verify the ID token on a server!
  // Here, we decode payload client-side for demo gating only.
  try{
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const u = {
      name: payload.name || 'Member',
      email: payload.email,
      picture: payload.picture || ''
    };
    localStorage.setItem('kd_user', JSON.stringify(u));
    setUser(u);
  }catch(e){
    alert('Sign-in failed. Try again.');
  }
};

function setUser(u){
  userName.textContent = u.name;
  if(u.picture){ userPic.src = u.picture; userPic.hidden = false; } else { userPic.hidden = true; }
  userChip.hidden = false;
  document.querySelector('.g_id_signin').style.display = 'none';
  lmsGate.hidden = true;
  lmsContent.hidden = false;
  renderLMS();
}

function clearUser(){
  userChip.hidden = true;
  document.querySelector('.g_id_signin').style.display = 'block';
  lmsGate.hidden = false;
  lmsContent.hidden = true;
  lmsContent.innerHTML = '';
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('kd_user');
  clearUser();
});
