// interactive-docs.js - Interactive documentation using Alpine.js

document.addEventListener("alpine:init", () => {
  Alpine.data("interactiveDocs", () => ({
    // State
    instanceUrl: "",
    username: "",
    password: "",
    clientType: "all",
    jwt: "",
    isInitialized: false,
    originalCodeBlocks: new Map(), // Store original content for each code block

    // Computed properties
    get basicAuth() {
      return this.username &&
        this.password &&
        this.username !== "[YOUR-USERNAME]" &&
        this.password !== "[YOUR-PASSWORD]"
        ? btoa(`${this.username}:${this.password}`)
        : "[BASIC-AUTH]";
    },

    get displayInstanceUrl() {
      return this.instanceUrl || "[INSTANCE-URL]";
    },

    get displayUsername() {
      return this.username || "[YOUR-USERNAME]";
    },

    get displayPassword() {
      return this.password || "[YOUR-PASSWORD]";
    },

    get displayJwt() {
      return this.jwt || "[JWT]";
    },

    get isShowingFiltered() {
      return this.clientType !== "all";
    },

    get filteredClientName() {
      return this.clientType.toUpperCase();
    },

    // Lifecycle
    init() {
      this.loadSavedValues();
      this.isInitialized = true;

      // Initial setup with delay to ensure AsciiDoc content is fully rendered
      this.$nextTick(() => {
        setTimeout(() => {
          this.storeOriginalCodeBlocks();
          this.markClientTypeElements();
          this.updateExamples();
          this.filterCodeBlocks();
        }, 500);
      });
    },

    // Store original content with placeholders to allow re-replacement
    storeOriginalCodeBlocks() {
      const codeBlocks = document.querySelectorAll("pre code");

      codeBlocks.forEach((block, index) => {
        const content = block.textContent || block.innerText;
        if (content) {
          // Use a unique ID for each block
          const blockId = `code-block-${index}`;
          block.setAttribute("data-block-id", blockId);
          this.originalCodeBlocks.set(blockId, content);
        }
      });

      // Also look for AsciiDoc-rendered code blocks
      const asciiDocBlocks = document.querySelectorAll("pre code");
      asciiDocBlocks.forEach((block, index) => {
        if (block.hasAttribute("data-block-id")) return; // Already processed

        const content = block.textContent || block.innerText;
        if (content) {
          const blockId = `asciidoc-block-${index}`;
          block.setAttribute("data-block-id", blockId);
          this.originalCodeBlocks.set(blockId, content);
        }
      });
    },

    // Methods
    updateExamples() {
      // Update code blocks using the stored original content
      this.originalCodeBlocks.forEach((originalContent, blockId) => {
        const block = document.querySelector(`[data-block-id="${blockId}"]`);
        if (block) {
          let content = originalContent;

          // Replace placeholders with current values
          content = content.replace(
            /\[INSTANCE-URL\]/g,
            this.displayInstanceUrl,
          );
          content = content.replace(/\[YOUR-USERNAME\]/g, this.displayUsername);
          content = content.replace(/\[YOUR-PASSWORD\]/g, this.displayPassword);
          content = content.replace(/\[BASIC-AUTH\]/g, this.basicAuth);
          content = content.replace(/\[JWT\]/g, this.displayJwt);

          // Update block content
          block.textContent = content;
        }
      });

      // Update any dynamic spans (if using HTML)
      document
        .querySelectorAll(".dynamic-url")
        .forEach((el) => (el.textContent = this.displayInstanceUrl));
      document
        .querySelectorAll(".dynamic-username")
        .forEach((el) => (el.textContent = this.displayUsername));
      document
        .querySelectorAll(".dynamic-password")
        .forEach((el) => (el.textContent = this.displayPassword));
      document
        .querySelectorAll(".dynamic-basic-auth")
        .forEach((el) => (el.textContent = this.basicAuth));
      document
        .querySelectorAll(".dynamic-jwt")
        .forEach((el) => (el.textContent = this.jwt));
    },

    filterCodeBlocks() {
      // Mark all elements for their client type if not already done
      this.markClientTypeElements();

      if (this.clientType === "all") {
        // Show all code blocks and headings
        document
          .querySelectorAll(".code-section, [data-client-type]")
          .forEach((section) => {
            section.style.display = "";
          });
        return;
      }

      // Now that elements are marked, just toggle visibility based on client type
      document.querySelectorAll("[data-client-type]").forEach((element) => {
        const elementType = element.getAttribute("data-client-type");
        element.style.display =
          this.clientType === "all" || elementType === this.clientType
            ? ""
            : "none";
      });
    },

    onInputChange: Alpine.debounce(function () {
      this.updateExamples();
      this.saveValues();
    }, 100),

    // New method to mark client types once
    markClientTypeElements() {
      // Find all headings and identify their type
      const allHeadings = document.querySelectorAll("h3, h4, h5, h6");

      allHeadings.forEach((heading) => {
        // Skip if already processed
        if (heading.hasAttribute("data-client-type")) return;

        const headingText = heading.textContent.toLowerCase().trim();
        let sectionType = null;

        // Comprehensive type detection
        if (
          headingText === "curl" ||
          headingText.includes("curl") ||
          headingText.startsWith("curl")
        ) {
          sectionType = "curl";
        } else if (
          headingText === "httpie" ||
          headingText.includes("httpie") ||
          headingText.startsWith("httpie")
        ) {
          sectionType = "httpie";
        } else if (
          headingText === "javascript" ||
          headingText.includes("javascript") ||
          headingText.startsWith("javascript")
        ) {
          sectionType = "javascript";
        }

        // If this is a client-specific heading
        if (sectionType) {
          // Mark the heading
          heading.classList.add("code-section");
          heading.setAttribute("data-client-type", sectionType);

          // Find and mark the associated code block
          let nextElement = heading.nextElementSibling;
          while (
            nextElement &&
            !nextElement.matches("pre, h1, h2, h3, h4, h5, h6")
          ) {
            if (nextElement.matches("pre")) {
              nextElement.classList.add("code-section");
              nextElement.setAttribute("data-client-type", sectionType);
              break;
            }
            // Also check inside divs for AsciiDoc generated content
            const codeInside = nextElement.querySelector("pre");
            if (codeInside) {
              codeInside.classList.add("code-section");
              codeInside.setAttribute("data-client-type", sectionType);
              break;
            }
            nextElement = nextElement.nextElementSibling;
          }
        }
      });
    },

    onClientTypeChange() {
      // Always update examples and save values
      this.updateExamples();

      // Use the filterCodeBlocks method to handle visibility
      this.filterCodeBlocks();

      // Save the current selection
      this.saveValues();
    },

    saveValues() {
      localStorage.setItem("restheart-instance-url", this.instanceUrl);
      localStorage.setItem("restheart-username", this.username);
      localStorage.setItem("restheart-password", this.password);
      localStorage.setItem("restheart-client-type", this.clientType);
      localStorage.setItem("restheart-jwt", this.jwt);
    },

    loadSavedValues() {
      this.instanceUrl = localStorage.getItem("restheart-instance-url") || "";
      this.username = localStorage.getItem("restheart-username") || "";
      this.password = localStorage.getItem("restheart-password") || "";
      this.clientType = localStorage.getItem("restheart-client-type") || "all";
      this.jwt = localStorage.getItem("restheart-jwt") || "";

      // No need to call updateExamples here since Alpine reactivity will trigger it
      // when we set the values above
    },

    clearValues() {
      this.instanceUrl = "";
      this.username = "";
      this.password = "";
      this.clientType = "all";
      this.jwt = "";

      localStorage.removeItem("restheart-instance-url");
      localStorage.removeItem("restheart-username");
      localStorage.removeItem("restheart-password");
      localStorage.removeItem("restheart-client-type");
      localStorage.removeItem("restheart-jwt");

      // Update examples and reapply filtering with a slight delay to ensure DOM updates
      this.$nextTick(() => {
        this.updateExamples();
        this.filterCodeBlocks();
      });
    },
  }));
});
