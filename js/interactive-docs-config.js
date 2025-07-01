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

      // Initial setup
      this.$nextTick(() => {
        this.updateExamples();
        this.filterCodeBlocks();
      });
    },

    // Methods
    updateExamples() {
      // Find all code blocks and update placeholders
      document.querySelectorAll("pre code").forEach((codeBlock) => {
        let content = codeBlock.textContent;

        // Replace placeholders
        content = content.replace(/\[INSTANCE-URL\]/g, this.displayInstanceUrl);
        content = content.replace(/\[YOUR-USERNAME\]/g, this.displayUsername);
        content = content.replace(/\[YOUR-PASSWORD\]/g, this.displayPassword);
        content = content.replace(/\[BASIC-AUTH\]/g, this.basicAuth);
        content = content.replace(/\[JWT\]/g, this.displayJwt);

        // Update the content
        codeBlock.textContent = content;
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
      if (this.clientType === "all") {
        // Show all code blocks and headings
        document
          .querySelectorAll(".code-section, [data-client-type]")
          .forEach((section) => {
            section.style.display = "";
          });
        return;
      }

      // Find all headings and identify their type
      const allHeadings = document.querySelectorAll("h3, h4, h5, h6");

      allHeadings.forEach((heading) => {
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

          // Show/hide based on selection
          const shouldShow = this.clientType === sectionType;
          heading.style.display = shouldShow ? "" : "none";

          // Hide/show the code block
          nextElement = heading.nextElementSibling;
          while (
            nextElement &&
            !nextElement.matches("h1, h2, h3, h4, h5, h6")
          ) {
            if (
              nextElement.matches("pre") ||
              nextElement.querySelector("pre")
            ) {
              nextElement.style.display = shouldShow ? "" : "none";
              break;
            }
            nextElement = nextElement.nextElementSibling;
          }
        }
      });
    },

    onInputChange: Alpine.debounce(function () {
      this.updateExamples();
      this.saveValues();
    }, 300),

    onClientTypeChange() {
      this.updateExamples();
      this.filterCodeBlocks();
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
      this.clientType = localStorage.getItem("restheart-jwt") || "";
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

      this.updateExamples();
      this.filterCodeBlocks();
    },
  }));
});
