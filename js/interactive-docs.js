// interactive-docs.js - Interactive documentation with Bootstrap classes only

document.addEventListener("DOMContentLoaded", function () {
  // Debug: Check what elements exist
  console.log("Looking for interactive docs elements...");
  console.log(
    'querySelector(".interactive-docs"):',
    document.querySelector(".interactive-docs"),
  );
  console.log(
    'querySelector("h1.interactive-docs"):',
    document.querySelector("h1.interactive-docs"),
  );
  console.log(
    'Title includes "Interactive":',
    document.title.includes("Interactive"),
  );
  console.log(
    'Path includes "interactive":',
    window.location.pathname.includes("interactive"),
  );

  // Check if we're on the interactive docs page - multiple ways to detect
  const isInteractiveDocs =
    document.querySelector(".interactive-docs") ||
    document.querySelector("h1.interactive-docs") ||
    document.title.includes("Interactive Documentation") ||
    window.location.pathname.includes("interactive-documentation");

  console.log("isInteractiveDocs:", isInteractiveDocs);

  if (!isInteractiveDocs) {
    console.log("Not on interactive docs page, exiting...");
    return;
  }

  console.log("Interactive docs detected, initializing...");

  // Create and inject the configuration panel
  createConfigPanel();

  // Setup event listeners
  setupEventListeners();

  // Load saved values from localStorage
  loadSavedValues();
});

function createConfigPanel() {
  const configHTML = `
        <div class="config-panel border rounded p-4 my-4">
            <h3 class="mb-3">🔧 Configuration</h3>
            <div class="row g-3 mb-3">
                <div class="col-md-3">
                    <label class="form-label fw-bold">Client Type</label>
                    <select id="client-type" class="form-select">
                        <option value="all">Show All</option>
                        <option value="curl">cURL</option>
                        <option value="httpie">HTTPie</option>
                        <option value="javascript">JavaScript</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-bold">Instance URL</label>
                    <input type="text" id="instance-url" class="form-control" placeholder="https://your-instance.restheart.com" />
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-bold">Username</label>
                    <input type="text" id="username" class="form-control" placeholder="your_username" />
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-bold">Password</label>
                    <input type="password" id="password" class="form-control" placeholder="your_password" />
                </div>
            </div>

            <div class="setup-warning border rounded p-3 mt-3">
                <h4 class="mb-2">⚠️ Setup Required</h4>
                <p class="mb-0">Before using these examples, create a user account using your JWT token, then enter those credentials above.</p>
            </div>
            <div class="mt-3">
                <button id="clear-values" class="btn btn-danger">Clear Values</button>
                <small class="text-muted ms-2">Values are saved in your browser</small>
            </div>
        </div>
    `;

  // Find the first h2 or section to insert the config panel after
  const firstSection = document.querySelector(
    ".interactive-docs h2, .interactive-docs .sect2",
  );
  if (firstSection) {
    firstSection.insertAdjacentHTML("beforebegin", configHTML);
  }
}

function setupEventListeners() {
  const instanceUrl = document.getElementById("instance-url");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const clientType = document.getElementById("client-type");
  const clearBtn = document.getElementById("clear-values");

  if (!instanceUrl || !username || !password || !clientType) return;

  // Update examples when values change
  [instanceUrl, username, password].forEach((input) => {
    input.addEventListener("input", debounce(updateExamples, 300));
    input.addEventListener("blur", saveValues);
  });

  // Update visibility when client type changes
  clientType.addEventListener("change", () => {
    updateExamples();
    filterCodeBlocks();
    saveValues();
  });

  // Clear values button
  if (clearBtn) {
    clearBtn.addEventListener("click", clearValues);
  }

  // Initial filter
  filterCodeBlocks();
}

function updateExamples() {
  const instanceUrl =
    document.getElementById("instance-url")?.value || "[INSTANCE-URL]";
  const username =
    document.getElementById("username")?.value || "[YOUR-USERNAME]";
  const password =
    document.getElementById("password")?.value || "[YOUR-PASSWORD]";

  // Generate basic auth if we have both username and password
  const basicAuth =
    username !== "[YOUR-USERNAME]" && password !== "[YOUR-PASSWORD]"
      ? btoa(`${username}:${password}`)
      : "[BASIC-AUTH]";

  // Find all code blocks and update placeholders
  document
    .querySelectorAll("pre code, .listingblock pre")
    .forEach((codeBlock) => {
      let content = codeBlock.textContent;

      // Replace placeholders
      content = content.replace(/\[INSTANCE-URL\]/g, instanceUrl);
      content = content.replace(/\[YOUR-USERNAME\]/g, username);
      content = content.replace(/\[YOUR-PASSWORD\]/g, password);
      content = content.replace(/\[BASIC-AUTH\]/g, basicAuth);

      // Update the content
      codeBlock.textContent = content;
    });

  // Update any dynamic spans (if using HTML)
  document
    .querySelectorAll(".dynamic-url")
    .forEach((el) => (el.textContent = instanceUrl));
  document
    .querySelectorAll(".dynamic-username")
    .forEach((el) => (el.textContent = username));
  document
    .querySelectorAll(".dynamic-password")
    .forEach((el) => (el.textContent = password));
  document
    .querySelectorAll(".dynamic-basic-auth")
    .forEach((el) => (el.textContent = basicAuth));
}

function filterCodeBlocks() {
  const selectedType = document.getElementById("client-type")?.value || "all";

  if (selectedType === "all") {
    // Show all code blocks and headings
    document
      .querySelectorAll(".code-section, [data-client-type]")
      .forEach((section) => {
        section.style.display = "";
      });
    updateConfigPanelStatus();
    return;
  }

  // Find all headings and identify their type more broadly
  const allHeadings = document.querySelectorAll("h3, h4, h5, h6");

  allHeadings.forEach((heading) => {
    const headingText = heading.textContent.toLowerCase().trim();
    let sectionType = null;

    // More comprehensive type detection
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
        !nextElement.matches("pre, .listingblock, h1, h2, h3, h4, h5, h6")
      ) {
        if (nextElement.matches("pre, .listingblock")) {
          nextElement.classList.add("code-section");
          nextElement.setAttribute("data-client-type", sectionType);
          break;
        }
        // Also check inside divs for AsciiDoc generated content
        const codeInside = nextElement.querySelector("pre, .listingblock");
        if (codeInside) {
          codeInside.classList.add("code-section");
          codeInside.setAttribute("data-client-type", sectionType);
          break;
        }
        nextElement = nextElement.nextElementSibling;
      }

      // Show/hide based on selection
      const shouldShow = selectedType === sectionType;
      heading.style.display = shouldShow ? "" : "none";

      // Hide/show the code block
      nextElement = heading.nextElementSibling;
      while (nextElement && !nextElement.matches("h1, h2, h3, h4, h5, h6")) {
        if (
          nextElement.matches("pre, .listingblock") ||
          nextElement.querySelector("pre, .listingblock")
        ) {
          nextElement.style.display = shouldShow ? "" : "none";
          break;
        }
        nextElement = nextElement.nextElementSibling;
      }
    }
  });

  updateConfigPanelStatus();
}

function updateConfigPanelStatus() {
  const selectedType = document.getElementById("client-type")?.value || "all";
  const configPanel = document.querySelector(".config-panel");

  if (!configPanel) return;

  // Remove existing status if any
  const existingStatus = configPanel.querySelector(".client-status");
  if (existingStatus) {
    existingStatus.remove();
  }

  // Add status indicator
  if (selectedType !== "all") {
    const statusDiv = document.createElement("div");
    statusDiv.className = "client-status border rounded p-2 mt-3";
    statusDiv.innerHTML = `📱 Showing only <strong>${selectedType.toUpperCase()}</strong> examples`;
    configPanel.appendChild(statusDiv);
  }
}

function saveValues() {
  const instanceUrl = document.getElementById("instance-url")?.value;
  const username = document.getElementById("username")?.value;
  const password = document.getElementById("password")?.value;
  const clientType = document.getElementById("client-type")?.value;

  localStorage.setItem("restheart-instance-url", instanceUrl || "");
  localStorage.setItem("restheart-username", username || "");
  localStorage.setItem("restheart-password", password || "");
  localStorage.setItem("restheart-client-type", clientType || "all");
}

function loadSavedValues() {
  const instanceUrl = localStorage.getItem("restheart-instance-url");
  const username = localStorage.getItem("restheart-username");
  const password = localStorage.getItem("restheart-password");
  const clientType = localStorage.getItem("restheart-client-type");

  if (instanceUrl) document.getElementById("instance-url").value = instanceUrl;
  if (username) document.getElementById("username").value = username;
  if (password) document.getElementById("password").value = password;
  if (clientType) document.getElementById("client-type").value = clientType;

  // Update examples with loaded values
  if (instanceUrl || username || password) {
    updateExamples();
  }

  // Apply client type filter
  filterCodeBlocks();
}

function clearValues() {
  document.getElementById("instance-url").value = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("client-type").value = "all";

  localStorage.removeItem("restheart-instance-url");
  localStorage.removeItem("restheart-username");
  localStorage.removeItem("restheart-password");
  localStorage.removeItem("restheart-client-type");

  updateExamples();
  filterCodeBlocks();
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
