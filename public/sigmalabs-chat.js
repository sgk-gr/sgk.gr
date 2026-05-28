(function() {
  // 1. Extract token and domain from the script tag
  const scriptTag = document.currentScript || document.querySelector('script[src*="sigmalabs-chat.js"]');
  const userToken = scriptTag ? scriptTag.getAttribute('data-token') : '';
  const shopDomain = window.location.hostname;

  if (!userToken) {
    console.error("SigmaLabs Chat Widget Error: Missing 'data-token' attribute.");
    return;
  }

  // Extract store name
  const storeNameFormatted = shopDomain.replace("www.", "").split(".")[0];
  const capitalizedStoreName = storeNameFormatted.charAt(0).toUpperCase() + storeNameFormatted.slice(1);
  const firstLetter = capitalizedStoreName.charAt(0);

  // 2. Parse customization attributes with standard elegant fallbacks
  const widgetColor = scriptTag ? scriptTag.getAttribute("data-color") || "#10b981" : "#10b981";
  const widgetName = scriptTag ? scriptTag.getAttribute("data-name") || (capitalizedStoreName + " AI Assistant") : (capitalizedStoreName + " AI Assistant");
  const widgetWelcome = scriptTag ? scriptTag.getAttribute("data-welcome") || "Hello! I'm your AI shopping assistant. How can I help you find products or answer your questions today?" : "Hello! I'm your AI shopping assistant. How can I help you find products or answer your questions today?";

  // 3. Create target container element
  const container = document.createElement("div");
  container.id = "sigmalabs-chat-widget-root";
  container.style.position = "fixed";
  container.style.bottom = "0";
  container.style.right = "0";
  container.style.zIndex = "999999";
  document.body.appendChild(container);

  // 4. Attach Shadow DOM to prevent theme style pollution
  const shadow = container.attachShadow({ mode: "open" });

  // 5. Define Dynamic CSS styles (using parsed widgetColor for pure theme-aligned glowing interface)
  const styles = `
    * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    /* Floating Chat Button */
    .chat-bubble-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${widgetColor} 0%, ${widgetColor}bb 100%);
      box-shadow: 0 8px 30px ${widgetColor}55;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .chat-bubble-btn:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 12px 35px ${widgetColor}88;
    }

    .chat-bubble-btn svg {
      width: 28px;
      height: 28px;
      fill: #ffffff;
      transition: transform 0.3s ease;
    }

    .chat-bubble-btn.open svg {
      transform: rotate(90deg);
    }

    /* Main Chat Window */
    .chat-window {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 370px;
      height: 520px;
      max-height: calc(100vh - 130px);
      max-width: calc(100vw - 48px);
      background-color: #0b0f19;
      border: 1px solid #1e293b;
      border-radius: 16px;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .chat-window.active {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    /* Header Section */
    .chat-header {
      background: linear-gradient(135deg, #111827 0%, ${widgetColor}22 100%);
      padding: 18px 20px;
      border-bottom: 1px solid #1e293b;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .store-avatar {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, ${widgetColor} 0%, ${widgetColor}bb 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #ffffff;
      font-size: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .store-info {
      flex: 1;
    }

    .store-name {
      color: #ffffff;
      font-weight: 600;
      font-size: 15px;
      margin: 0;
    }

    .store-status {
      display: flex;
      align-items: center;
      gap: 5px;
      color: ${widgetColor};
      font-size: 11px;
      margin: 3px 0 0 0;
      font-weight: 500;
    }

    .store-status::before {
      content: "";
      width: 6px;
      height: 6px;
      background-color: ${widgetColor};
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 8px ${widgetColor};
    }

    /* Message History Area */
    .messages-area {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background-color: #0b0f19;
    }

    /* Custom Scrollbar */
    .messages-area::-webkit-scrollbar {
      width: 4px;
    }
    .messages-area::-webkit-scrollbar-track {
      background: transparent;
    }
    .messages-area::-webkit-scrollbar-thumb {
      background: #1e293b;
      border-radius: 99px;
    }

    /* Chat Messages */
    .message {
      max-width: 80%;
      padding: 12px 16px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 20px;
      word-break: break-word;
      animation: msgReveal 0.25s ease-out forwards;
      opacity: 0;
      transform: translateY(8px);
    }

    @keyframes msgReveal {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message.visitor {
      align-self: flex-end;
      background-color: #1e293b;
      color: #f1f5f9;
      border-bottom-right-radius: 4px;
      border: 1px solid #334155;
    }

    .message.ai {
      align-self: flex-start;
      background-color: #0f172a;
      color: #cbd5e1;
      border-bottom-left-radius: 4px;
      border: 1px solid #1e293b;
    }

    .message.ai a {
      color: ${widgetColor};
      font-weight: 600;
      text-decoration: underline;
    }

    .message.ai a:hover {
      filter: brightness(1.2);
    }

    /* Loading Bubble */
    .loading-bubble {
      align-self: flex-start;
      background-color: #0f172a;
      border: 1px solid #1e293b;
      padding: 14px 18px;
      border-radius: 14px;
      border-bottom-left-radius: 4px;
      display: flex;
      gap: 5px;
      align-items: center;
    }

    .loading-dot {
      width: 6px;
      height: 6px;
      background-color: #94a3b8;
      border-radius: 50%;
      animation: dotPulse 1.2s infinite ease-in-out;
    }

    .loading-dot:nth-child(2) { animation-delay: 0.2s; }
    .loading-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes dotPulse {
      0%, 100% { transform: scale(0.6); opacity: 0.4; }
      50% { transform: scale(1.2); opacity: 1; }
    }

    /* Input Footer Area */
    .chat-footer {
      padding: 16px 20px;
      border-top: 1px solid #1e293b;
      background-color: #0b0f19;
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .chat-input {
      flex: 1;
      height: 40px;
      background-color: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 20px;
      padding: 0 16px;
      color: #ffffff;
      font-size: 13.5px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .chat-input::placeholder {
      color: #64748b;
    }

    .chat-input:focus {
      border-color: ${widgetColor};
    }

    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${widgetColor} 0%, ${widgetColor}bb 100%);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px ${widgetColor}4d;
      transition: all 0.2s ease;
    }

    .send-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px ${widgetColor}66;
    }

    .send-btn svg {
      width: 18px;
      height: 18px;
      fill: #ffffff;
    }

    .branding-footer {
      font-size: 10px;
      color: #475569;
      text-align: center;
      padding: 6px 0 12px 0;
      background-color: #0b0f19;
    }

    .branding-footer a {
      color: #64748b;
      text-decoration: none;
      font-weight: 500;
    }
  `;

  // 6. Create DOM structures inside Shadow DOM
  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  shadow.appendChild(styleEl);

  // Chat Window Element
  const chatWindow = document.createElement("div");
  chatWindow.className = "chat-window";

  chatWindow.innerHTML = `
    <div class="chat-header">
      <div class="store-avatar">${firstLetter}</div>
      <div class="store-info">
        <h4 class="store-name">${widgetName}</h4>
        <p class="store-status">Active Shopper</p>
      </div>
    </div>
    <div class="messages-area" id="messages-container">
      <div class="message ai">
        ${widgetWelcome}
      </div>
    </div>
    <div class="chat-footer">
      <input type="text" class="chat-input" id="chat-input-field" placeholder="Ask about our products..." />
      <button class="send-btn" id="send-message-btn">
        <svg viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
    <div class="branding-footer">
      Powered by <a href="https://sgk.gr" target="_blank">SigmaLabs</a>
    </div>
  `;
  shadow.appendChild(chatWindow);

  // Chat Toggle Button Element
  const chatBtn = document.createElement("div");
  chatBtn.className = "chat-bubble-btn";
  chatBtn.innerHTML = `
    <svg viewBox="0 0 24 24" id="chat-bubble-icon">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
    </svg>
  `;
  shadow.appendChild(chatBtn);

  // Interactive Logic & Event Listeners
  const msgContainer = chatWindow.querySelector("#messages-container");
  const inputField = chatWindow.querySelector("#chat-input-field");
  const sendBtn = chatWindow.querySelector("#send-message-btn");
  const bubbleIcon = chatBtn.querySelector("#chat-bubble-icon");

  let chatOpen = false;

  // Toggle Chat View
  chatBtn.addEventListener("click", () => {
    chatOpen = !chatOpen;
    if (chatOpen) {
      chatWindow.classList.add("active");
      chatBtn.classList.add("open");
      bubbleIcon.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      `;
      // Focus input field when opened
      setTimeout(() => inputField.focus(), 150);
    } else {
      chatWindow.classList.remove("active");
      chatBtn.classList.remove("open");
      bubbleIcon.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
        </svg>
      `;
    }
  });

  const appendMessage = (text, sender) => {
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    
    // Support markdown style links: [Text](URL)
    const formattedText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    msg.innerHTML = formattedText;
    
    msgContainer.appendChild(msg);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  };

  const handleSendMessage = async () => {
    const rawVal = inputField.value;
    if (!rawVal.trim()) return;

    appendMessage(rawVal, "visitor");
    inputField.value = "";

    // Append thinking loading bubble
    const loader = document.createElement("div");
    loader.className = "loading-bubble";
    loader.id = "chat-widget-loading-indicator";
    loader.innerHTML = `
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
      <div class="loading-dot"></div>
    `;
    msgContainer.appendChild(loader);
    msgContainer.scrollTop = msgContainer.scrollHeight;

    try {
      const apiRes = await fetch("https://aaborsrnydnkzcuxxxol.supabase.co/functions/v1/chat-widget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: rawVal,
          shop: shopDomain,
          token: userToken
        })
      });

      // Remove loading indicator
      const loaderIndicator = msgContainer.querySelector("#chat-widget-loading-indicator");
      if (loaderIndicator) loaderIndicator.remove();

      if (!apiRes.ok) {
        const errorJson = await apiRes.json();
        throw new Error(errorJson.error || `HTTP ${apiRes.status}`);
      }

      const resJson = await apiRes.json();
      appendMessage(resJson.response, "ai");

    } catch (err) {
      console.error("SigmaLabs Chat Widget Error Sending Message:", err);
      // Remove loading indicator if not already done
      const loaderIndicator = msgContainer.querySelector("#chat-widget-loading-indicator");
      if (loaderIndicator) loaderIndicator.remove();
      
      appendMessage(`Sorry, I am currently offline. Please try again later. (${err.message})`, "ai");
    }
  };

  // Click Send
  sendBtn.addEventListener("click", handleSendMessage);

  // Press Enter key
  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  });

})();
