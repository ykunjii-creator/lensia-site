/* =========================================================
   LENSIA 결과 이미지 저장 전용 JS

   파일 위치:
   export/result-export.js

   기능:
   1. 결과 저장 버튼 클릭 감지
   2. 현재 결과 화면 복제
   3. 화면 크기와 관계없이 1400px 저장 레이아웃 적용
   4. PNG 이미지로 다운로드
========================================================= */

(() => {
  "use strict";

  /* =======================================================
     기본 설정
  ======================================================= */

  const EXPORT_CONFIG = {
    /* HTML에 있는 저장 버튼 ID */
    saveButtonSelector: "#save-result-image",

    /* 실제 이미지로 저장할 결과 영역 */
    resultSelector: ".result-dashboard",

    /* 저장 파일명 앞부분 */
    fileNamePrefix: "LENSIA_LPTI_RESULT",

    /* 저장 이미지의 고정 너비 */
    exportWidth: 1400,

    /* PNG 해상도 배율 */
    scale: 2,

    /* html2canvas CDN */
    html2canvasUrl:
      "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js",
  };

  let isExporting = false;
  let html2canvasLoadingPromise = null;

  /* =======================================================
     초기 실행
  ======================================================= */

  function initializeResultExport() {
    const saveButton = document.querySelector(
      EXPORT_CONFIG.saveButtonSelector,
    );

    if (!saveButton) {
      console.warn(
        `[LENSIA EXPORT] 저장 버튼을 찾지 못했습니다: ${EXPORT_CONFIG.saveButtonSelector}`,
      );

      return;
    }

    /*
     * JS가 여러 번 실행돼도 클릭 이벤트가
     * 중복 등록되지 않도록 data 속성 사용
     */
    if (saveButton.dataset.exportInitialized === "true") {
      return;
    }

    saveButton.dataset.exportInitialized = "true";

    saveButton.addEventListener("click", handleSaveButtonClick);
  }

  /* =======================================================
     저장 버튼 클릭
  ======================================================= */

  async function handleSaveButtonClick(event) {
    event.preventDefault();

    if (isExporting) {
      return;
    }

    const saveButton = event.currentTarget;

    try {
      isExporting = true;

      setSaveButtonLoading(saveButton, true);

      showExportMessage("결과 이미지를 만들고 있어요.");

      const resultElement = document.querySelector(
        EXPORT_CONFIG.resultSelector,
      );

      if (!resultElement) {
        throw new Error(
          `저장할 결과 영역을 찾지 못했습니다: ${EXPORT_CONFIG.resultSelector}`,
        );
      }

      /*
       * html2canvas가 index.html에 직접 연결되어 있지 않아도
       * 이 JS가 필요한 순간 자동으로 불러옴
       */
      await loadHtml2Canvas();

      /*
       * 웹폰트 로딩이 끝난 뒤 캡처해야
       * 글자 크기나 줄바꿈이 덜 달라짐
       */
      await waitForFonts();

      /*
       * 원본 결과 화면 안의 이미지가 모두 로딩될 때까지 대기
       */
      await waitForImages(resultElement);

      /*
       * 현재 화면을 직접 캡처하지 않고
       * 저장 전용 복제본을 만듦
       */
      const exportStage = createExportStage(resultElement);

      try {
        /*
         * 복제본 안의 이미지도 다시 로딩 상태를 확인
         */
        await waitForImages(exportStage);

        /*
         * 브라우저가 저장 전용 CSS 배치를 계산할 시간을 줌
         */
        await waitForNextFrames(2);

        const exportTarget = exportStage.querySelector(
          ".lensia-export-mode",
        );

        if (!exportTarget) {
          throw new Error(
            "저장용 결과 영역을 생성하지 못했습니다.",
          );
        }

        const canvas = await window.html2canvas(exportTarget, {
          backgroundColor: "#f9f9f9",

          scale: EXPORT_CONFIG.scale,

          useCORS: true,
          allowTaint: false,

          logging: false,

          imageTimeout: 15000,

          width: EXPORT_CONFIG.exportWidth,
          windowWidth: EXPORT_CONFIG.exportWidth,

          scrollX: 0,
          scrollY: 0,

          /*
           * 저장 대상 전체 높이를 그대로 사용
           */
          height: Math.ceil(exportTarget.scrollHeight),
          windowHeight: Math.ceil(exportTarget.scrollHeight),

          /*
           * html2canvas 내부에서도 복제 문서를 만들기 때문에
           * 저장용 클래스를 확실하게 유지
           */
          onclone(clonedDocument) {
            const clonedExportTarget =
              clonedDocument.querySelector(
                ".lensia-export-mode",
              );

            if (clonedExportTarget) {
              clonedExportTarget.style.width =
                `${EXPORT_CONFIG.exportWidth}px`;

              clonedExportTarget.style.minWidth =
                `${EXPORT_CONFIG.exportWidth}px`;

              clonedExportTarget.style.maxWidth = "none";
            }
          },
        });

        await downloadCanvasAsPng(canvas);

        showExportMessage("결과 이미지가 저장되었어요.");
      } finally {
        /*
         * 성공하거나 오류가 나더라도
         * 숨겨둔 저장용 복제본은 반드시 제거
         */
        exportStage.remove();
      }
    } catch (error) {
      console.error(
        "[LENSIA EXPORT] 결과 저장 중 오류가 발생했습니다.",
        error,
      );

      showExportMessage(
        "이미지 저장에 실패했어요. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      isExporting = false;

      setSaveButtonLoading(saveButton, false);
    }
  }

  /* =======================================================
     저장 전용 복제본 생성
  ======================================================= */

  function createExportStage(resultElement) {
    const exportStage = document.createElement("div");

    exportStage.className = "lensia-export-stage";
    exportStage.setAttribute("aria-hidden", "true");

    const clonedResult = resultElement.cloneNode(true);

    clonedResult.classList.add("lensia-export-mode");

    /*
     * 복제된 요소 안의 ID가 원본과 중복되지 않도록 변경
     *
     * html2canvas 캡처 자체에는 ID가 필요 없고,
     * 중복 ID 때문에 원본 요소 선택이 꼬이는 것을 예방함
     */
    renameDuplicatedIds(clonedResult);

    /*
     * 저장 이미지에 필요 없는 조작 버튼 제거
     * CSS에서도 숨기지만, JS에서도 한 번 더 확실히 제거
     */
    removeExportExcludedElements(clonedResult);

    /*
     * 원본의 현재 입력 상태를 복제본에도 반영
     */
    copyCurrentFormValues(resultElement, clonedResult);

    /*
     * canvas와 video가 있다면 현재 화면을 이미지로 복사
     */
    copyCanvasContents(resultElement, clonedResult);
    copyVideoFrames(resultElement, clonedResult);

    exportStage.appendChild(clonedResult);
    document.body.appendChild(exportStage);

    return exportStage;
  }

  /* =======================================================
     중복 ID 변경
  ======================================================= */

  function renameDuplicatedIds(container) {
    const elementsWithId = container.querySelectorAll("[id]");

    elementsWithId.forEach((element, index) => {
      const oldId = element.id;

      element.dataset.originalExportId = oldId;
      element.id = `export-${oldId}-${index}`;
    });
  }

  /* =======================================================
     저장 제외 요소 삭제
  ======================================================= */

  function removeExportExcludedElements(container) {
    const selectors = [
      ".result-bottom-actions",
      "#restart-test",
      "#save-result-image",

      ".result-placeholder-button",
      ".result-detail-button",
      ".result-try-button",

      "#tryon-camera-button",
      "#tryon-upload-button",
      "#tryon-analyze-button",
      "#tryon-camera-input",
      "#tryon-file-input",

      "[data-export-exclude]",
    ];

    selectors.forEach((selector) => {
      container
        .querySelectorAll(selector)
        .forEach((element) => element.remove());
    });
  }

  /* =======================================================
     폼 입력값 복사
  ======================================================= */

  function copyCurrentFormValues(original, clone) {
    const originalInputs = original.querySelectorAll(
      "input, textarea, select",
    );

    const clonedInputs = clone.querySelectorAll(
      "input, textarea, select",
    );

    originalInputs.forEach((originalInput, index) => {
      const clonedInput = clonedInputs[index];

      if (!clonedInput) {
        return;
      }

      if (
        originalInput instanceof HTMLInputElement &&
        clonedInput instanceof HTMLInputElement
      ) {
        clonedInput.value = originalInput.value;
        clonedInput.checked = originalInput.checked;
      }

      if (
        originalInput instanceof HTMLTextAreaElement &&
        clonedInput instanceof HTMLTextAreaElement
      ) {
        clonedInput.value = originalInput.value;
        clonedInput.textContent = originalInput.value;
      }

      if (
        originalInput instanceof HTMLSelectElement &&
        clonedInput instanceof HTMLSelectElement
      ) {
        clonedInput.value = originalInput.value;
      }
    });
  }

  /* =======================================================
     canvas 내용 복사
  ======================================================= */

  function copyCanvasContents(original, clone) {
    const originalCanvases =
      original.querySelectorAll("canvas");

    const clonedCanvases =
      clone.querySelectorAll("canvas");

    originalCanvases.forEach((originalCanvas, index) => {
      const clonedCanvas = clonedCanvases[index];

      if (!clonedCanvas) {
        return;
      }

      clonedCanvas.width = originalCanvas.width;
      clonedCanvas.height = originalCanvas.height;

      const clonedContext =
        clonedCanvas.getContext("2d");

      if (!clonedContext) {
        return;
      }

      try {
        clonedContext.drawImage(originalCanvas, 0, 0);
      } catch (error) {
        console.warn(
          "[LENSIA EXPORT] canvas 복사에 실패했습니다.",
          error,
        );
      }
    });
  }

  /* =======================================================
     video 현재 프레임 복사
  ======================================================= */

  function copyVideoFrames(original, clone) {
    const originalVideos =
      original.querySelectorAll("video");

    const clonedVideos =
      clone.querySelectorAll("video");

    originalVideos.forEach((originalVideo, index) => {
      const clonedVideo = clonedVideos[index];

      if (!clonedVideo) {
        return;
      }

      if (
        !originalVideo.videoWidth ||
        !originalVideo.videoHeight
      ) {
        return;
      }

      const canvas = document.createElement("canvas");

      canvas.width = originalVideo.videoWidth;
      canvas.height = originalVideo.videoHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      try {
        context.drawImage(originalVideo, 0, 0);

        const replacementImage =
          document.createElement("img");

        replacementImage.src =
          canvas.toDataURL("image/png");

        replacementImage.alt =
          originalVideo.getAttribute("aria-label") ||
          "가상 착용 이미지";

        replacementImage.className =
          clonedVideo.className;

        clonedVideo.replaceWith(replacementImage);
      } catch (error) {
        console.warn(
          "[LENSIA EXPORT] video 프레임 복사에 실패했습니다.",
          error,
        );
      }
    });
  }

  /* =======================================================
     html2canvas 불러오기
  ======================================================= */

  function loadHtml2Canvas() {
    if (typeof window.html2canvas === "function") {
      return Promise.resolve(window.html2canvas);
    }

    if (html2canvasLoadingPromise) {
      return html2canvasLoadingPromise;
    }

    html2canvasLoadingPromise = new Promise(
      (resolve, reject) => {
        const existingScript =
          document.querySelector(
            'script[data-lensia-html2canvas="true"]',
          );

        if (existingScript) {
          existingScript.addEventListener("load", () => {
            if (
              typeof window.html2canvas === "function"
            ) {
              resolve(window.html2canvas);
            } else {
              reject(
                new Error(
                  "html2canvas를 불러왔지만 사용할 수 없습니다.",
                ),
              );
            }
          });

          existingScript.addEventListener(
            "error",
            () => {
              reject(
                new Error(
                  "html2canvas 스크립트를 불러오지 못했습니다.",
                ),
              );
            },
          );

          return;
        }

        const script = document.createElement("script");

        script.src = EXPORT_CONFIG.html2canvasUrl;
        script.async = true;
        script.dataset.lensiaHtml2canvas = "true";

        script.onload = () => {
          if (
            typeof window.html2canvas === "function"
          ) {
            resolve(window.html2canvas);
          } else {
            reject(
              new Error(
                "html2canvas 초기화에 실패했습니다.",
              ),
            );
          }
        };

        script.onerror = () => {
          html2canvasLoadingPromise = null;

          reject(
            new Error(
              "html2canvas 다운로드에 실패했습니다. 인터넷 연결을 확인해 주세요.",
            ),
          );
        };

        document.head.appendChild(script);
      },
    );

    return html2canvasLoadingPromise;
  }

  /* =======================================================
     이미지 로딩 대기
  ======================================================= */

  async function waitForImages(container) {
    const images = Array.from(
      container.querySelectorAll("img"),
    );

    const imagePromises = images.map((image) => {
      /*
       * hidden 이미지나 src가 없는 이미지는 기다릴 필요 없음
       */
      if (
        image.hidden ||
        !image.getAttribute("src")
      ) {
        return Promise.resolve();
      }

      if (image.complete) {
        /*
         * decode 지원 브라우저에서는 실제 디코딩까지 기다림
         */
        if (typeof image.decode === "function") {
          return image.decode().catch(() => undefined);
        }

        return Promise.resolve();
      }

      return new Promise((resolve) => {
        const finish = () => {
          image.removeEventListener("load", finish);
          image.removeEventListener("error", finish);

          resolve();
        };

        image.addEventListener("load", finish, {
          once: true,
        });

        image.addEventListener("error", finish, {
          once: true,
        });

        /*
         * 이미지 하나 때문에 저장이 영원히 멈추지 않도록 제한
         */
        window.setTimeout(finish, 10000);
      });
    });

    await Promise.all(imagePromises);
  }

  /* =======================================================
     폰트 로딩 대기
  ======================================================= */

  async function waitForFonts() {
    if (!document.fonts?.ready) {
      return;
    }

    try {
      await document.fonts.ready;
    } catch (error) {
      console.warn(
        "[LENSIA EXPORT] 웹폰트 로딩 확인에 실패했습니다.",
        error,
      );
    }
  }

  /* =======================================================
     브라우저 렌더링 대기
  ======================================================= */

  function waitForNextFrames(frameCount = 1) {
    return new Promise((resolve) => {
      let remainingFrames = Math.max(
        1,
        Number(frameCount) || 1,
      );

      const nextFrame = () => {
        remainingFrames -= 1;

        if (remainingFrames <= 0) {
          resolve();

          return;
        }

        requestAnimationFrame(nextFrame);
      };

      requestAnimationFrame(nextFrame);
    });
  }

  /* =======================================================
     PNG 다운로드
  ======================================================= */

  async function downloadCanvasAsPng(canvas) {
    const fileName = createFileName();

    /*
     * toBlob 방식이 toDataURL보다 메모리를 덜 사용함
     */
    const blob = await canvasToBlob(canvas);

    const objectUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");

    downloadLink.href = objectUrl;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);

    downloadLink.click();
    downloadLink.remove();

    /*
     * 브라우저가 파일 다운로드를 시작한 뒤 URL 해제
     */
    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "PNG 이미지 데이터를 생성하지 못했습니다.",
              ),
            );

            return;
          }

          resolve(blob);
        },
        "image/png",
        1,
      );
    });
  }

  /* =======================================================
     파일명 생성
  ======================================================= */

  function createFileName() {
    const typeCode =
      document
        .querySelector("#type-code")
        ?.textContent?.trim()
        .replace(/[^a-zA-Z0-9가-힣_-]/g, "") ||
      "RESULT";

    const now = new Date();

    const dateText = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("");

    const timeText = [
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
      String(now.getSeconds()).padStart(2, "0"),
    ].join("");

    return [
      EXPORT_CONFIG.fileNamePrefix,
      typeCode,
      dateText,
      timeText,
    ].join("_") + ".png";
  }

  /* =======================================================
     저장 버튼 상태
  ======================================================= */

  function setSaveButtonLoading(button, loading) {
    if (!button) {
      return;
    }

    button.classList.toggle(
      "is-exporting",
      loading,
    );

    button.disabled = loading;
    button.setAttribute(
      "aria-busy",
      String(loading),
    );
  }

  /* =======================================================
     안내 메시지
  ======================================================= */

  function showExportMessage(message) {
    /*
     * 기존 result.js의 토스트 함수가 있으면 우선 사용
     */
    if (
      typeof window.showResultToast === "function"
    ) {
      window.showResultToast(message);

      return;
    }

    /*
     * 기존 공통 toast 요소 사용
     */
    const toast = document.querySelector("#toast");

    if (!toast) {
      console.log(`[LENSIA EXPORT] ${message}`);

      return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(
      showExportMessage.timeoutId,
    );

    showExportMessage.timeoutId =
      window.setTimeout(() => {
        toast.classList.remove("show");
      }, 2400);
  }

  /* =======================================================
     DOM 준비 후 시작
  ======================================================= */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeResultExport,
      {
        once: true,
      },
    );
  } else {
    initializeResultExport();
  }
})();