const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const suggestions = document.querySelectorAll(".suggestion");
const toggleThemeButton = document.querySelector("#theme-toggle-button");
const deleteChatButton = document.querySelector("#delete-chat-button");
const sidebar = document.querySelector(".sidebar");
const openSidebarBtn = document.querySelector("#open-sidebar");
const closeSidebarBtn = document.querySelector("#close-sidebar");
const newChatBtn = document.querySelector("#new-chat");
const modelSelector = document.querySelector("#model-selector");
const chatHistory = document.querySelector("#chat-history");

let userMessage = null;
let isResponseGenerating = false;
let currentChatId = null;

const API_KEY = "AIzaSyAhxuXwGct2fdWhNTTokRQ1jqDF5YH7GdA";
const API_URLS = {
  "gemini-pro": `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-002:generateContent?key=${API_KEY}`,
  "gemini-flash": `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-002:generateContent?key=${API_KEY}`
};

const loadDataFromLocalstorage = () => {
  const savedChats = JSON.parse(localStorage.getItem("saved-chats")) || {};
  const isLightMode = (localStorage.getItem("themeColor") === "light_mode");
  const selectedModel = localStorage.getItem("selectedModel") || "gemini-pro";
  const isSidebarCollapsed = localStorage.getItem("sidebarCollapsed") === "true";

  document.body.classList.toggle("light_mode", isLightMode);
  toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
  modelSelector.value = selectedModel;
  updateChatHistory(savedChats);
  
  if (Object.keys(savedChats).length > 0) {
    currentChatId = Object.keys(savedChats)[0];
    loadChat(currentChatId);
  } else {
    document.body.classList.remove("hide-header");
  }

  if (isSidebarCollapsed) {
    document.body.classList.add("sidebar-collapsed");
  }
}

const updateChatHistory = (chats) => {
  chatHistory.innerHTML = '';
  Object.entries(chats).forEach(([id, chat]) => {
    const li = document.createElement('li');
    li.textContent = chat.title || `Chat ${id}`;
    li.onclick = () => loadChat(id);
    chatHistory.appendChild(li);
  });
}

const loadChat = (chatId) => {
  const savedChats = JSON.parse(localStorage.getItem("saved-chats")) || {};
  const chat = savedChats[chatId];
  if (chat) {
    chatContainer.innerHTML = chat.messages;
    document.body.classList.add("hide-header");
    currentChatId = chatId;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
  }
}

const createNewChat = () => {
  const savedChats = JSON.parse(localStorage.getItem("saved-chats")) || {};
  currentChatId = Date.now().toString();
  savedChats[currentChatId] = { title: `New Chat`, messages: '' };
  localStorage.setItem("saved-chats", JSON.stringify(savedChats));
  updateChatHistory(savedChats);
  chatContainer.innerHTML = '';
  document.body.classList.remove("hide-header");
}

const saveCurrentChat = () => {
  if (currentChatId) {
    const savedChats = JSON.parse(localStorage.getItem("saved-chats")) || {};
    savedChats[currentChatId].messages = chatContainer.innerHTML;
    localStorage.setItem("saved-chats", JSON.stringify(savedChats));
    updateChatHistory(savedChats);
  }
}

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
}

const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(' ');
  let currentWordIndex = 0;
  let formattedText = '';

  const typingInterval = setInterval(() => {
    formattedText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
    textElement.innerHTML = marked.parse(formattedText);
    incomingMessageDiv.querySelector(".icon").classList.add("hide");

    if (currentWordIndex === words.length) {
      clearInterval(typingInterval);
      isResponseGenerating = false;
      incomingMessageDiv.querySelector(".icon").classList.remove("hide");
      saveCurrentChat();
      highlightCodeBlocks();
    }
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
  }, 75);
}

const highlightCodeBlocks = () => {
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block);
  });
}

const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text");
  const selectedModel = modelSelector.value;

  try {
    const response = await fetch(API_URLS[selectedModel], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ 
          role: "user", 
          parts: [{ text: userMessage }] 
        }] 
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    const apiResponse = data?.candidates[0].content.parts[0].text;
    showTypingEffect(apiResponse, textElement, incomingMessageDiv);
  } catch (error) {
    isResponseGenerating = false;
    textElement.innerText = error.message;
    textElement.parentElement.closest(".message").classList.add("error");
  } finally {
    incomingMessageDiv.classList.remove("loading");
  }
}

const showLoadingAnimation = () => {
  const html = `<div class="message-content">
                  <img class="avatar" src="images/gemini.jpg" alt="Gemini avatar">
                  <p class="text"></p>
                  <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                  </div>
                </div>
                <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;

  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatContainer.appendChild(incomingMessageDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  generateAPIResponse(incomingMessageDiv);
}

const copyMessage = (copyButton) => {
  const messageText = copyButton.parentElement.querySelector(".text").innerText;
  navigator.clipboard.writeText(messageText);
  copyButton.innerText = "done";
  setTimeout(() => copyButton.innerText = "content_copy", 1000);
}

const handleOutgoingChat = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
  if (!userMessage || isResponseGenerating) return;

  isResponseGenerating = true;
  const html = `<div class="message-content">
                  <img class="avatar" src="images/user.jpg" alt="User avatar">
                  <p class="text"></p>
                </div>`;

  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(outgoingMessageDiv);
  
  typingForm.reset();
  document.body.classList.add("hide-header");
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  setTimeout(showLoadingAnimation, 500);
}

toggleThemeButton.addEventListener("click", () => {
  const isLightMode = document.body.classList.toggle("light_mode");
  localStorage.setItem("themeColor", isLightMode ? "light_mode" : "dark_mode");
  toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
});

deleteChatButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all the chats?")) {
    localStorage.removeItem("saved-chats");
    loadDataFromLocalstorage();
  }
});

const toggleSidebar = () => {
  document.body.classList.toggle("sidebar-collapsed");
  const isCollapsed = document.body.classList.contains("sidebar-collapsed");
  localStorage.setItem("sidebarCollapsed", isCollapsed);
  openSidebarBtn.style.display = isCollapsed ? "block" : "none";
};

openSidebarBtn.addEventListener("click", toggleSidebar);
closeSidebarBtn.addEventListener("click", toggleSidebar);
newChatBtn.addEventListener("click", createNewChat);

modelSelector.addEventListener("change", (e) => {
  localStorage.setItem("selectedModel", e.target.value);
});

suggestions.forEach(suggestion => {
  suggestion.addEventListener("click", () => {
    userMessage = suggestion.querySelector(".text").innerText;
    handleOutgoingChat();
  });
});

typingForm.addEventListener("submit", (e) => {
  e.preventDefault(); 
  handleOutgoingChat();
});

window.addEventListener("beforeunload", saveCurrentChat);
loadDataFromLocalstorage();
initializeSidebar();
