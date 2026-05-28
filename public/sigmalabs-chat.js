(function() {
  // 1. Extract token and domain from the script tag
  const scriptTag = document.currentScript || document.querySelector('script[src*="sigmalabs-chat.js"]');
  const userToken = scriptTag ? scriptTag.getAttribute('data-token') : '';
  const shopDomain = window.location.hostname;
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhYm9yc3JueWRua3pjdXh4eG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMDg4OTUsImV4cCI6MjA3MDY4NDg5NX0.IEig8uMu62fzYZm4KFUVCCUAZelQUiHuil_C-zTQXPs";

  if (!userToken) {
    console.error("SigmaLabs Chat Widget Error: Missing 'data-token' attribute.");
    return;
  }

  // Extract store name
  const storeNameFormatted = shopDomain.replace("www.", "").split(".")[0];
  const capitalizedStoreName = storeNameFormatted.charAt(0).toUpperCase() + storeNameFormatted.slice(1);

  // 2. Parse customization attributes with standard elegant fallbacks
  const widgetName = scriptTag ? scriptTag.getAttribute("data-name") || "Βοηθός AI" : "Βοηθός AI";
  const widgetWelcome = scriptTag ? scriptTag.getAttribute("data-welcome") || "Γεια σας! Πώς μπορώ να βοηθήσω;" : "Γεια σας! Πώς μπορώ να βοηθήσω;";

  // Conversation history memory
  let chatHistory = [];

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

  // 5. Define Premium Glassmorphic White/Grey Dynamic CSS styles matching Image 2 perfectly
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
      background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%);
      box-shadow: 0 8px 30px rgba(217, 70, 239, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .chat-bubble-btn:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 12px 35px rgba(217, 70, 239, 0.6);
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
      height: 550px;
      max-height: calc(100vh - 130px);
      max-width: calc(100vw - 48px);
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
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
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(12px);
      padding: 14px 20px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .header-left-btn {
      width: 32px;
      height: 32px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      cursor: pointer;
      color: #64748b;
      transition: all 0.2s;
    }

    .header-left-btn:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    .header-center-title {
      font-weight: 700;
      font-size: 14px;
      background: linear-gradient(to right, #ec4899, #d946ef);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      gap: 4px;
      margin: 0;
    }

    .header-right-close {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
      transition: all 0.2s;
      border: none;
      font-size: 18px;
      font-weight: bold;
    }

    .header-right-close:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    /* Message History Area */
    .messages-area {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background-color: #f8fafc;
    }

    /* Custom Scrollbar */
    .messages-area::-webkit-scrollbar {
      width: 4px;
    }
    .messages-area::-webkit-scrollbar-track {
      background: transparent;
    }
    .messages-area::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 99px;
    }

    /* Chat Messages */
    .message {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 16px;
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
      color: #ffffff;
      border-bottom-right-radius: 4px;
    }

    .message.ai {
      align-self: flex-start;
      background-color: #ffffff;
      color: #1e293b;
      border-bottom-left-radius: 4px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }

    /* Products Carousel */
    .products-carousel {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding: 4px 0 12px 0;
      margin: 4px 0;
      width: 100%;
      scroll-snap-type: x mandatory;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 transparent;
    }

    .products-carousel::-webkit-scrollbar {
      height: 4px;
    }
    .products-carousel::-webkit-scrollbar-track {
      background: transparent;
    }
    .products-carousel::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 99px;
    }

    .product-card {
      flex: 0 0 240px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      scroll-snap-align: start;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
      transition: transform 0.2s;
    }

    .product-card:hover {
      transform: translateY(-2px);
    }

    .product-img-container {
      position: relative;
      width: 100%;
      height: 140px;
      background-color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #e2e8f0;
      overflow: hidden;
    }

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 8px;
    }

    .product-img-placeholder {
      font-size: 32px;
    }

    .buy-badge-btn {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background-color: #fbbf24;
      color: #000000;
      font-weight: 700;
      font-size: 11px;
      padding: 6px 14px;
      border-radius: 20px;
      text-decoration: none;
      box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
      transition: all 0.2s;
      border: 1px solid rgba(0,0,0,0.05);
    }

    .buy-badge-btn:hover {
      background-color: #f59e0b;
      transform: scale(1.05);
    }

    .product-details {
      padding: 12px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .product-title {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 6px 0;
      line-height: 18px;
      height: 36px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .product-rating-price {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .product-stars {
      display: flex;
      align-items: center;
      font-size: 10px;
    }

    .reviews-count {
      color: #64748b;
      font-size: 10px;
      margin-left: 2px;
    }

    .product-price {
      font-size: 12px;
      font-weight: 800;
      color: #0f172a;
    }

    .product-desc {
      font-size: 11px;
      color: #64748b;
      margin: 0;
      line-height: 16px;
      height: 48px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    /* Loading Bubble */
    .loading-bubble {
      align-self: flex-start;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
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
      padding: 14px 20px;
      border-top: 1px solid #e2e8f0;
      background-color: #ffffff;
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .chat-input {
      flex: 1;
      height: 42px;
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 22px;
      padding: 0 16px;
      color: #0f172a;
      font-size: 13.5px;
      outline: none;
      transition: all 0.2s ease;
    }

    .chat-input::placeholder {
      color: #94a3b8;
    }

    .chat-input:focus {
      border-color: #d946ef;
      box-shadow: 0 0 0 2px rgba(217, 70, 239, 0.1);
    }

    .send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #94a3b8;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .send-btn:hover {
      background-color: #64748b;
      transform: scale(1.05);
    }

    .send-btn svg {
      width: 18px;
      height: 18px;
      fill: #ffffff;
    }

    .branding-footer {
      font-size: 9px;
      color: #94a3b8;
      text-align: center;
      padding: 4px 0 10px 0;
      background-color: #ffffff;
      border-top: none;
    }

    .branding-footer a {
      color: #64748b;
      text-decoration: none;
      font-weight: 550;
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
      <div class="header-left-btn">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </div>
      <h4 class="header-center-title">
        <span style="font-size: 15px;">✨</span> ${widgetName}
      </h4>
      <button class="header-right-close" id="chat-header-close-btn">×</button>
    </div>
    <div class="messages-area" id="messages-container">
      <div class="message ai">
        ${widgetWelcome}
      </div>
    </div>
    <div class="chat-footer">
      <input type="text" class="chat-input" id="chat-input-field" placeholder="Γράψτε το μήνυμά σας..." />
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
  const closeBtn = chatWindow.querySelector("#chat-header-close-btn");
  const resetBtn = chatWindow.querySelector(".header-left-btn");

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

  // Header Close Button
  closeBtn.addEventListener("click", () => {
    chatOpen = false;
    chatWindow.classList.remove("active");
    chatBtn.classList.remove("open");
    bubbleIcon.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    `;
  });

  // Clear / Reset chat
  resetBtn.addEventListener("click", () => {
    if (confirm("Θέλετε να επαναφέρετε τη συνομιλία;")) {
      chatHistory = [];
      msgContainer.innerHTML = `
        <div class="message ai">
          ${widgetWelcome}
        </div>
      `;
    }
  });

  const appendMessage = (text, sender, products = []) => {
    // Render text bubble
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    msg.innerHTML = text;
    msgContainer.appendChild(msg);

    // Render horizontal products carousel if recommendations exist
    if (products && products.length > 0) {
      const carousel = document.createElement("div");
      carousel.className = "products-carousel";
      
      products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        // Format price
        const formattedPrice = p.price ? `${parseFloat(p.price).toFixed(2)} €` : "N/A";
        
        // Clean short description
        let shortDesc = p.description || "";
        shortDesc = shortDesc.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        if (shortDesc.length > 120) {
          shortDesc = shortDesc.substring(0, 110) + "...";
        }
        if (!shortDesc) shortDesc = "Εξαιρετική επιλογή προϊόντος για εσάς.";

        // Build image container using DOM APIs (no inline onclick - breaks in Shadow DOM)
        const imgContainer = document.createElement("div");
        imgContainer.className = "product-img-container";
        imgContainer.style.cursor = "pointer";

        if (p.image_url) {
          const img = document.createElement("img");
          img.src = p.image_url;
          img.alt = p.name || "";
          img.className = "product-img";
          img.setAttribute("referrerpolicy", "no-referrer");
          img.onerror = function() {
            this.style.display = "none";
            const placeholder = document.createElement("div");
            placeholder.className = "product-img-placeholder";
            placeholder.textContent = "📦";
            imgContainer.insertBefore(placeholder, imgContainer.firstChild);
          };
          imgContainer.appendChild(img);
        } else {
          const placeholder = document.createElement("div");
          placeholder.className = "product-img-placeholder";
          placeholder.textContent = "📦";
          imgContainer.appendChild(placeholder);
        }

        const buyBadge = document.createElement("span");
        buyBadge.className = "buy-badge-btn";
        buyBadge.textContent = "Δες το";
        imgContainer.appendChild(buyBadge);

        // Click on image → open product page
        imgContainer.addEventListener("click", () => {
          if (p.permalink) window.open(p.permalink, "_blank");
        });

        // Build product details
        const details = document.createElement("div");
        details.className = "product-details";

        const title = document.createElement("h5");
        title.className = "product-title";
        title.title = p.name || "";
        title.style.cursor = "pointer";
        title.textContent = p.name || "";
        title.addEventListener("click", () => {
          if (p.permalink) window.open(p.permalink, "_blank");
        });

        const priceLine = document.createElement("div");
        priceLine.className = "product-rating-price";
        const priceEl = document.createElement("div");
        priceEl.className = "product-price";
        priceEl.textContent = `από ${formattedPrice}`;
        priceLine.appendChild(priceEl);

        const descEl = document.createElement("p");
        descEl.className = "product-desc";
        descEl.textContent = shortDesc;

        details.appendChild(title);
        details.appendChild(priceLine);
        details.appendChild(descEl);

        card.appendChild(imgContainer);
        card.appendChild(details);
        carousel.appendChild(card);
      });
      msgContainer.appendChild(carousel);
    }
    
    msgContainer.scrollTop = msgContainer.scrollHeight;
  };

  const handleSendMessage = async () => {
    const rawVal = inputField.value;
    if (!rawVal.trim()) return;

    appendMessage(rawVal, "visitor");
    inputField.value = "";

    // Save visitor message to memory history
    chatHistory.push({ role: "user", content: rawVal });

    // Append loading bubble
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
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabaseAnonKey}`,
          "apikey": supabaseAnonKey
        },
        body: JSON.stringify({
          messages: chatHistory,
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
      appendMessage(resJson.response, "ai", resJson.products);

      // Save AI message to memory history
      chatHistory.push({ role: "assistant", content: resJson.response });

    } catch (err) {
      console.error("SigmaLabs Chat Widget Error Sending Message:", err);
      const loaderIndicator = msgContainer.querySelector("#chat-widget-loading-indicator");
      if (loaderIndicator) loaderIndicator.remove();
      
      appendMessage(`Συγγνώμη, παρουσιάστηκε ένα σφάλμα. Παρακαλώ δοκιμάστε ξανά αργότερα. (${err.message})`, "ai");
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
