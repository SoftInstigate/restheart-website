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

      // Initialize the interactive elements and process code blocks with saved values
      this.$nextTick(() => {
        setTimeout(() => {
          this.markClientTypeElements();
          this.filterCodeBlocks();
          
          // If we have saved values, apply them to the code blocks immediately
          if (this.instanceUrl || this.username || this.password) {
            this.initializeCodeBlocks();
            this.updateExamples();
          }
        }, 100);
      });
    },

    // Initialize code block processing only when needed
    initializeCodeBlocks() {
      if (this.originalCodeBlocks.size === 0) {
        this.storeOriginalCodeBlocks();
      }
    },

    // Store original content with placeholders to allow re-replacement
    storeOriginalCodeBlocks() {
      const codeBlocks = document.querySelectorAll("pre code");

      codeBlocks.forEach((block, index) => {
        if (block.hasAttribute("data-block-id")) return; // Already processed
        
        // Use a unique ID for each block
        const blockId = `code-block-${index}`;
        block.setAttribute("data-block-id", blockId);
        
        // Store both the original text content and the HTML structure
        const originalText = block.textContent || block.innerText;
        const originalHTML = block.innerHTML;
        
        // More comprehensive highlighting detection
        const hasHighlighting = block.querySelector('span[class*="hljs"], span[class*="token"], span[class*="highlight"], span[class*="rouge"], span.s, span.k, span.o, span.p') !== null ||
                               block.innerHTML.includes('<span class=') ||
                               block.parentElement.classList.contains('highlight') ||
                               block.parentElement.classList.contains('highlighter-rouge');
        
        this.originalCodeBlocks.set(blockId, {
          text: originalText,
          html: originalHTML,
          hasHighlighting: hasHighlighting
        });
      });
    },

    // Helper method to replace text in HTML while preserving syntax highlighting
    replaceTextInHTML(html, replacements) {
      let result = html;
      replacements.forEach(({ from, to }) => {
        // Replace in text nodes only, preserving HTML tags
        const regex = new RegExp(from, 'g');
        result = result.replace(regex, to);
      });
      return result;
    },

    // Helper method to replace text in all text nodes of an element
    replaceTextInElement(element, replacements) {
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      const textNodes = [];
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }

      textNodes.forEach(textNode => {
        let text = textNode.textContent;
        replacements.forEach(({ from, to }) => {
          text = text.replace(new RegExp(from, 'g'), to);
        });
        textNode.textContent = text;
      });
    },

    // Methods
    updateExamples() {
      // Define all replacements - handle both plain text and HTML-separated brackets
      const replacements = [
        // Plain text patterns
        { from: '\\[INSTANCE-URL\\]', to: this.displayInstanceUrl },
        { from: '\\[YOUR-USERNAME\\]', to: this.displayUsername },
        { from: '\\[YOUR-PASSWORD\\]', to: this.displayPassword },
        { from: '\\[BASIC-AUTH\\]', to: this.basicAuth },
        { from: '\\[JWT\\]', to: this.displayJwt },
        // HTML-separated patterns (for syntax highlighted code where brackets are in spans)
        { from: '<span[^>]*class="o"[^>]*>\\[</span>INSTANCE-URL\\]', to: this.displayInstanceUrl },
        { from: '<span[^>]*class="o"[^>]*>\\[</span>YOUR-USERNAME\\]', to: this.displayUsername },
        { from: '<span[^>]*class="o"[^>]*>\\[</span>YOUR-PASSWORD\\]', to: this.displayPassword },
        { from: '<span[^>]*class="o"[^>]*>\\[</span>BASIC-AUTH\\]', to: this.basicAuth },
        { from: '<span[^>]*class="o"[^>]*>\\[</span>JWT\\]', to: this.displayJwt },
        // HTTPie parameter patterns (for placeholders like "param=[PLACEHOLDER]")
        { from: '<span[^>]*class="o"[^>]*>=\\[</span>YOUR-PASSWORD\\]', to: `=${this.displayPassword}` },
        { from: '<span[^>]*class="o"[^>]*>:\\s*"\\[</span>YOUR-PASSWORD\\]"', to: `: "${this.displayPassword}"` },
        { from: '<span[^>]*class="o"[^>]*>:\\s*"\\[</span>INSTANCE-URL\\]"', to: `: "${this.displayInstanceUrl}"` },
        { from: '<span[^>]*class="o"[^>]*>:\\s*"\\[</span>JWT\\]"', to: `: "${this.displayJwt}"` }
      ];

      // Update code blocks using the stored original content
      this.originalCodeBlocks.forEach((originalData, blockId) => {
        const block = document.querySelector(`[data-block-id="${blockId}"]`);
        
        if (block) {
          // Check if this block actually contains placeholders before updating
          const hasPlaceholders = originalData.text.match(/\[(?:INSTANCE-URL|YOUR-USERNAME|YOUR-PASSWORD|BASIC-AUTH|JWT)\]/);
          
          if (hasPlaceholders) {
            if (originalData.hasHighlighting) {
              // For highlighted code, update HTML while preserving structure
              let updatedHTML = originalData.html;
              
              replacements.forEach(({ from, to }) => {
                const replaceRegex = new RegExp(from, 'g');
                updatedHTML = updatedHTML.replace(replaceRegex, to);
              });
              block.innerHTML = updatedHTML;
            } else {
              // For non-highlighted code, use text replacement to preserve any basic formatting
              let content = originalData.text;
              replacements.forEach(({ from, to }) => {
                content = content.replace(new RegExp(from, 'g'), to);
              });
              block.textContent = content;
            }
          }
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
      this.initializeCodeBlocks();
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
      // Initialize code blocks if needed, then update examples and save values
      this.initializeCodeBlocks();
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

    setLocalhostDefaults() {
      this.instanceUrl = "http://localhost:8080";
      this.username = "admin";
      this.password = "secret";
      this.clientType = "all";
      this.jwt = "";

      // Save the values and update examples
      this.saveValues();
      this.$nextTick(() => {
        this.initializeCodeBlocks();
        this.updateExamples();
        this.filterCodeBlocks();
      });
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
        this.initializeCodeBlocks();
        this.updateExamples();
        this.filterCodeBlocks();
      });
    },
  }));
});
