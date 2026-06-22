const pages = {
  home: document.querySelector('#home-page'),
  analysis: document.querySelector('#analysis-page')
};
const pageButtons = document.querySelectorAll('[data-page]');
const navLinks = document.querySelectorAll('.nav-link[data-page]');

function showPage(name){
  Object.values(pages).forEach(page => page.classList.remove('active-page'));
  pages[name]?.classList.add('active-page');
  navLinks.forEach(link => link.classList.toggle('active', link.dataset.page === name));
  window.scrollTo({top:0, behavior:'smooth'});
  history.replaceState(null, '', `#${name}`);
}

pageButtons.forEach(button => button.addEventListener('click', () => showPage(button.dataset.page)));
showPage(location.hash.replace('#','') === 'analysis' ? 'analysis' : 'home');

document.querySelectorAll('.product-card button').forEach(button => {
  button.addEventListener('click', () => alert('구매 페이지 연결 영역입니다.'));
});
