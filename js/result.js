/* =========================================================
   LENSIA 결과보기 페이지 전용 JS

   - LPTI 유형 결과 표시
   - 유형별 렌즈 1~3순위 추천
   - 렌즈 제품 이미지 표시
   - 스펙트럼 위치 변경
   - 홍채 이미지 결과 표시
   - 가상 착용 이미지 업로드 미리보기
   - API 연결 전 임시 동작
========================================================= */

/* =========================================================
   유형별 결과 문구
========================================================= */

const typeData = {
  WEPL: {
    name: "포근한 밀크 브라운 타입",
    description:
      "따뜻하고 부드러운 인상을 살려주는 자연스러운 브라운 렌즈를 추천해요.",
  },

  WEPM: {
    name: "내추럴 코코아 타입",
    description:
      "부담 없는 확대감과 따뜻한 컬러가 어우러진 데일리 렌즈가 잘 어울려요.",
  },

  WEKL: {
    name: "선명한 카라멜 캣 타입",
    description:
      "따뜻한 카라멜 컬러와 또렷한 테두리로 세련된 눈매를 연출해 보세요.",
  },

  WEKM: {
    name: "차분한 허니 캣 타입",
    description:
      "은은한 브라운과 자연스러운 직경으로 또렷하지만 편안한 인상을 만들어요.",
  },

  WUPL: {
    name: "러블리 코랄 브라운 타입",
    description:
      "따뜻한 포인트 컬러와 큰 그래픽으로 사랑스럽고 특별한 분위기를 완성해요.",
  },

  WUPM: {
    name: "피치 글로우 타입",
    description:
      "코랄빛 포인트와 적당한 확대감으로 화사한 개성을 표현해 보세요.",
  },

  WUKL: {
    name: "골든 카라멜 캣 타입",
    description:
      "골드와 카라멜 컬러가 조합된 선명한 렌즈로 존재감을 높여보세요.",
  },

  WUKM: {
    name: "앰버 시크 타입",
    description:
      "앰버 브라운의 유니크함과 자연스러운 직경을 함께 즐기는 타입이에요.",
  },

  CEPL: {
    name: "맑은 애쉬 퍼피 타입",
    description:
      "차분한 애쉬 컬러와 부드러운 디자인으로 맑고 친근한 인상을 연출해요.",
  },

  CEPM: {
    name: "데일리 소프트 그레이 타입",
    description:
      "자연스러운 회색빛과 적당한 확대감으로 매일 편하게 착용하기 좋아요.",
  },

  CEKL: {
    name: "클리어 그레이 캣 타입",
    description:
      "맑은 회색과 또렷한 라인으로 세련되고 선명한 눈매를 만들어 보세요.",
  },

  CEKM: {
    name: "모던 애쉬 타입",
    description:
      "차분하고 도회적인 애쉬 컬러가 자연스러운 눈매와 잘 어울려요.",
  },

  CUPL: {
    name: "라벤더 드림 타입",
    description:
      "쿨한 컬러와 큰 직경으로 몽환적이고 사랑스러운 분위기를 연출해요.",
  },

  CUPM: {
    name: "미스티 블루 타입",
    description:
      "은은한 블루·그레이 컬러로 과하지 않게 특별한 포인트를 더해요.",
  },

  CUKL: {
    name: "문라이트 캣 타입",
    description:
      "차가운 컬러와 선명한 디자인으로 신비롭고 시크한 인상을 완성해요.",
  },

  CUKM: {
    name: "시크 애쉬 바이올렛 타입",
    description:
      "애쉬 바이올렛의 개성과 자연스러운 직경을 함께 즐기는 타입이에요.",
  },
};

/* =========================================================
   렌즈 제품 데이터

   이미지 저장 위치:
   assets/lenses/파일명.png
========================================================= */

const lensProducts = {
  veilBrown: {
    name: "Veil Brown",
    nameKo: "베일 브라운",
    line: "Daily Veil Line",
    color: "저채도 브라운",
    diameter: 14.0,
    graphicDiameter: 13.0,
    bc: 8.6,
    image: "./assets/lenses/veil-brown.png",
    description:
      "진한 테두리 없이 본래 눈색을 따뜻하고 자연스럽게 정돈해 주는 데일리 렌즈예요.",
  },

  veilChoco: {
    name: "Veil Choco",
    nameKo: "베일 초코",
    line: "Daily Veil Line",
    color: "딥 초코 브라운",
    diameter: 14.0,
    graphicDiameter: 13.0,
    bc: 8.6,
    image: "./assets/lenses/veil-choco.png",
    description:
      "차분한 초코 컬러와 흐린 외곽선으로 자연스러운 또렷함을 더해주는 렌즈예요.",
  },

  veilAsh: {
    name: "Veil Ash",
    nameKo: "베일 애쉬",
    line: "Daily Veil Line",
    color: "애쉬 브라운",
    diameter: 14.0,
    graphicDiameter: 13.0,
    bc: 8.6,
    image: "./assets/lenses/veil-ash.png",
    description:
      "회색빛이 살짝 섞인 브라운 컬러로 차분하고 맑은 인상을 만들어주는 렌즈예요.",
  },

  veilOlive: {
    name: "Veil Olive",
    nameKo: "베일 올리브",
    line: "Daily Veil Line",
    color: "소프트 올리브 브라운",
    diameter: 14.0,
    graphicDiameter: 13.0,
    bc: 8.6,
    image: "./assets/lenses/veil-olive.png",
    description:
      "브라운 베이스에 낮은 채도의 올리브를 더해 은은한 분위기 변화를 주는 렌즈예요.",
  },

  warmHoney: {
    name: "Warm Honey",
    nameKo: "웜 허니",
    line: "Mood Tone Line",
    color: "허니 브라운",
    diameter: 14.2,
    graphicDiameter: 13.2,
    bc: 8.6,
    image: "./assets/lenses/warm-honey.png",
    description:
      "밝은 허니 컬러가 웜톤 눈빛에 따뜻한 생기와 부드러운 포인트를 더해줘요.",
  },

  warmHazel: {
    name: "Warm Hazel",
    nameKo: "웜 헤이즐",
    line: "Mood Tone Line",
    color: "헤이즐 브라운",
    diameter: 14.2,
    graphicDiameter: 13.3,
    bc: 8.6,
    image: "./assets/lenses/warm-hazel.png",
    description:
      "카키와 골드 브라운이 섞인 헤이즐 컬러로 성숙하고 세련된 분위기를 만들어줘요.",
  },

  coolGrayBrown: {
    name: "Cool Gray Brown",
    nameKo: "쿨 그레이 브라운",
    line: "Mood Tone Line",
    color: "그레이 브라운",
    diameter: 14.2,
    graphicDiameter: 13.2,
    bc: 8.6,
    image: "./assets/lenses/cool-gray-brown.png",
    description:
      "브라운 베이스에 회색빛을 더해 쿨톤 눈빛을 차분하게 정리해주는 렌즈예요.",
  },

  coolRoseGray: {
    name: "Cool Rose Gray",
    nameKo: "쿨 로즈 그레이",
    line: "Mood Tone Line",
    color: "로즈 그레이",
    diameter: 14.2,
    graphicDiameter: 13.2,
    bc: 8.6,
    image: "./assets/lenses/cool-rose-gray.png",
    description:
      "연한 그레이에 로즈빛을 더해 맑고 부드러운 쿨톤 분위기를 만들어줘요.",
  },

  puppyAlmond: {
    name: "Puppy Almond",
    nameKo: "퍼피 아몬드",
    line: "Soft Puppy Line",
    color: "아몬드 브라운",
    diameter: 14.2,
    graphicDiameter: 13.2,
    bc: 8.6,
    image: "./assets/lenses/puppy-almond.png",
    description:
      "둥근 도트와 흐린 초코 외곽선으로 눈을 부드럽고 편안하게 보여주는 렌즈예요.",
  },

  puppyMilkBrown: {
    name: "Puppy Milk Brown",
    nameKo: "퍼피 밀크 브라운",
    line: "Soft Puppy Line",
    color: "밀크 브라운",
    diameter: 14.0,
    graphicDiameter: 13.2,
    bc: 8.6,
    image: "./assets/lenses/puppy-milk-brown.png",
    description:
      "낮은 발색과 부드러운 밀크 브라운 컬러로 본래 눈을 자연스럽게 밝혀줘요.",
  },

  puppyPinkBrown: {
    name: "Puppy Pink Brown",
    nameKo: "퍼피 핑크 브라운",
    line: "Soft Puppy Line",
    color: "핑크 브라운",
    diameter: 14.2,
    graphicDiameter: 13.2,
    bc: 8.6,
    image: "./assets/lenses/puppy-pink-brown.png",
    description:
      "낮은 채도의 핑크 브라운이 맑고 부드러운 쿨톤 강아지상 분위기를 만들어줘요.",
  },

  puppyOliveCream: {
    name: "Puppy Olive Cream",
    nameKo: "퍼피 올리브 크림",
    line: "Soft Puppy Line",
    color: "크림 올리브",
    diameter: 14.2,
    graphicDiameter: 13.2,
    bc: 8.6,
    image: "./assets/lenses/puppy-olive-cream.png",
    description:
      "크림 브라운과 올리브가 어우러져 부드러움을 유지하면서 색다른 분위기를 더해줘요.",
  },

  kittyAshChoco: {
    name: "Kitty Ash Choco",
    nameKo: "키티 애쉬 초코",
    line: "Chic Kitty Line",
    color: "애쉬 초코",
    diameter: 14.3,
    graphicDiameter: 13.4,
    bc: 8.6,
    image: "./assets/lenses/kitty-ash-choco.png",
    description:
      "애쉬빛 초코 컬러와 얇은 외곽선으로 자연스럽고 또렷한 눈매를 만들어줘요.",
  },

  kittyHazelEdge: {
    name: "Kitty Hazel Edge",
    nameKo: "키티 헤이즐 엣지",
    line: "Chic Kitty Line",
    color: "헤이즐 브라운",
    diameter: 14.3,
    graphicDiameter: 13.4,
    bc: 8.6,
    image: "./assets/lenses/kitty-hazel-edge.png",
    description:
      "헤이즐 컬러와 방사형 그라데이션이 웜톤 고양이상 눈매를 선명하게 살려줘요.",
  },

  kittyGray: {
    name: "Kitty Gray",
    nameKo: "키티 그레이",
    line: "Chic Kitty Line",
    color: "쿨 그레이",
    diameter: 14.3,
    graphicDiameter: 13.4,
    bc: 8.6,
    image: "./assets/lenses/kitty-gray.png",
    description:
      "차분한 쿨 그레이와 얇고 또렷한 외곽선으로 시크한 인상을 만들어줘요.",
  },

  kittyVioletSmoke: {
    name: "Kitty Violet Smoke",
    nameKo: "키티 바이올렛 스모크",
    line: "Chic Kitty Line",
    color: "스모키 바이올렛 그레이",
    diameter: 14.3,
    graphicDiameter: 13.4,
    bc: 8.6,
    image: "./assets/lenses/kitty-violet-smoke.png",
    description:
      "바이올렛과 그레이가 섞인 스모키 컬러로 강한 개성과 시크함을 더해줘요.",
  },

  flashHoneyGlow: {
    name: "Flash Honey Glow",
    nameKo: "플래시 허니 글로우",
    line: "Flash Moment Line",
    color: "글로우 허니 브라운",
    diameter: 14.4,
    graphicDiameter: 13.6,
    bc: 8.6,
    image: "./assets/lenses/flash-honey-glow.png",
    description:
      "허니와 골드 브라운 컬러가 자연광에서 화사하고 선명하게 발색되는 포인트 렌즈예요.",
  },

  flashOlivePop: {
    name: "Flash Olive Pop",
    nameKo: "플래시 올리브 팝",
    line: "Flash Moment Line",
    color: "올리브 카키",
    diameter: 14.4,
    graphicDiameter: 13.5,
    bc: 8.6,
    image: "./assets/lenses/flash-olive-pop.png",
    description:
      "올리브 카키와 브라운 외곽선이 어우러져 힙하고 개성 있는 분위기를 만들어줘요.",
  },

  flashBlueGray: {
    name: "Flash Blue Gray",
    nameKo: "플래시 블루 그레이",
    line: "Flash Moment Line",
    color: "블루 그레이",
    diameter: 14.4,
    graphicDiameter: 13.6,
    bc: 8.6,
    image: "./assets/lenses/flash-blue-gray.png",
    description:
      "그레이 베이스에 낮은 채도의 블루를 더해 사진에서 맑고 차가운 눈빛을 만들어줘요.",
  },

  flashLavenderHaze: {
    name: "Flash Lavender Haze",
    nameKo: "플래시 라벤더 헤이즈",
    line: "Flash Moment Line",
    color: "라벤더 그레이",
    diameter: 14.4,
    graphicDiameter: 13.5,
    bc: 8.6,
    image: "./assets/lenses/flash-lavender-haze.png",
    description:
      "라벤더와 그레이가 섞인 스모키 그래픽으로 몽환적인 분위기를 만들어줘요.",
  },
};

/* =========================================================
   LPTI별 렌즈 추천 순위

   배열 순서:
   첫 번째 = 1순위
   두 번째 = 2순위
   세 번째 = 3순위
========================================================= */

const lptiLensRanking = {
  WEPM: [
    "veilBrown",
    "puppyMilkBrown",
    "puppyAlmond",
  ],

  WEPL: [
    "veilChoco",
    "puppyAlmond",
    "warmHoney",
  ],

  WUPM: [
    "veilOlive",
    "puppyOliveCream",
    "warmHoney",
  ],

  WUPL: [
    "flashHoneyGlow",
    "puppyOliveCream",
    "flashOlivePop",
  ],

  WEKM: [
    "warmHazel",
    "kittyAshChoco",
    "veilChoco",
  ],

  WEKL: [
    "kittyHazelEdge",
    "veilChoco",
    "warmHazel",
  ],

  WUKM: [
    "kittyHazelEdge",
    "veilOlive",
    "warmHazel",
  ],

  WUKL: [
    "flashOlivePop",
    "kittyHazelEdge",
    "flashHoneyGlow",
  ],

  CEPM: [
    "veilAsh",
    "puppyPinkBrown",
    "coolGrayBrown",
  ],

  CEPL: [
    "puppyPinkBrown",
    "coolRoseGray",
    "veilAsh",
  ],

  CUPM: [
    "coolRoseGray",
    "puppyPinkBrown",
    "flashLavenderHaze",
  ],

  CUPL: [
    "flashLavenderHaze",
    "flashBlueGray",
    "coolRoseGray",
  ],

  CEKM: [
    "coolGrayBrown",
    "kittyAshChoco",
    "kittyGray",
  ],

  CEKL: [
    "kittyAshChoco",
    "kittyGray",
    "coolGrayBrown",
  ],

  CUKM: [
    "kittyGray",
    "coolRoseGray",
    "kittyVioletSmoke",
  ],

  CUKL: [
    "kittyVioletSmoke",
    "flashBlueGray",
    "kittyGray",
  ],
};

/* =========================================================
   결과 페이지 상태
========================================================= */

const resultState = {
  irisImageUrl: null,

  tryOnImageFile: null,
  tryOnImageUrl: null,

  selectedLensId: null,
  selectedLensName: null,
};

/* =========================================================
   공통 함수
========================================================= */

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (!element) {
    return;
  }

  element.textContent = value;
}

/**
 * WEPL을 WEP-L 형식으로 표시
 */
function formatTypeCode(code) {
  if (!code || code.length < 4) {
    return "WEP-L";
  }

  return `${code.slice(0, 3)}-${code[3]}`;
}

/**
 * script.js의 getTypeCode 결과 가져오기
 */
function safeGetTypeCode() {
  try {
    if (typeof getTypeCode === "function") {
      const code = getTypeCode();

      if (code) {
        return String(code)
          .replaceAll("-", "")
          .toUpperCase();
      }
    }
  } catch (error) {
    console.warn(
      "LPTI 유형을 불러오지 못했습니다.",
      error,
    );
  }

  return "WEPL";
}

/**
 * 스펙트럼 점수 가져오기
 */
function safeGetSpectrumScores(code) {
  try {
    if (typeof calculateScores === "function") {
      const scores = calculateScores();

      const toPercent = (leftScore, rightScore) => {
        const left = Number(leftScore) || 0;
        const right = Number(rightScore) || 0;
        const total = left + right;

        if (total === 0) {
          return 50;
        }

        return (right / total) * 100;
      };

      return {
        wc: toPercent(scores.W, scores.C),
        eu: toPercent(scores.E, scores.U),
        pk: toPercent(scores.P, scores.K),
        lm: toPercent(scores.L, scores.M),
      };
    }
  } catch (error) {
    console.warn(
      "스펙트럼 점수를 불러오지 못했습니다.",
      error,
    );
  }

  return {
    wc: code[0] === "W" ? 27 : 73,
    eu: code[1] === "E" ? 27 : 73,
    pk: code[2] === "P" ? 27 : 73,
    lm: code[3] === "L" ? 27 : 73,
  };
}

function moveAxis(selector, score) {
  const dot = document.querySelector(selector);

  if (!dot) {
    return;
  }

  const numericScore = Number(score);

  const validScore = Number.isFinite(numericScore)
    ? numericScore
    : 50;

  const safeScore = Math.max(
    4,
    Math.min(96, validScore),
  );

  dot.style.left = `${safeScore}%`;
}

/* =========================================================
   추천 렌즈 카드 표시
========================================================= */

function renderLensRecommendations(code) {
  const normalizedCode = String(code || "WEPL")
    .replaceAll("-", "")
    .toUpperCase();

  const lensIds =
    lptiLensRanking[normalizedCode] ||
    lptiLensRanking.WEPL;

  const cards = document.querySelectorAll(
    "#result-product-grid .result-product-card",
  );

  cards.forEach((card, index) => {
    const lensId = lensIds[index];
    const lens = lensProducts[lensId];

    if (!lens) {
      card.hidden = true;
      return;
    }

    card.hidden = false;
    card.dataset.lensId = lensId;
    card.dataset.rank = String(index + 1);

    const title = card.querySelector("h3");

    const description = card.querySelector(
      ".result-product-info > p",
    );

    const metaItems = card.querySelectorAll(
      ".result-product-meta span",
    );

    const imageWrap = card.querySelector(
      ".result-product-image-placeholder",
    );

    const tryButton = card.querySelector(
      ".result-try-button",
    );

    const detailButton = card.querySelector(
      ".result-detail-button",
    );

    if (title) {
      title.textContent = lens.nameKo;
      title.title = `${lens.name} · ${lens.line}`;
    }

    if (description) {
      description.textContent = lens.description;
    }

    if (metaItems[0]) {
      metaItems[0].textContent =
        `전체 ${lens.diameter.toFixed(1)}mm`;
    }

    if (metaItems[1]) {
      metaItems[1].textContent =
        `그래픽 ${lens.graphicDiameter.toFixed(1)}mm`;
    }

    if (imageWrap) {
      imageWrap.replaceChildren();

      const image = document.createElement("img");

      image.src = lens.image;
      image.alt = `${lens.nameKo} 렌즈 이미지`;
      image.loading = "lazy";

      image.style.width = "100%";
      image.style.height = "100%";
      image.style.display = "block";
      image.style.objectFit = "cover";
      image.style.borderRadius = "inherit";

      image.addEventListener("error", () => {
        image.remove();

        const placeholder =
          document.createElement("span");

        placeholder.textContent =
          `${lens.nameKo} 이미지 준비 중`;

        imageWrap.appendChild(placeholder);
      });

      imageWrap.appendChild(image);
    }

    if (tryButton) {
      tryButton.dataset.lensId = lensId;
      tryButton.dataset.lensName = lens.nameKo;

      tryButton.setAttribute(
        "aria-label",
        `${lens.nameKo} 가상 착용`,
      );
    }

    if (detailButton) {
      detailButton.dataset.lensId = lensId;
      detailButton.dataset.lensName = lens.nameKo;
    }

    let bestLabel = card.querySelector(
      ".result-best-label",
    );

    if (index === 0) {
      if (!bestLabel) {
        bestLabel = document.createElement("span");
        bestLabel.className = "result-best-label";

        card.prepend(bestLabel);
      }

      bestLabel.textContent = "BEST";
      bestLabel.hidden = false;
    } else if (bestLabel) {
      bestLabel.hidden = true;
    }
  });
}

/* =========================================================
   결과 페이지 전체 갱신
========================================================= */

function updateResult() {
  const code = safeGetTypeCode();
  const data = typeData[code] || typeData.WEPL;

  const fullTypeName = [
    code[0] === "W" ? "Warm" : "Cool",
    code[1] === "E" ? "Everyday" : "Unique",
    code[2] === "P" ? "Puppy" : "Kitty",
    code[3] === "L" ? "Large" : "Medium",
  ].join(" ");

  setText("#type-code", formatTypeCode(code));
  setText("#type-full", fullTypeName);
  setText("#type-name", data.name);
  setText("#type-description", data.description);

  renderLensRecommendations(code);

  const characterImage = document.querySelector(
    "#result-character-image",
  );

  if (characterImage) {
    characterImage.src =
      `./assets/characters/${code}.png`;

    characterImage.alt =
      `${formatTypeCode(code)} 유형 캐릭터`;
  }

  const spectrum = safeGetSpectrumScores(code);

  moveAxis("#axis-wc", spectrum.wc);
  moveAxis("#axis-eu", spectrum.eu);
  moveAxis("#axis-pk", spectrum.pk);
  moveAxis("#axis-lm", spectrum.lm);

  restoreIrisPreview();
}

/* =========================================================
   홍채 분석 결과 표시
========================================================= */

function applyIrisResult({
  imageUrl,
  statusText = "· 홍채 컬러 분석 포함 결과",
}) {
  const image = document.querySelector(
    "#result-iris-image",
  );

  const placeholder = document.querySelector(
    "#result-iris-placeholder",
  );

  const ringLabel = document.querySelector(
    ".result-iris-ring b",
  );

  if (!image || !placeholder) {
    return;
  }

  if (
    resultState.irisImageUrl &&
    resultState.irisImageUrl.startsWith("blob:")
  ) {
    URL.revokeObjectURL(
      resultState.irisImageUrl,
    );
  }

  resultState.irisImageUrl = imageUrl || null;

  if (resultState.irisImageUrl) {
    image.src = resultState.irisImageUrl;
    image.hidden = false;

    placeholder.hidden = true;

    if (ringLabel) {
      ringLabel.textContent = "분석 완료";
    }
  } else {
    image.removeAttribute("src");
    image.hidden = true;

    placeholder.hidden = false;

    if (ringLabel) {
      ringLabel.textContent = "분석 대기";
    }
  }

  setText("#iris-result-status", statusText);
}

function restoreIrisPreview() {
  const savedDataUrl = sessionStorage.getItem(
    "lensiaIrisImageDataUrl",
  );

  const skipped =
    sessionStorage.getItem(
      "lensiaIrisSkipped",
    ) === "true";

  if (savedDataUrl) {
    applyIrisResult({
      imageUrl: savedDataUrl,
      statusText:
        "· 홍채 컬러 분석 이미지 등록 완료",
    });

    return;
  }

  if (skipped) {
    applyIrisResult({
      imageUrl: null,
      statusText:
        "· 홍채 이미지 미분석 — LPTI 취향 기반 결과",
    });

    return;
  }

  applyIrisResult({
    imageUrl: null,
    statusText:
      "· 홍채 이미지가 없어요 — 촬영 또는 첨부 후 분석할 수 있어요",
  });
}

/* =========================================================
   가상 착용 기능
========================================================= */

function initializeTryOn() {
  const cameraButton = document.querySelector(
    "#tryon-camera-button",
  );

  const uploadButton = document.querySelector(
    "#tryon-upload-button",
  );

  const cameraInput = document.querySelector(
    "#tryon-camera-input",
  );

  const fileInput = document.querySelector(
    "#tryon-file-input",
  );

  const analyzeButton = document.querySelector(
    "#tryon-analyze-button",
  );

  cameraButton?.addEventListener("click", () => {
    cameraInput?.click();
  });

  uploadButton?.addEventListener("click", () => {
    fileInput?.click();
  });

  cameraInput?.addEventListener(
    "change",
    handleTryOnFile,
  );

  fileInput?.addEventListener(
    "change",
    handleTryOnFile,
  );

  analyzeButton?.addEventListener("click", () => {
    if (!resultState.tryOnImageUrl) {
      showResultToast(
        "가상 착용에 사용할 사진을 먼저 선택해 주세요.",
      );

      return;
    }

    if (!resultState.selectedLensName) {
      showResultToast(
        "먼저 추천 렌즈의 가상 착용 버튼을 선택해 주세요.",
      );

      return;
    }

    const resultImage = document.querySelector(
      "#tryon-result-image",
    );

    const resultPlaceholder =
      document.querySelector(
        "#tryon-result-placeholder",
      );

    if (resultImage) {
      resultImage.src =
        resultState.tryOnImageUrl;

      resultImage.hidden = false;
    }

    if (resultPlaceholder) {
      resultPlaceholder.hidden = true;
    }

    showResultToast(
      `${resultState.selectedLensName} 가상 착용 API 연결 자리입니다.`,
    );
  });

  document
    .querySelectorAll(".result-try-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        resultState.selectedLensId =
          button.dataset.lensId ||
          button.closest(
            ".result-product-card",
          )?.dataset.lensId ||
          null;

        resultState.selectedLensName =
          button.dataset.lensName ||
          "선택 렌즈";

        if (resultState.tryOnImageUrl) {
          showResultToast(
            `${resultState.selectedLensName} 렌즈를 선택했어요.`,
          );
        } else {
          showResultToast(
            `${resultState.selectedLensName} 렌즈를 선택했어요. 사진을 준비해 주세요.`,
          );
        }

        document
          .querySelector(
            ".result-tryon-card",
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      });
    });
}

function handleTryOnFile(event) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    showResultToast(
      "이미지 파일만 선택할 수 있어요.",
    );

    event.target.value = "";

    return;
  }

  if (
    resultState.tryOnImageUrl &&
    resultState.tryOnImageUrl.startsWith("blob:")
  ) {
    URL.revokeObjectURL(
      resultState.tryOnImageUrl,
    );
  }

  resultState.tryOnImageFile = file;

  resultState.tryOnImageUrl =
    URL.createObjectURL(file);

  const originalImage = document.querySelector(
    "#tryon-original-image",
  );

  const originalPlaceholder =
    document.querySelector(
      "#tryon-original-placeholder",
    );

  const resultImage = document.querySelector(
    "#tryon-result-image",
  );

  const resultPlaceholder =
    document.querySelector(
      "#tryon-result-placeholder",
    );

  const analyzeButton = document.querySelector(
    "#tryon-analyze-button",
  );

  if (originalImage) {
    originalImage.src =
      resultState.tryOnImageUrl;

    originalImage.hidden = false;
  }

  if (originalPlaceholder) {
    originalPlaceholder.hidden = true;
  }

  if (resultImage) {
    resultImage.removeAttribute("src");
    resultImage.hidden = true;
  }

  if (resultPlaceholder) {
    resultPlaceholder.hidden = false;
  }

  if (analyzeButton) {
    analyzeButton.disabled = false;
  }

  setText(
    "#tryon-file-status",
    `● ${file.name}`,
  );
}

/* =========================================================
   하단 버튼
========================================================= */

function initializeResultActions() {
  const saveButton = document.querySelector(
    "#save-result-image",
  );

  saveButton?.addEventListener("click", () => {
    showResultToast(
      "결과 이미지 저장 기능은 추후 연결하면 됩니다.",
    );
  });

  document
    .querySelectorAll(".result-detail-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const lensId =
          button.dataset.lensId ||
          button.closest(
            ".result-product-card",
          )?.dataset.lensId;

        const lens = lensProducts[lensId];

        if (!lens) {
          showResultToast(
            "제품 상세 정보를 불러오지 못했습니다.",
          );

          return;
        }

        showResultToast(
          `${lens.nameKo} · ${lens.color} · BC ${lens.bc}`,
        );
      });
    });
}

/* =========================================================
   토스트 메시지
========================================================= */

function showResultToast(message) {
  const toast = document.querySelector("#toast");

  if (!toast) {
    console.log(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(
    showResultToast.timer,
  );

  showResultToast.timer =
    window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
}

/* =========================================================
   초기 실행
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    updateResult();
    initializeTryOn();
    initializeResultActions();
  },
);