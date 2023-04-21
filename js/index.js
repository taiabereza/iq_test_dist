(() => {
  "use strict";
  const modules_flsModules = {};
  function isWebp() {
    function testWebP(callback) {
      let webP = new Image();
      webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
      };
      webP.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
    testWebP(function (support) {
      let className = support === true ? "webp" : "no-webp";
      document.documentElement.classList.add(className);
    });
  }
  function getHash() {
    if (location.hash) return location.hash.replace("#", "");
  }
  let bodyLockStatus = true;
  let bodyLockToggle = (delay = 500) => {
    if (document.documentElement.classList.contains("lock")) bodyUnlock(delay);
    else bodyLock(delay);
  };
  let bodyUnlock = (delay = 500) => {
    let body = document.querySelector("body");
    if (bodyLockStatus) {
      let lock_padding = document.querySelectorAll("[data-lp]");
      setTimeout(() => {
        for (let index = 0; index < lock_padding.length; index++) {
          const el = lock_padding[index];
          el.style.paddingRight = "0px";
        }
        body.style.paddingRight = "0px";
        document.documentElement.classList.remove("lock");
      }, delay);
      bodyLockStatus = false;
      setTimeout(function () {
        bodyLockStatus = true;
      }, delay);
    }
  };
  let bodyLock = (delay = 500) => {
    let body = document.querySelector("body");
    if (bodyLockStatus) {
      let lock_padding = document.querySelectorAll("[data-lp]");
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight =
          window.innerWidth -
          document.querySelector(".wrapper").offsetWidth +
          "px";
      }
      body.style.paddingRight =
        window.innerWidth -
        document.querySelector(".wrapper").offsetWidth +
        "px";
      document.documentElement.classList.add("lock");
      bodyLockStatus = false;
      setTimeout(function () {
        bodyLockStatus = true;
      }, delay);
    }
  };
  function menuInit() {
    if (document.querySelector(".icon-menu"))
      document.addEventListener("click", function (e) {
        if (bodyLockStatus && e.target.closest(".icon-menu")) {
          bodyLockToggle();
          document.documentElement.classList.toggle("menu-open");
        }
      });
  }
  function menuClose() {
    bodyUnlock();
    document.documentElement.classList.remove("menu-open");
  }
  function functions_FLS(message) {
    setTimeout(() => {
      if (window.FLS) console.log(message);
    }, 0);
  }
  let gotoblock_gotoBlock = (
    targetBlock,
    noHeader = false,
    speed = 500,
    offsetTop = 0
  ) => {
    const targetBlockElement = document.querySelector(targetBlock);
    if (targetBlockElement) {
      let headerItem = "";
      let headerItemHeight = 0;
      if (noHeader) {
        headerItem = "header.header";
        const headerElement = document.querySelector(headerItem);
        if (!headerElement.classList.contains("_header-scroll")) {
          headerElement.style.cssText = `transition-duration: 0s;`;
          headerElement.classList.add("_header-scroll");
          headerItemHeight = headerElement.offsetHeight;
          headerElement.classList.remove("_header-scroll");
          setTimeout(() => {
            headerElement.style.cssText = ``;
          }, 0);
        } else headerItemHeight = headerElement.offsetHeight;
      }
      let options = {
        speedAsDuration: true,
        speed,
        header: headerItem,
        offset: offsetTop,
        easing: "easeOutQuad",
      };
      document.documentElement.classList.contains("menu-open")
        ? menuClose()
        : null;
      if (typeof SmoothScroll !== "undefined")
        new SmoothScroll().animateScroll(targetBlockElement, "", options);
      else {
        let targetBlockElementPosition =
          targetBlockElement.getBoundingClientRect().top + scrollY;
        targetBlockElementPosition = headerItemHeight
          ? targetBlockElementPosition - headerItemHeight
          : targetBlockElementPosition;
        targetBlockElementPosition = offsetTop
          ? targetBlockElementPosition - offsetTop
          : targetBlockElementPosition;
        window.scrollTo({
          top: targetBlockElementPosition,
          behavior: "smooth",
        });
      }
      functions_FLS(`[gotoBlock]: Юхуу...їдемо до ${targetBlock}`);
    } else
      functions_FLS(
        `[gotoBlock]: Йой... Такого блоку немає на сторінці: ${targetBlock}`
      );
  };
  let addWindowScrollEvent = false;
  function pageNavigation() {
    document.addEventListener("click", pageNavigationAction);
    document.addEventListener("watcherCallback", pageNavigationAction);
    function pageNavigationAction(e) {
      if (e.type === "click") {
        const targetElement = e.target;
        if (targetElement.closest("[data-goto]")) {
          const gotoLink = targetElement.closest("[data-goto]");
          const gotoLinkSelector = gotoLink.dataset.goto
            ? gotoLink.dataset.goto
            : "";
          const noHeader = gotoLink.hasAttribute("data-goto-header")
            ? true
            : false;
          const gotoSpeed = gotoLink.dataset.gotoSpeed
            ? gotoLink.dataset.gotoSpeed
            : 500;
          const offsetTop = gotoLink.dataset.gotoTop
            ? parseInt(gotoLink.dataset.gotoTop)
            : 0;
          if (modules_flsModules.fullpage) {
            const fullpageSection = document
              .querySelector(`${gotoLinkSelector}`)
              .closest("[data-fp-section]");
            const fullpageSectionId = fullpageSection
              ? +fullpageSection.dataset.fpId
              : null;
            if (fullpageSectionId !== null) {
              modules_flsModules.fullpage.switchingSection(fullpageSectionId);
              document.documentElement.classList.contains("menu-open")
                ? menuClose()
                : null;
            }
          } else
            gotoblock_gotoBlock(
              gotoLinkSelector,
              noHeader,
              gotoSpeed,
              offsetTop
            );
          e.preventDefault();
        }
      } else if (e.type === "watcherCallback" && e.detail) {
        const entry = e.detail.entry;
        const targetElement = entry.target;
        if (targetElement.dataset.watch === "navigator") {
          document.querySelector(`[data-goto]._navigator-active`);
          let navigatorCurrentItem;
          if (
            targetElement.id &&
            document.querySelector(`[data-goto="#${targetElement.id}"]`)
          )
            navigatorCurrentItem = document.querySelector(
              `[data-goto="#${targetElement.id}"]`
            );
          else if (targetElement.classList.length)
            for (
              let index = 0;
              index < targetElement.classList.length;
              index++
            ) {
              const element = targetElement.classList[index];
              if (document.querySelector(`[data-goto=".${element}"]`)) {
                navigatorCurrentItem = document.querySelector(
                  `[data-goto=".${element}"]`
                );
                break;
              }
            }
          if (entry.isIntersecting)
            navigatorCurrentItem
              ? navigatorCurrentItem.classList.add("_navigator-active")
              : null;
          else
            navigatorCurrentItem
              ? navigatorCurrentItem.classList.remove("_navigator-active")
              : null;
        }
      }
    }
    if (getHash()) {
      let goToHash;
      if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`;
      else if (document.querySelector(`.${getHash()}`))
        goToHash = `.${getHash()}`;
      goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
    }
  }
  setTimeout(() => {
    if (addWindowScrollEvent) {
      let windowScroll = new Event("windowScroll");
      window.addEventListener("scroll", function (e) {
        document.dispatchEvent(windowScroll);
      });
    }
  }, 0);
  const testBtns = document.querySelectorAll(".button-test");
  const headerMenu = document.querySelector(".header__menu");
  const linkToMainPage = document.querySelector(".to-main-page");
  const linkToInfoSection = document.querySelector(".to-info-section");
  const pageMain = document.querySelector(".page__main");
  const pageTest = document.querySelector(".page__test");
  const progressBar = document.querySelector(".test__progress");
  const testBlocks = document.querySelectorAll(".test__body");
  const answers = document.querySelectorAll(".body-test__answer");
  const nextBtn = document.querySelector(".test__button");
  const loadingBlock = document.querySelector(".loading__body");
  const pageResult = document.querySelector(".page__result");
  const resultStatus = document.querySelector(".result__status");
  const resultBtn = document.querySelector(".result__button");
  const resultFooter = document.querySelector(".footer");
  let timer = document.querySelector(".result__record-timer>span");
  const TIMER_SECONDS_MAX = 600;
  linkToMainPage.addEventListener("click", () => {
    handleMenuLinks();
  });
  linkToInfoSection.addEventListener("click", () => {
    handleMenuLinks();
  });
  testBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault;
      document.querySelector(".test__container").classList.remove("loading");
      progressBar.setAttribute("value", "0");
      for (let i = 0; i < testBlocks.length; i++)
        if (!testBlocks[i].classList.contains("display-none"))
          testBlocks[i].classList.add("display-none");
      nextBtn.classList.remove("display-none");
      nextBtn.setAttribute("disabled", "");
      loadingBlock.classList.add("display-none");
      document.querySelector(".result__data").innerHTML = ``;
      if (headerMenu.classList.contains("menu-res"))
        headerMenu.classList.remove("menu-res");
      headerMenu.classList.add("menu-test");
      pageMain.classList.add("display-none");
      pageResult.classList.add("display-none");
      pageTest.classList.remove("display-none");
      testBlocks[0].classList.remove("display-none");
    });
  });
  answers.forEach((ans) => {
    ans.addEventListener("click", (e) => {
      answers.forEach((ans) => ans.classList.remove("answer_checked"));
      e.target.classList.add("answer_checked");
      nextBtn.removeAttribute("disabled");
    });
  });
  nextBtn.onclick = function (e) {
    e.preventDefault;
    let currBlockIndex;
    for (let i = 0; i < testBlocks.length; i++)
      if (!testBlocks[i].classList.contains("display-none")) currBlockIndex = i;
    nextBtn.setAttribute("disabled", "");
    progressBar.setAttribute(
      "value",
      `${+progressBar.getAttribute("value") + 1}`
    );
    if (currBlockIndex !== testBlocks.length - 1) {
      testBlocks[currBlockIndex].classList.add("display-none");
      testBlocks[currBlockIndex + 1].classList.remove("display-none");
    } else {
      nextBtn.classList.add("display-none");
      document.querySelector(".test__container").classList.add("loading");
      for (let i = 0; i < testBlocks.length; i++)
        if (!testBlocks[i].classList.contains("display-none"))
          testBlocks[i].classList.add("display-none");
      loadingBlock.classList.remove("display-none");
      setTimeout(() => {
        headerMenu.classList.remove("menu-test");
        headerMenu.classList.add("menu-res");
        pageTest.classList.add("display-none");
        loadingBlock.classList.add("display-none");
        pageResult.classList.remove("display-none");
        resultBtn.removeAttribute("disabled");
        let timeLeft = TIMER_SECONDS_MAX;
        let timerun;
        timerun = setInterval(() => {
          if (timeLeft > 0) {
            timeLeft--;
            let seconds = Math.floor(timeLeft % 60);
            let minutes = Math.floor((timeLeft / 60) % 60);
            timer.textContent = `${minutes < 10 ? "0" + minutes : minutes}:${
              seconds < 10 ? "0" + seconds : seconds
            }`;
          } else {
            clearInterval(timerun);
            resultBtn.setAttribute("disabled", "");
          }
        }, 1e3);
        resultBtn.addEventListener("click", () => {
          printResult();
          clearInterval(timerun);
          resultBtn.setAttribute("disabled", "");
        });
        linkToMainPage.addEventListener("click", () => {
          clearInterval(timerun);
        });
        linkToInfoSection.addEventListener("click", () => {
          clearInterval(timerun);
        });
        document
          .querySelector("li.button-test")
          .addEventListener("click", () => {
            clearInterval(timerun);
          });
      }, 4e3);
      let lastScrollTop = 0;
      window.onscroll = function () {
        let st = window.scrollY || document.documentElement.scrollTop;
        if (st > lastScrollTop) resultFooter.classList.add("full");
        else if (st < lastScrollTop) resultFooter.classList.remove("full");
        lastScrollTop = st <= 0 ? 0 : st;
      };
    }
  };
  async function printResult() {
    await fetch("https://swapi.dev/api/people/1/")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then((responseJson) => {
        for (let key in responseJson)
          document.querySelector(
            ".result__data"
          ).innerHTML += `\n    <p><b>${key}:</b> ${responseJson[key]}</p>\n  `;
      })
      .catch((err) => {
        resultStatus.textContent = "Произошла ошибка соединения с сервером!";
      });
    // const data = await response.json();
  }
  function handleMenuLinks() {
    headerMenu.classList.remove("menu-res");
    headerMenu.classList.remove("menu-test");
    pageTest.classList.add("display-none");
    pageResult.classList.add("display-none");
    pageMain.classList.remove("display-none");
    document.querySelector(".result__data").innerHTML = ``;
    for (let i = 0; i < testBlocks.length; i++)
      if (!testBlocks[i].classList.contains("display-none"))
        testBlocks[i].classList.add("display-none");
  }
  window["FLS"] = true;
  isWebp();
  menuInit();
  pageNavigation();
})();
