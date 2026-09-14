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
  const analysisResult = document.getElementById("analysisResult");
  const contextChips = document.getElementById("contextChips");
  const analysisList = document.getElementById("analysisList");
  const nextActionText = document.getElementById("nextActionText");
  const alternativeBtn = document.getElementById("alternativeBtn");

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

  const getAnalysisItems = (text) => {
    const items = [
      {
        type: "ok",
        icon: "✓",
        title: "조식 포함 조건 충족",
        body: "선택한 패키지에는 성인 3인 조식이 포함되어 있어요."
      }
    ];

    if (/4명|네 명|4인|추가/i.test(text)) {
      items.push({
        type: "warn",
        icon: "!",
        title: "4인 투숙 시 추가 정책 확인 필요",
        body: "현재 객실 기본 정원은 3인이며, 추가 인원은 엑스트라 베드 요청이 필요해요."
      });
    } else {
      items.push({
        type: "ok",
        icon: "✓",
        title: "기본 투숙 인원과 일치",
        body: "현재 선택한 객실의 기본 정원 내에서 예약할 수 있어요."
      });
    }

    if (/gold|골드/i.test(text)) {
      items.push({
        type: "risk",
        icon: "!",
        title: "Gold 회원 일부 혜택 적용 제외",
        body: "프로모션 요금에는 객실 업그레이드 혜택이 적용되지 않아요."
      });
    }

    if (/취소|무료 취소|수수료/i.test(text)) {
      items.push({
        type: "warn",
        icon: "!",
        title: "무료 취소 가능 시점 확인",
        body: "이 상품은 체크인 2일 전 18시까지 무료 취소가 가능해요."
      });
    }

    if (/아이|아동|키즈|child/i.test(text)) {
      items.push({
        type: "warn",
        icon: "!",
        title: "아동 조식 요금은 별도",
        body: "아동 조식은 객실 패키지 기본 혜택에 포함되지 않아 현장 추가 결제가 필요해요."
      });
    }

    if (/늦은 체크아웃|레이트 체크아웃|late check/i.test(text)) {
      items.push({
        type: "risk",
        icon: "!",
        title: "레이트 체크아웃 확정 불가",
        body: "당일 객실 상황에 따라 제공되는 혜택이라 예약 시점에는 확정할 수 없어요."
      });
    }

    return items.slice(0, 4);
  };

  const renderAnalysis = () => {
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
      const items = getAnalysisItems(text);

      contextChips.innerHTML = contexts.map((item) => `<span>${item}</span>`).join("");

      analysisList.innerHTML = items
        .map(
          (item) => `
            <article class="analysis-item ${item.type}">
              <div class="analysis-icon">${item.icon}</div>
              <div>
                <strong>${item.title}</strong>
                <p>${item.body}</p>
              </div>
            </article>
          `
        )
        .join("");

      if (/4명|네 명|4인|추가/i.test(text)) {
        nextActionText.textContent = "4인 투숙 가능 객실로 변경하거나 추가 인원 정책을 확인하세요.";
      } else if (/늦은 체크아웃|레이트 체크아웃|late check/i.test(text)) {
        nextActionText.textContent = "레이트 체크아웃이 확정되는 요금제 또는 별도 유료 옵션을 확인하세요.";
      } else if (/아이|아동|키즈|child/i.test(text)) {
        nextActionText.textContent = "아동 조식과 추가 침구 비용을 포함한 총액으로 다시 비교해보세요.";
      } else {
        nextActionText.textContent = "현재 옵션은 대체로 적합해요. 취소·회원 혜택 정책만 최종 확인하세요.";
      }

      emptyState.classList.add("hidden");
      analysisResult.classList.remove("hidden");

      analyzeBtn.disabled = false;
      analyzeBtn.querySelector("span:first-child").textContent = "조건 다시 검증하기";
    }, 650);
  };

  analyzeBtn?.addEventListener("click", renderAnalysis);

  alternativeBtn?.addEventListener("click", () => {
    alternativeBtn.textContent = "추천 옵션 2개 발견";
    nextActionText.textContent = "Family Deluxe와 Premier Triple 옵션이 현재 조건에 더 잘 맞아요.";
  });
});
