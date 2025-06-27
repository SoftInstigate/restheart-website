// root-user-setup.js - Root user setup wizard with Bootstrap classes only

document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the root user setup page
  const isRootSetupPage =
    document.querySelector(".root-user-setup") ||
    document.title.includes("Root User Setup") ||
    window.location.pathname.includes("root-user-setup");

  if (!isRootSetupPage) return;

  console.log("Root user setup page detected, initializing...");

  // Create and inject the setup wizard
  createSetupWizard();

  // Setup event listeners
  setupEventListeners();

  // Load saved values from localStorage
  loadSavedValues();
});

function createSetupWizard() {
  const wizardHTML = `
        <!-- Step 1: JWT Token Configuration -->
        <div class="setup-step border rounded p-4 my-4">
            <h3 class="mb-3">🔑 Step 1: JWT Token Configuration</h3>
            <div class="row g-3 mb-3">
                <div class="col-md-6">
                    <label class="form-label fw-bold">Instance URL</label>
                    <input type="text" id="instance-url" class="form-control" placeholder="https://your-instance.restheart.com" />
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-bold">JWT Token</label>
                    <input type="password" id="jwt-token" class="form-control" placeholder="Your temporary JWT token" />
                </div>
            </div>
            <div class="alert alert-info mb-0">
                <strong>Where to find your JWT token:</strong> Go to your RESTHeart Cloud dashboard → API Instance → Security → Generate Setup Token
            </div>
        </div>

        <!-- Step 2: Root User Creation -->
        <div class="setup-step border rounded p-4 my-4">
            <h3 class="mb-3">👤 Step 2: Create Root User</h3>
            <div class="row g-3 mb-3">
                <div class="col-md-4">
                    <label class="form-label fw-bold">Username</label>
                    <input type="text" id="root-username" class="form-control" placeholder="root" value="root" />
                </div>
                <div class="col-md-4">
                    <label class="form-label fw-bold">Password</label>
                    <input type="password" id="root-password" class="form-control" placeholder="Choose a strong password" />
                </div>
                <div class="col-md-4">
                    <label class="form-label fw-bold">Email (Optional)</label>
                    <input type="email" id="root-email" class="form-control" placeholder="admin@yourdomain.com" />
                </div>
            </div>
            <button id="create-user-btn" class="btn btn-primary me-2">Create Root User</button>
            <div class="d-inline-block">
                <div id="user-status" class="text-muted small"></div>
            </div>
        </div>

        <!-- Step 3: Permission Setup -->
        <div class="setup-step border rounded p-4 my-4">
            <h3 class="mb-3">🔐 Step 3: Set Up Admin Permissions</h3>
            <div class="mb-3">
                <label class="form-label fw-bold">Permission Configuration</label>
                <textarea id="permission-json" class="form-control" rows="12" readonly>{
  "_id": "adminCanDoEverything",
  "predicate": "path-prefix('/')",
  "roles": ["root"],
  "priority": 0,
  "mongo": {
    "allowManagementRequests": true,
    "allowBulkPatch": true,
    "allowBulkDelete": true,
    "allowWriteMode": true
  }
}</textarea>
            </div>
            <button id="create-permission-btn" class="btn btn-success me-2">Create Admin Permission</button>
            <div class="d-inline-block">
                <div id="permission-status" class="text-muted small"></div>
            </div>
        </div>

        <!-- Step 4: Test Setup -->
        <div class="setup-step border rounded p-4 my-4">
            <h3 class="mb-3">✅ Step 4: Test Your Setup</h3>
            <div class="mb-3">
                <p class="mb-2">Test that your root user can authenticate and access the system:</p>
                <button id="test-auth-btn" class="btn btn-info me-2">Test Authentication</button>
                <button id="test-permissions-btn" class="btn btn-warning me-2">Test Permissions</button>
            </div>
            <div id="test-results" class="border rounded p-3 d-none">
                <h5>Test Results:</h5>
                <div id="test-output"></div>
            </div>
        </div>

        <!-- Generated Commands -->
        <div class="setup-step border rounded p-4 my-4">
            <h3 class="mb-3">📋 Generated Commands</h3>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label class="form-label fw-bold">Client Type</label>
                    <select id="client-type" class="form-select">
                        <option value="all">Show All</option>
                        <option value="curl">cURL</option>
                        <option value="httpie">HTTPie</option>
                        <option value="javascript">JavaScript</option>
                    </select>
                </div>
                <div class="col-md-6 d-flex align-items-end">
                    <button id="clear-all-btn" class="btn btn-secondary">🗑️ Clear All Data</button>
                </div>
            </div>
            <p class="text-muted">Copy these commands to create your root user manually:</p>

            <div class="command-section">
                <h5 class="mt-3">Create User</h5>

                <div class="curl-section">
                    <h6>cURL</h6>
                    <div class="position-relative">
                        <button class="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 mt-2 me-2 copy-btn" data-target="create-user-curl">Copy</button>
                        <pre id="create-user-curl" class="bg-light p-3 rounded"><code># Will be generated when you fill the form above</code></pre>
                    </div>
                </div>

                <div class="httpie-section">
                    <h6>HTTPie</h6>
                    <div class="position-relative">
                        <button class="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 mt-2 me-2 copy-btn" data-target="create-user-httpie">Copy</button>
                        <pre id="create-user-httpie" class="bg-light p-3 rounded"><code># Will be generated when you fill the form above</code></pre>
                    </div>
                </div>

                <div class="javascript-section">
                    <h6>JavaScript</h6>
                    <div class="position-relative">
                        <button class="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 mt-2 me-2 copy-btn" data-target="create-user-js">Copy</button>
                        <pre id="create-user-js" class="bg-light p-3 rounded"><code>// Will be generated when you fill the form above</code></pre>
                    </div>
                </div>
            </div>

            <div class="command-section">
                <h5 class="mt-4">Create Permission</h5>

                <div class="curl-section">
                    <h6>cURL</h6>
                    <div class="position-relative">
                        <button class="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 mt-2 me-2 copy-btn" data-target="create-permission-curl">Copy</button>
                        <pre id="create-permission-curl" class="bg-light p-3 rounded"><code># Will be generated when you fill the form above</code></pre>
                    </div>
                </div>

                <div class="httpie-section">
                    <h6>HTTPie</h6>
                    <div class="position-relative">
                        <button class="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 mt-2 me-2 copy-btn" data-target="create-permission-httpie">Copy</button>
                        <pre id="create-permission-httpie" class="bg-light p-3 rounded"><code># Will be generated when you fill the form above</code></pre>
                    </div>
                </div>

                <div class="javascript-section">
                    <h6>JavaScript</h6>
                    <div class="position-relative">
                        <button class="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 mt-2 me-2 copy-btn" data-target="create-permission-js">Copy</button>
                        <pre id="create-permission-js" class="bg-light p-3 rounded"><code>// Will be generated when you fill the form above</code></pre>
                    </div>
                </div>
            </div>

            <div class="command-section">
                <h5 class="mt-4">Test Authentication</h5>

                <div class="curl-section">
                    <h6>cURL</h6>
                    <div class="position-relative">
                        <button class="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 mt-2 me-2 copy-btn" data-target="test-auth-curl">Copy</button>
                        <pre id="test-auth-curl" class="bg-light p-3 rounded"><code># Will be generated when you fill the form above</code></pre>
                    </div>
                </div>

                <div class="httpie-section">
                    <h6>HTTPie</h6>
                    <div class="position-relative">
                        <button class="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 mt-2 me-2 copy-btn" data-target="test-auth-httpie">Copy</button>
                        <pre id="test-auth-httpie" class="bg-light p-3 rounded"><code># Will be generated when you fill the form above</code></pre>
                    </div>
                </div>

                <div class="javascript-section">
                    <h6>JavaScript</h6>
                    <div class="position-relative">
                        <button class="btn btn-sm btn-outline-secondary position-absolute top-0 end-0 mt-2 me-2 copy-btn" data-target="test-auth-js">Copy</button>
                        <pre id="test-auth-js" class="bg-light p-3 rounded"><code>// Will be generated when you fill the form above</code></pre>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Find where to insert the wizard
  const firstSection = document.querySelector(
    ".root-user-setup h2, .root-user-setup .sect2",
  );
  if (firstSection) {
    firstSection.insertAdjacentHTML("beforebegin", wizardHTML);
  }
}

function setupEventListeners() {
  // Form inputs for real-time updates
  const inputs = [
    "instance-url",
    "jwt-token",
    "root-username",
    "root-password",
    "root-email",
  ];
  inputs.forEach((inputId) => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener("input", debounce(updateGeneratedCommands, 300));
      input.addEventListener("blur", saveValues);
    }
  });

  // Client type selector
  const clientType = document.getElementById("client-type");
  if (clientType) {
    clientType.addEventListener("change", () => {
      filterClientSections();
      saveValues();
    });
  }

  // Action buttons
  setupButton("create-user-btn", createRootUser);
  setupButton("create-permission-btn", createPermission);
  setupButton("test-auth-btn", testAuthentication);
  setupButton("test-permissions-btn", testPermissions);
  setupButton("setup-all-btn", setupEverything);
  setupButton("clear-all-btn", clearAllData);

  // Copy buttons
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", handleCopyClick);
  });

  // Initial command generation and filtering
  updateGeneratedCommands();
  filterClientSections();
}

function setupButton(buttonId, handler) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener("click", handler);
  }
}

function updateGeneratedCommands() {
  const instanceUrl =
    document.getElementById("instance-url")?.value || "[INSTANCE-URL]";
  const jwtToken = document.getElementById("jwt-token")?.value || "[JWT-TOKEN]";
  const username =
    document.getElementById("root-username")?.value || "[USERNAME]";
  const password =
    document.getElementById("root-password")?.value || "[PASSWORD]";
  const email = document.getElementById("root-email")?.value || "";

  // Create user commands
  const createUserCurl = `curl -X POST ${instanceUrl}/users \\
     -H "Authorization: Bearer ${jwtToken}" \\
     -H "Content-Type: application/json" \\
     -d '{
         "_id": "${username}",
         "password": "${password}",
         "roles": ["root"]${email ? `,\n         "email": "${email}"` : ""}
     }'`;

  const createUserHttpie = `http POST ${instanceUrl}/users \\
     Authorization:"Bearer ${jwtToken}" \\
     _id="${username}" \\
     password="${password}" \\
     roles:='["root"]'${email ? ` \\\n     email="${email}"` : ""}`;

  const createUserJs = `fetch('${instanceUrl}/users', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ${jwtToken}',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        _id: '${username}',
        password: '${password}',
        roles: ['root']${email ? `,\n        email: '${email}'` : ""}
    })
})`;

  // Create permission commands
  const createPermissionCurl = `curl -X POST ${instanceUrl}/acl \\
     -H "Authorization: Bearer ${jwtToken}" \\
     -H "Content-Type: application/json" \\
     -d '{
         "_id": "adminCanDoEverything",
         "predicate": "path-prefix('/')",
         "roles": ["root"],
         "priority": 0,
         "mongo": {
             "allowManagementRequests": true,
             "allowBulkPatch": true,
             "allowBulkDelete": true,
             "allowWriteMode": true
         }
     }'`;

  const createPermissionHttpie = `http POST ${instanceUrl}/acl \\
     Authorization:"Bearer ${jwtToken}" \\
     _id="adminCanDoEverything" \\
     predicate="path-prefix('/')" \\
     roles:='["root"]' \\
     priority:=0 \\
     mongo:='{
         "allowManagementRequests": true,
         "allowBulkPatch": true,
         "allowBulkDelete": true,
         "allowWriteMode": true
     }'`;

  const createPermissionJs = `fetch('${instanceUrl}/acl', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ${jwtToken}',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        _id: 'adminCanDoEverything',
        predicate: "path-prefix('/')",
        roles: ['root'],
        priority: 0,
        mongo: {
            allowManagementRequests: true,
            allowBulkPatch: true,
            allowBulkDelete: true,
            allowWriteMode: true
        }
    })
})`;

  // Test authentication commands
  const basicAuth =
    username !== "[USERNAME]" && password !== "[PASSWORD]"
      ? btoa(`${username}:${password}`)
      : "[BASIC-AUTH]";

  const testAuthCurl = `curl -X GET ${instanceUrl}/users/${username} \\
     -u ${username}:${password}`;

  const testAuthHttpie = `http GET ${instanceUrl}/users/${username} \\
     --auth ${username}:${password}`;

  const testAuthJs = `fetch('${instanceUrl}/users/${username}', {
    headers: {
        'Authorization': 'Basic ${basicAuth}'
    }
})`;

  // Update all command displays
  updateElement("create-user-curl", createUserCurl);
  updateElement("create-user-httpie", createUserHttpie);
  updateElement("create-user-js", createUserJs);

  updateElement("create-permission-curl", createPermissionCurl);
  updateElement("create-permission-httpie", createPermissionHttpie);
  updateElement("create-permission-js", createPermissionJs);

  updateElement("test-auth-curl", testAuthCurl);
  updateElement("test-auth-httpie", testAuthHttpie);
  updateElement("test-auth-js", testAuthJs);
}

function updateElement(id, content) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = content;
  }
}

function filterClientSections() {
  const selectedType = document.getElementById("client-type")?.value || "all";

  // Find all client sections
  const curlSections = document.querySelectorAll(".curl-section");
  const httpieSections = document.querySelectorAll(".httpie-section");
  const jsSections = document.querySelectorAll(".javascript-section");

  // Show/hide based on selection
  curlSections.forEach((section) => {
    section.style.display =
      selectedType === "all" || selectedType === "curl" ? "" : "none";
  });

  httpieSections.forEach((section) => {
    section.style.display =
      selectedType === "all" || selectedType === "httpie" ? "" : "none";
  });

  jsSections.forEach((section) => {
    section.style.display =
      selectedType === "all" || selectedType === "javascript" ? "" : "none";
  });
}

async function createRootUser() {
  const statusEl = document.getElementById("user-status");
  const btn = document.getElementById("create-user-btn");

  try {
    btn.disabled = true;
    btn.textContent = "Creating...";
    statusEl.textContent = "Creating root user...";
    statusEl.className = "text-info small";

    const instanceUrl = document.getElementById("instance-url").value;
    const jwtToken = document.getElementById("jwt-token").value;
    const username = document.getElementById("root-username").value;
    const password = document.getElementById("root-password").value;
    const email = document.getElementById("root-email").value;

    if (!instanceUrl || !jwtToken || !username || !password) {
      throw new Error("Please fill in all required fields");
    }

    const userData = {
      _id: username,
      password: password,
      roles: ["root"],
    };

    if (email) {
      userData.email = email;
    }

    const response = await fetch(`${instanceUrl}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      statusEl.textContent = "✅ Root user created successfully!";
      statusEl.className = "text-success small";
    } else {
      const error = await response.text();
      throw new Error(`Failed to create user: ${response.status} ${error}`);
    }
  } catch (error) {
    console.error("Error creating root user:", error);
    statusEl.textContent = `❌ Error: ${error.message}`;
    statusEl.className = "text-danger small";
  } finally {
    btn.disabled = false;
    btn.textContent = "Create Root User";
  }
}

async function createPermission() {
  const statusEl = document.getElementById("permission-status");
  const btn = document.getElementById("create-permission-btn");

  try {
    btn.disabled = true;
    btn.textContent = "Creating...";
    statusEl.textContent = "Creating admin permission...";
    statusEl.className = "text-info small";

    const instanceUrl = document.getElementById("instance-url").value;
    const jwtToken = document.getElementById("jwt-token").value;

    if (!instanceUrl || !jwtToken) {
      throw new Error("Please provide instance URL and JWT token");
    }

    const permissionData = {
      _id: "adminCanDoEverything",
      predicate: "path-prefix('/')",
      roles: ["root"],
      priority: 0,
      mongo: {
        allowManagementRequests: true,
        allowBulkPatch: true,
        allowBulkDelete: true,
        allowWriteMode: true,
      },
    };

    const response = await fetch(`${instanceUrl}/acl`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(permissionData),
    });

    if (response.ok) {
      statusEl.textContent = "✅ Admin permission created successfully!";
      statusEl.className = "text-success small";
    } else {
      const error = await response.text();
      throw new Error(
        `Failed to create permission: ${response.status} ${error}`,
      );
    }
  } catch (error) {
    console.error("Error creating permission:", error);
    statusEl.textContent = `❌ Error: ${error.message}`;
    statusEl.className = "text-danger small";
  } finally {
    btn.disabled = false;
    btn.textContent = "Create Admin Permission";
  }
}

async function testAuthentication() {
  const resultsEl = document.getElementById("test-results");
  const outputEl = document.getElementById("test-output");
  const btn = document.getElementById("test-auth-btn");

  try {
    btn.disabled = true;
    btn.textContent = "Testing...";
    resultsEl.classList.remove("d-none");
    outputEl.innerHTML =
      '<div class="text-info">Testing authentication...</div>';

    const instanceUrl = document.getElementById("instance-url").value;
    const username = document.getElementById("root-username").value;
    const password = document.getElementById("root-password").value;

    if (!instanceUrl || !username || !password) {
      throw new Error("Please fill in all required fields");
    }

    const credentials = btoa(`${username}:${password}`);
    const response = await fetch(`${instanceUrl}/users/${username}`, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      outputEl.innerHTML = `
                <div class="text-success mb-2">✅ Authentication successful!</div>
                <div class="small">
                    <strong>User Details:</strong><br>
                    Username: ${userData._id}<br>
                    Roles: ${JSON.stringify(userData.roles)}<br>
                    Email: ${userData.email || "Not set"}
                </div>
            `;
    } else {
      throw new Error(`Authentication failed: ${response.status}`);
    }
  } catch (error) {
    console.error("Error testing authentication:", error);
    outputEl.innerHTML = `<div class="text-danger">❌ ${error.message}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "Test Authentication";
  }
}

async function testPermissions() {
  const resultsEl = document.getElementById("test-results");
  const outputEl = document.getElementById("test-output");
  const btn = document.getElementById("test-permissions-btn");

  try {
    btn.disabled = true;
    btn.textContent = "Testing...";
    resultsEl.classList.remove("d-none");
    outputEl.innerHTML = '<div class="text-info">Testing permissions...</div>';

    const instanceUrl = document.getElementById("instance-url").value;
    const username = document.getElementById("root-username").value;
    const password = document.getElementById("root-password").value;

    if (!instanceUrl || !username || !password) {
      throw new Error("Please fill in all required fields");
    }

    const credentials = btoa(`${username}:${password}`);

    // Test access to ACL collection
    const response = await fetch(`${instanceUrl}/acl`, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (response.ok) {
      const aclData = await response.json();
      outputEl.innerHTML = `
                <div class="text-success mb-2">✅ Permissions working correctly!</div>
                <div class="small">
                    <strong>ACL Access Test:</strong><br>
                    Status: ${response.status}<br>
                    ACL Documents: ${aclData._embedded ? aclData._embedded.length : 0} found<br>
                    Root user has full access to the system.
                </div>
            `;
    } else {
      throw new Error(`Permission test failed: ${response.status}`);
    }
  } catch (error) {
    console.error("Error testing permissions:", error);
    outputEl.innerHTML = `<div class="text-danger">❌ ${error.message}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "Test Permissions";
  }
}

async function setupEverything() {
  const btn = document.getElementById("setup-all-btn");

  try {
    btn.disabled = true;
    btn.textContent = "🚀 Setting up...";

    // Step 1: Create user
    await createRootUser();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Small delay

    // Step 2: Create permission
    await createPermission();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Small delay

    // Step 3: Test everything
    await testAuthentication();
  } catch (error) {
    console.error("Error in complete setup:", error);
  } finally {
    btn.disabled = false;
    btn.textContent = "🚀 Setup Everything";
  }
}

function clearAllData() {
  if (
    confirm(
      "Are you sure you want to clear all form data? This cannot be undone.",
    )
  ) {
    // Clear form fields
    const inputs = [
      "instance-url",
      "jwt-token",
      "root-username",
      "root-password",
      "root-email",
    ];
    inputs.forEach((inputId) => {
      const input = document.getElementById(inputId);
      if (input) input.value = "";
    });

    // Reset client type
    const clientType = document.getElementById("client-type");
    if (clientType) clientType.value = "all";

    // Clear localStorage
    const keys = [
      "restheart-root-instance-url",
      "restheart-root-jwt-token",
      "restheart-root-username",
      "restheart-root-password",
      "restheart-root-email",
      "restheart-root-client-type",
    ];
    keys.forEach((key) => localStorage.removeItem(key));

    // Clear status messages
    document.getElementById("user-status").textContent = "";
    document.getElementById("permission-status").textContent = "";
    document.getElementById("test-results").classList.add("d-none");

    // Reset commands and filters
    updateGeneratedCommands();
    filterClientSections();
  }
}

function saveConfiguration() {
  const config = {
    instanceUrl: document.getElementById("instance-url").value,
    jwtToken: document.getElementById("jwt-token").value,
    username: document.getElementById("root-username").value,
    password: document.getElementById("root-password").value,
    email: document.getElementById("root-email").value,
  };

  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "restheart-root-config.json";
  a.click();
  URL.revokeObjectURL(url);

  document.getElementById("quick-actions-status").textContent =
    "💾 Configuration saved to file";
  document.getElementById("quick-actions-status").className = "text-info small";
}

function loadConfiguration() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const config = JSON.parse(e.target.result);

          // Load values into form
          if (config.instanceUrl)
            document.getElementById("instance-url").value = config.instanceUrl;
          if (config.jwtToken)
            document.getElementById("jwt-token").value = config.jwtToken;
          if (config.username)
            document.getElementById("root-username").value = config.username;
          if (config.password)
            document.getElementById("root-password").value = config.password;
          if (config.email)
            document.getElementById("root-email").value = config.email;

          updateGeneratedCommands();
          saveValues();

          document.getElementById("quick-actions-status").textContent =
            "📁 Configuration loaded successfully";
          document.getElementById("quick-actions-status").className =
            "text-success small";
        } catch (error) {
          document.getElementById("quick-actions-status").textContent =
            "❌ Invalid configuration file";
          document.getElementById("quick-actions-status").className =
            "text-danger small";
        }
      };
      reader.readAsText(file);
    }
  };
  input.click();
}

function handleCopyClick(event) {
  const btn = event.target;
  const targetId = btn.getAttribute("data-target");
  const targetEl = document.getElementById(targetId);

  if (targetEl) {
    const text = targetEl.textContent;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        const originalText = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("btn-success");
        btn.classList.remove("btn-outline-secondary");

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove("btn-success");
          btn.classList.add("btn-outline-secondary");
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  }
}

function saveValues() {
  const instanceUrl = document.getElementById("instance-url")?.value;
  const jwtToken = document.getElementById("jwt-token")?.value;
  const username = document.getElementById("root-username")?.value;
  const password = document.getElementById("root-password")?.value;
  const email = document.getElementById("root-email")?.value;

  localStorage.setItem("restheart-root-instance-url", instanceUrl || "");
  localStorage.setItem("restheart-root-jwt-token", jwtToken || "");
  localStorage.setItem("restheart-root-username", username || "");
  localStorage.setItem("restheart-root-password", password || "");
  localStorage.setItem("restheart-root-email", email || "");
}

function loadSavedValues() {
  const instanceUrl = localStorage.getItem("restheart-root-instance-url");
  const jwtToken = localStorage.getItem("restheart-root-jwt-token");
  const username = localStorage.getItem("restheart-root-username");
  const password = localStorage.getItem("restheart-root-password");
  const email = localStorage.getItem("restheart-root-email");

  if (instanceUrl) document.getElementById("instance-url").value = instanceUrl;
  if (jwtToken) document.getElementById("jwt-token").value = jwtToken;
  if (username) document.getElementById("root-username").value = username;
  if (password) document.getElementById("root-password").value = password;
  if (email) document.getElementById("root-email").value = email;

  // Update commands with loaded values
  if (instanceUrl || jwtToken || username || password) {
    updateGeneratedCommands();
  }
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
