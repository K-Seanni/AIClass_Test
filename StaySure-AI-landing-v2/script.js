document.addEventListener("DOMContentLoaded", () => {
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // HOW IT WORKS interaction
  const steps = document.querySelectorAll(".step");
  const screens = document.querySelectorAll(".flow-screen");

  steps.forEach((step) => {
    step.addEventListener("click", () => {
      const target = step.dataset.step;
      steps.forEach((item) => item.classList.remove("active"));
      screens.forEach((screen) => screen.classList.remove("active"));
      step.classList.add("active");
      document.querySelector(`.flow-screen[data-screen="${target}"]`)?.classList.add("active");
    });
  });

  // Hero automatic selection flow
  const heroStages = [...document.querySelectorAll("[data-hero-stage]")];
  const heroDots = [...document.querySelectorAll("[data-hero-dot]")];
  const heroFlowLabel = document.getElementById("heroFlowLabel");
  const heroLabels = ["맥락 기억 중", "옵션 선택 중", "정책 검증 완료"];
  let heroIndex = 0;
  let heroTimer;

  const showHeroStage = (index) => {
    heroIndex = index;
    heroStages.forEach((stage, i) => stage.classList.toggle("active", i === index));
    heroDots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    if (heroFlowLabel) heroFlowLabel.textContent = heroLabels[index];
  };

  const startHeroTimer = () => {
    window.clearInterval(heroTimer);
    heroTimer = window.setInterval(() => {
      showHeroStage((heroIndex + 1) % heroStages.length);
    }, 3000);
  };

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showHeroStage(index);
      startHeroTimer();
    });
  });

  if (heroStages.length) startHeroTimer();

  // Demo input helpers
  const promptButtons = document.querySelectorAll("[data-prompt]");
  const textarea = document.getElementById("tripContext");

  promptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      textarea.value = button.dataset.prompt;
      textarea.focus();
    });
  });

  const analyzeBtn = document.getElementById("analyzeBtn");
  const emptyState = document.getElementById("emptyState");
  const optionResults = document.getElementById("optionResults");
  const optionList = document.getElementById("optionList");
  const demoMemoryPanel = document.getElementById("demoMemoryPanel");
  const contextChips = document.getElementById("contextChips");
  const optionDetailPlaceholder = document.getElementById("optionDetailPlaceholder");
  const analysisResult = document.getElementById("analysisResult");
  const selectedOptionSummary = document.getElementById("selectedOptionSummary");
  const analysisList = document.getElementById("analysisList");
  const analysisTitle = document.getElementById("analysisTitle");
  const matchScore = document.getElementById("matchScore");
  const nextActionText = document.getElementById("nextActionText");
  const alternativeBtn = document.getElementById("alternativeBtn");

  const optionData = [
    {
      id: "breakfast",
      name: "Premium Breakfast Package",
      room: "Deluxe Twin · 성인 3인 · 조식 포함",
      note: "Gold 혜택 일부 제외 · 기본 정원 3인",
      score: 82,
      price: "₩348,000",
      title: "예약 전 2가지를 확인하세요.",
      checks: [
        ["ok", "✓", "조식 포함 조건 충족", "성인 3인 조식이 기본 혜택에 포함되어 있어요."],
        ["warn", "!", "4인 투숙 시 추가 확인 필요", "기본 정원은 3인이며 추가 인원은 엑스트라 베드 요청이 필요해요."],
        ["risk", "!", "Gold 회원 일부 혜택 적용 제외", "프로모션 요금에는 객실 업그레이드 혜택이 적용되지 않아요."],
        ["warn", "!", "무료 취소 시점 불일치", "체크인 2일 전 18시까지 무료 취소가 가능해요."]
      ],
      action: "4인 투숙 가능 객실로 변경하거나 추가 인원 정책을 확인하세요."
    },
    {
      id: "family",
      name: "Family Deluxe",
      room: "Deluxe Family · 최대 4인 · 조식 선택",
      note: "4인 투숙 가능 · 조식 추가 선택 필요",
      score: 91,
      price: "₩372,000",
      title: "대부분의 조건과 잘 맞아요.",
      checks: [
        ["ok", "✓", "최대 4인 투숙 조건 충족", "동생이 합류해도 동일 객실에서 최대 4인까지 투숙할 수 있어요."],
        ["warn", "!", "조식은 별도 선택 필요", "기본 요금에는 조식이 없어 성인 3~4인 조식을 추가해야 해요."],
        ["ok", "✓", "Gold 회원 혜택 적용 가능", "회원 전용 체크인 및 객실 업그레이드 대상 상품이에요."],
        ["ok", "✓", "무료 취소 조건 충족", "체크인 하루 전 18시까지 무료 취소할 수 있어요."]
      ],
      action: "조식 인원만 확정해 추가하면 현재 여행 조건에 가장 안정적인 옵션이에요."
    },
    {
      id: "gold",
      name: "Gold Member Special",
      room: "Executive Twin · 성인 3인 · 회원 혜택",
      note: "Gold 혜택 우수 · 추가 인원 제한",
      score: 76,
      price: "₩329,000",
      title: "회원 혜택은 좋지만 인원 조건이 맞지 않아요.",
      checks: [
        ["ok", "✓", "Gold 회원 혜택 최대 적용", "객실 업그레이드와 라운지 혜택이 적용되는 회원 전용 상품이에요."],
        ["ok", "✓", "성인 3인 조식 포함", "현재 확정 인원 기준으로 조식 조건을 충족해요."],
        ["risk", "!", "4인 투숙 불가", "해당 객실 타입은 최대 3인까지만 투숙할 수 있어요."],
        ["warn", "!", "취소 가능 시점 확인 필요", "체크인 3일 전부터 취소 수수료가 발생해요."]
      ],
      action: "4인 가능성이 있다면 Family Deluxe를 우선 검토하는 편이 안전해요."
    }
  ];

  const extractContext = (text) => {
    const context = [];
    if (/gold|골드/i.test(text)) context.push("Gold 회원");
    if (/조식|breakfast/i.test(text)) context.push("조식 필수");
    if (/4명|네 명|4인/i.test(text)) context.push("최대 4명");
    if (/3명|세 명|3인/i.test(text)) context.push("성인 3명");
    if (/아이|아동|키즈|child/i.test(text)) context.push("아이 동반");
    if (/취소|무료 취소|수수료/i.test(text)) context.push("취소 조건 중요");
    if (/늦은 체크아웃|레이트 체크아웃|late check/i.test(text)) context.push("레이트 체크아웃");
    if (/주말|토요일|일요일/i.test(text)) context.push("주말 일정");
    if (/부모님|가족/i.test(text)) context.push("가족 여행");
    return context.length ? context.slice(0, 6) : ["여행 조건 입력 완료"];
  };

  const renderOptionList = () => {
    optionList.innerHTML = optionData.map((option) => `
      <button type="button" class="demo-option-card" data-option-id="${option.id}">
        <span class="demo-option-radio"></span>
        <span class="demo-option-copy">
          <strong>${option.name}</strong>
          <span>${option.room}</span>
          <small>${option.note}</small>
        </span>
        <span class="demo-option-meta">
          <strong>${option.score}% 적합</strong>
          <span>${option.price}</span>
        </span>
      </button>
    `).join("");

    optionList.querySelectorAll("[data-option-id]").forEach((card) => {
      card.addEventListener("click", () => selectOption(card.dataset.optionId));
    });
  };

  const selectOption = (id) => {
    const option = optionData.find((item) => item.id === id);
    if (!option) return;

    optionList.querySelectorAll("[data-option-id]").forEach((card) => {
      card.classList.toggle("selected", card.dataset.optionId === id);
    });

    selectedOptionSummary.innerHTML = `
      <div>
        <span class="analysis-caption">선택한 예약 옵션</span>
        <strong>${option.name}</strong>
        <span>${option.room}</span>
      </div>
      <span class="selected-option-price">${option.price}</span>
    `;

    analysisTitle.textContent = option.title;
    matchScore.textContent = `${option.score}% 적합`;
    analysisList.innerHTML = option.checks.map(([type, icon, title, body]) => `
      <article class="analysis-item ${type}">
        <div class="analysis-icon">${icon}</div>
        <div>
          <strong>${title}</strong>
          <p>${body}</p>
        </div>
      </article>
    `).join("");
    nextActionText.textContent = option.action;

    optionDetailPlaceholder.classList.add("hidden");
    analysisResult.classList.remove("hidden");
  };

  const renderCandidates = () => {
    const text = textarea.value.trim();
    if (!text) {
      textarea.focus();
      textarea.setAttribute("placeholder", "예: 다음 주말에 부모님과 3명이 가고 조식이 꼭 필요해요.");
      return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.querySelector("span:first-child").textContent = "조건을 정리하는 중...";

    window.setTimeout(() => {
      const contexts = extractContext(text);
      contextChips.innerHTML = contexts.map((item) => `<span>${item}</span>`).join("");
      renderOptionList();

      demoMemoryPanel.classList.remove("hidden");
      emptyState.classList.add("hidden");
      optionResults.classList.remove("hidden");
      optionDetailPlaceholder.classList.remove("hidden");
      analysisResult.classList.add("hidden");

      analyzeBtn.disabled = false;
      analyzeBtn.querySelector("span:first-child").textContent = "조건 다시 분석하기";
    }, 550);
  };

  analyzeBtn?.addEventListener("click", renderCandidates);

  alternativeBtn?.addEventListener("click", () => {
    analysisResult.classList.add("hidden");
    optionDetailPlaceholder.classList.remove("hidden");
    optionList.querySelectorAll(".demo-option-card").forEach((card) => card.classList.remove("selected"));
    optionList.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});
