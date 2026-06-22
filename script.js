const pages = {
  home: document.querySelector('#home-page'),
  quiz: document.querySelector('#quiz-page'),
  result: document.querySelector('#result-page'),
};

const navLinks = document.querySelectorAll('.nav-link[data-page]');
const pageButtons = document.querySelectorAll('[data-page]');
const toast = document.querySelector('#toast');

const questions = [
  {
    axis: 'wc',
    title: '어떤 렌즈 컬러가 더 끌리나요?',
    description: '평소 메이크업과 옷 스타일을 떠올리며 골라주세요.',
    options: [
      { value: 'W', icon: '☀️', title: '따뜻한 브라운 계열', text: '골드, 코랄, 베이지처럼 포근하고 따뜻한 색감' },
      { value: 'C', icon: '❄️', title: '차분한 그레이 계열', text: '애쉬, 블루, 라벤더처럼 시원하고 맑은 색감' },
    ],
  },
  {
    axis: 'eu',
    title: '렌즈를 착용했을 때 원하는 분위기는?',
    description: '가장 자주 렌즈를 착용하는 상황을 기준으로 골라주세요.',
    options: [
      { value: 'E', icon: '🌿', title: 'Everyday', text: '매일 부담 없이 자연스럽고 편안한 분위기' },
      { value: 'U', icon: '✨', title: 'Unique', text: '사진과 특별한 날에 눈에 띄는 개성 있는 분위기' },
    ],
  },
  {
    axis: 'pk',
    title: '내가 원하는 눈매 이미지는?',
    description: '원래 얼굴형보다 연출하고 싶은 인상을 기준으로 골라주세요.',
    options: [
      { value: 'P', icon: '🐶', title: 'Puppy', text: '둥글고 부드러우며 친근한 강아지상 이미지' },
      { value: 'K', icon: '🐱', title: 'Kitty', text: '길고 또렷하며 세련된 고양이상 이미지' },
    ],
  },
  {
    axis: 'lm',
    title: '선호하는 렌즈 확대감은?',
    description: '그래픽 직경과 또렷함을 기준으로 골라주세요.',
    options: [
      { value: 'L', icon: '◉', title: 'Large', text: '확실한 확대감으로 눈동자를 또렷하게 강조' },
      { value: 'M', icon: '○', title: 'Medium', text: '적당한 확대감으로 자연스러운 균형을 유지' },
    ],
  },
];

const typeData = {
  WEPL: { name: '포근한 밀크 브라운 타입', description: '따뜻하고 부드러운 인상을 살려주는 자연스러운 브라운 렌즈를 추천해요.' },
  WEPM: { name: '내추럴 코코아 타입', description: '부담 없는 확대감과 따뜻한 컬러가 어우러진 데일리 렌즈가 잘 어울려요.' },
  WEKL: { name: '선명한 카라멜 캣 타입', description: '따뜻한 카라멜 컬러와 또렷한 테두리로 세련된 눈매를 연출해 보세요.' },
  WEKM: { name: '차분한 허니 캣 타입', description: '은은한 브라운과 자연스러운 직경으로 또렷하지만 편안한 인상을 만들어요.' },
  WUPL: { name: '러블리 코랄 브라운 타입', description: '따뜻한 포인트 컬러와 큰 그래픽으로 사랑스럽고 특별한 분위기를 완성해요.' },
  WUPM: { name: '피치 글로우 타입', description: '코랄빛 포인트와 적당한 확대감으로 화사한 개성을 표현해 보세요.' },
  WUKL: { name: '골든 카라멜 캣 타입', description: '골드와 카라멜 컬러가 조합된 선명한 렌즈로 존재감을 높여보세요.' },
  WUKM: { name: '앰버 시크 타입', description: '앰버 브라운의 유니크함과 자연스러운 직경을 함께 즐기는 타입이에요.' },
  CEPL: { name: '맑은 애쉬 퍼피 타입', description: '차분한 애쉬 컬러와 부드러운 디자인으로 맑고 친근한 인상을 연출해요.' },
  CEPM: { name: '데일리 소프트 그레이 타입', description: '자연스러운 회색빛과 적당한 확대감으로 매일 편하게 착용하기 좋아요.' },
  CEKL: { name: '클리어 그레이 캣 타입', description: '맑은 회색과 또렷한 라인으로 세련되고 선명한 눈매를 만들어 보세요.' },
  CEKM: { name: '모던 애쉬 타입', description: '차분하고 도회적인 애쉬 컬러가 자연스러운 눈매와 잘 어울려요.' },
  CUPL: { name: '라벤더 드림 타입', description: '쿨한 컬러와 큰 직경으로 몽환적이고 사랑스러운 분위기를 연출해요.' },
  CUPM: { name: '미스티 블루 타입', description: '은은한 블루·그레이 컬러로 과하지 않게 특별한 포인트를 더해요.' },
  CUKL: { name: '문라이트 캣 타입', description: '차가운 컬러와 선명한 디자인으로 신비롭고 시크한 인상을 완성해요.' },
  CUKM: { name: '시크 애쉬 바이올렛 타입', description: '애쉬 바이올렛의 개성과 자연스러운 직경을 함께 즐기는 타입이에요.' },
};

let currentQuestion = 0;
const answers = {};

function showPage(name) {
  Object.values(pages).forEach((page) => page.classList.remove('active-page'));
  pages[name]?.classList.add('active-page');
  navLinks.forEach((link) => link.classList.toggle('active', link.dataset.page === name));

  if (name === 'quiz') renderQuestion();
  if (name === 'result') updateResult();

  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', `#${name}`);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function renderQuestion() {
  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  document.querySelector('#progress-label').textContent = `${String(currentQuestion + 1).padStart(2, '0')} / 04`;
  document.querySelector('#progress-percent').textContent = `${progress}%`;
  document.querySelector('#progress-bar').style.width = `${progress}%`;
  document.querySelector('.question-kicker').textContent = `QUESTION ${String(currentQuestion + 1).padStart(2, '0')}`;
  document.querySelector('#question-title').textContent = question.title;
  document.querySelector('#question-description').textContent = question.description;

  const answerGrid = document.querySelector('#answer-grid');
  answerGrid.innerHTML = question.options.map((option) => `
    <button class="answer-card ${answers[question.axis] === option.value ? 'selected' : ''}" type="button" data-value="${option.value}">
      <span>${option.icon}</span>
      <strong>${option.title}</strong>
      <small>${option.text}</small>
    </button>
  `).join('');

  answerGrid.querySelectorAll('.answer-card').forEach((card) => {
    card.addEventListener('click', () => {
      answers[question.axis] = card.dataset.value;
      renderQuestion();
    });
  });

  const prevButton = document.querySelector('#prev-question');
  const nextButton = document.querySelector('#next-question');
  prevButton.disabled = currentQuestion === 0;
  nextButton.disabled = !answers[question.axis];
  nextButton.textContent = currentQuestion === questions.length - 1 ? '결과 보기' : '다음';
}

function getTypeCode() {
  return `${answers.wc || 'W'}${answers.eu || 'E'}${answers.pk || 'P'}${answers.lm || 'L'}`;
}

function updateResult() {
  const code = getTypeCode();
  const data = typeData[code] || typeData.WEPL;
  const full = [
    code[0] === 'W' ? 'Warm' : 'Cool',
    code[1] === 'E' ? 'Everyday' : 'Unique',
    code[2] === 'P' ? 'Puppy' : 'Kitty',
    code[3] === 'L' ? 'Large' : 'Medium',
  ].join(' ');

  document.querySelector('#type-code').textContent = code;
  document.querySelector('#type-full').textContent = full;
  document.querySelector('#type-name').textContent = data.name;
  document.querySelector('#type-description').textContent = data.description;

  document.querySelector('#axis-wc').style.left = code[0] === 'W' ? '27%' : '73%';
  document.querySelector('#axis-eu').style.left = code[1] === 'E' ? '27%' : '73%';
  document.querySelector('#axis-pk').style.left = code[2] === 'P' ? '27%' : '73%';
  document.querySelector('#axis-lm').style.left = code[3] === 'L' ? '27%' : '73%';
}

pageButtons.forEach((button) => {
  button.addEventListener('click', () => showPage(button.dataset.page));
});

document.querySelectorAll('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    showPage('home');
    setTimeout(() => document.querySelector(`#${button.dataset.scroll}`)?.scrollIntoView({ behavior: 'smooth' }), 150);
  });
});

document.querySelector('#prev-question').addEventListener('click', () => {
  if (currentQuestion > 0) {
    currentQuestion -= 1;
    renderQuestion();
  }
});

document.querySelector('#next-question').addEventListener('click', () => {
  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
  } else {
    showPage('result');
  }
});

document.querySelector('#restart-test').addEventListener('click', () => {
  Object.keys(answers).forEach((key) => delete answers[key]);
  currentQuestion = 0;
  showPage('quiz');
});

document.querySelector('.save-button').addEventListener('click', () => showToast('QR 결과 저장 기능을 연결할 자리예요.'));
document.querySelectorAll('.try-button').forEach((button) => button.addEventListener('click', () => showToast('가상 착용 카메라 기능을 연결할 자리예요.')));
document.querySelectorAll('.detail-button').forEach((button) => button.addEventListener('click', () => showToast('제품 상세 페이지를 연결할 자리예요.')));

const initialPage = location.hash.replace('#', '');
showPage(['home', 'quiz', 'result'].includes(initialPage) ? initialPage : 'home');
