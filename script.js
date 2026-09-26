// Google Gemini API Key= YOUR_REAL_API_KEY_HERE

//URL= https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAPKoO_uftHbgiqe_sk5GTQnYCuaaQczK8"

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chatForm");
  const userInput = document.getElementById("userInput");
  const chatMessages = document.getElementById("chatMessages");
  const sendButton = document.getElementById("sendButton");


  // 🔑 ADD YOUR API KEY HERE ONLY

  const API_KEY = "YOUR_REAL_API_KEY_HERE"; // Replace with your actual API key


  // GEMINI INTERACTIONS API
 
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/interactions";


  // AUTO RESIZE

  userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = userInput.scrollHeight + "px";
  });


  // FORM SUBMIT
 
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = userInput.value.trim();

    if (!message) {
      return;
    }

    addMessage(message, true);

    userInput.value = "";
    userInput.style.height = "auto";

    sendButton.disabled = true;

    const typingIndicator = showTypingIndicator();

    try {
      const response = await generateResponse(message);

      typingIndicator.remove();

      addMessage(response, false);
    } catch (error) {
      console.error("Gemini Error:", error);

      typingIndicator.remove();

      addErrorMessage(error.message);
    } finally {
      sendButton.disabled = false;
    }
  });


    // GENERATE GEMINI RESPONSE
    
  async function generateResponse(prompt) {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "x-goog-api-key": API_KEY,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: "gemini-3.8-flash",

        input: prompt,
      }),
    });

    const data = await response.json();

    console.log("Gemini API Response:", data);

    if (!response.ok) {
      throw new Error(
        data?.error?.message ||
          `API request failed with status ${response.status}`,
      );
    }


    // GET AI RESPONSE


    if (!data.steps || !Array.isArray(data.steps)) {
      throw new Error("Invalid response received from Gemini.");
    }

    const modelOutput = data.steps.find((step) => step.type === "model_output");

    if (!modelOutput) {
      throw new Error("Gemini did not return a model response.");
    }

    const textPart = modelOutput.content?.find(
      (content) => content.type === "text",
    );

    if (!textPart || !textPart.text) {
      throw new Error("Gemini returned an empty response.");
    }

    return textPart.text;
  }


  // ADD MESSAGE

  function addMessage(text, isUser) {
    const message = document.createElement("div");

    message.className = `message ${isUser ? "user-message" : ""}`;

    message.innerHTML = `
            <div class="avatar ${isUser ? "user-avatar" : ""}">
                ${isUser ? "U" : "AI"}
            </div>

            <div class="message-content"></div>
        `;

    const content = message.querySelector(".message-content");

    content.textContent = text;

    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }


  // TYPING INDICATOR
 
  function showTypingIndicator() {
    const indicator = document.createElement("div");

    indicator.className = "message";

    indicator.innerHTML = `
            <div class="avatar">
                AI
            </div>

            <div class="typing-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        `;

    chatMessages.appendChild(indicator);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    return indicator;
  }


  // ERROR MESSAGE
  
  function addErrorMessage(text) {
    const message = document.createElement("div");

    message.className = "message";

    message.innerHTML = `
            <div class="avatar">
                AI
            </div>

            <div
                class="message-content"
                style="color: red;"
            ></div>
        `;

    message.querySelector(".message-content").textContent = "Error: " + text;

    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});