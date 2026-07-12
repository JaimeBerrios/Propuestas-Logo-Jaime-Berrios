const cardPalettes = [
        ["#0D1117", "#00FFCC", "#FF007F"],
        ["#0B132B", "#415A77", "#778DA9"],
        ["#1E1E24", "#FF4A1C", "#E1E2EF"],
        ["#1A1A24", "#5865F2", "#FFFFFF"],
        ["#23272A", "#00D2FF", "#00FFF0"],
        ["#0F0F1A", "#7000FF", "#FFD700"],
        ["#111111", "#8E9AAF", "#EF233C"],
        ["#18181B", "#3B82F6", "#10B981"],
        ["#000000", "#39FF14", "#A3E635"],
        ["#2D3142", "#4F5D75", "#BFC0C0"],
        ["#03045E", "#0077B6", "#00B4D8"],
        ["#1C1C1E", "#D4AF37", "#FFFFFF"],
        ["#0F172A", "#F59E0B", "#38BDF8"],
        ["#09090B", "#EC4899", "#8B5CF6"],
        ["#1F2937", "#14B8A6", "#F3F4F6"],
        ["#111827", "#FF5722", "#FFC107"],
        ["#0F172A", "#2563EB", "#93C5FD"],
        ["#2E3440", "#81A1C1", "#EBCB8B"],
        ["#121214", "#833AB4", "#FD1D1D"]
      ];

      const toast = document.querySelector("#toastLite");
      const logoTextInput = document.querySelector("#logoTextInput");
      const logoSize = document.querySelector("#logoSize");
      const logoSizeValue = document.querySelector("#logoSizeValue");
      const monochromeToggle = document.querySelector("#monochromeToggle");
      const smallPreviewButtons = document.querySelectorAll(".small-preview-toggle");
      const logos = document.querySelectorAll(".logo-text");

      function showToast(message) {
        toast.textContent = message;
        toast.classList.add("is-visible");
        window.clearTimeout(showToast.timeout);
        showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
      }

      function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(() => showToast(`${text} copiado`));
          return;
        }

        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
        showToast(`${text} copiado`);
      }

      function applyLogoColor(card, logo) {
        if (document.body.classList.contains("is-monochrome")) {
          logo.style.color = "";
          return;
        }

        logo.style.color = card.dataset.color;
      }

      function runThemeTransition(event, switchTheme) {
        const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!document.startViewTransition || shouldReduceMotion) {
          switchTheme();
          return;
        }

        document.documentElement.style.setProperty("--theme-toggle-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--theme-toggle-y", `${event.clientY}px`);
        document.documentElement.classList.add("theme-transition-active");

        const transition = document.startViewTransition(switchTheme);
        transition.finished.finally(() => {
          document.documentElement.classList.remove("theme-transition-active");
        });
      }

      document.querySelectorAll(".proposal-card").forEach((card, cardIndex) => {
        const logo = card.querySelector(".logo-text");
        const swatchRow = card.querySelector(".swatch-row");
        const themeButton = card.querySelector(".theme-toggle");
        const themeIcon = themeButton.querySelector("i");
        const themeLabel = themeButton.querySelector("span");
        const palette = cardPalettes[cardIndex] || cardPalettes[0];

        card.dataset.color = palette[0];
        card.dataset.dark = "false";
        logo.style.color = palette[0];

        palette.forEach((color, index) => {
          const swatch = document.createElement("button");
          swatch.type = "button";
          swatch.className = `color-swatch${index === 0 ? " is-active" : ""}`;
          swatch.style.setProperty("--swatch-color", color);
          swatch.setAttribute("aria-label", `Aplicar color ${color}`);

          swatch.addEventListener("click", () => {
            card.dataset.color = color;
            applyLogoColor(card, logo);
            swatchRow.querySelectorAll(".color-swatch").forEach((item) => item.classList.remove("is-active"));
            swatch.classList.add("is-active");
          });

          swatch.addEventListener("dblclick", () => copyText(color));

          swatchRow.appendChild(swatch);
        });

        const copyHint = document.createElement("p");
        copyHint.className = "copy-hint mb-0";
        copyHint.textContent = "Doble clic en un color para copiar el HEX.";
        swatchRow.after(copyHint);

        themeButton.addEventListener("click", (event) => {
          runThemeTransition(event, () => {
            const isDark = card.classList.toggle("is-dark");
            card.dataset.dark = String(isDark);
            themeButton.classList.toggle("btn-outline-light", isDark);
            themeButton.classList.toggle("btn-outline-dark", !isDark);
            themeIcon.className = `fa-solid ${isDark ? "fa-sun" : "fa-moon"}`;
            themeLabel.textContent = isDark ? "Fondo blanco" : "Fondo negro";
          });
        });
      });

      logoSize.addEventListener("input", () => {
        const scale = Number(logoSize.value) / 100;
        document.documentElement.style.setProperty("--logo-scale", scale.toString());
        logoSizeValue.textContent = `${logoSize.value}%`;
      });

      logoTextInput.addEventListener("input", () => {
        const value = logoTextInput.value.trim() || "Jaime Berrios";
        logos.forEach((logo) => {
          logo.textContent = value;
        });
      });

      smallPreviewButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const mode = button.dataset.smallPreview;
          document.body.classList.toggle("small-preview-32", mode === "32");
          document.body.classList.toggle("small-preview-48", mode === "48");

          smallPreviewButtons.forEach((item) => {
            const isActive = item === button;
            item.classList.toggle("btn-dark", isActive);
            item.classList.toggle("btn-outline-dark", !isActive);
          });
        });
      });

      monochromeToggle.addEventListener("click", () => {
        const isActive = document.body.classList.toggle("is-monochrome");
        monochromeToggle.setAttribute("aria-pressed", String(isActive));
        monochromeToggle.classList.toggle("btn-dark", isActive);
        monochromeToggle.classList.toggle("btn-outline-dark", !isActive);

        document.querySelectorAll(".proposal-card").forEach((card) => {
          applyLogoColor(card, card.querySelector(".logo-text"));
        });
      });
