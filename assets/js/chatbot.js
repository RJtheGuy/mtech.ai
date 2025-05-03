document.addEventListener('DOMContentLoaded', function() {
    const RENDER_API_URL = "https://mtechchatbot.onrender.com"; // Your Render endpoint
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const chatbotSend = document.querySelector('.chatbot-send');
    
    // Toggle chatbot window (unchanged)
    chatbotToggle.addEventListener('click', function() {
      chatbotWindow.classList.toggle('active');
      if (chatbotWindow.classList.contains('active') && chatbotMessages.children.length === 0) {
        addBotMessage("Hello! I'm the MTech.ai assistant. Ask me about our projects or expertise!");
      }
    });

    // Close chatbot (unchanged)
    chatbotClose.addEventListener('click', function() {
      chatbotWindow.classList.remove('active');
    });

    // Send message (modified)
    async function sendMessage() {
      const message = chatbotInput.value.trim();
      if (message) {
        addUserMessage(message);
        chatbotInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `<span></span><span></span><span></span>`;
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        try {
          const response = await queryBackend(message);
          chatbotMessages.removeChild(typingIndicator);
          addBotMessage(response);
        } catch (error) {
          chatbotMessages.removeChild(typingIndicator);
          addBotMessage("I'm having trouble connecting to my knowledge base. Please try again later.");
          console.error("API Error:", error);
        }
      }
    }

    // New function to query Render backend
    async function queryBackend(message) {
      const shouldQueryAPI = isModelQuery(message.toLowerCase());
      
      if (!shouldQueryAPI) {
        return generateSimpleResponse(message);
      }
      
      const response = await fetch(`${RENDER_API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message })
      });
      
      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      return data.response;
    }

    // Determine if query should go to the model
    function isModelQuery(message) {
      const modelKeywords = [
        'technology', 'technologies', 'tech',
        'nlp', 'natural language',
        'computer vision', 'cv',
        'predictive analytics',
        'how does', 'explain',
        'what is', 'which project'
      ];
      return modelKeywords.some(keyword => message.includes(keyword));
    }

    // Simple responses (unchanged)
    function generateSimpleResponse(userMessage) {
      const lowerMessage = userMessage.toLowerCase();
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello there! How can I assist you with AI solutions today?";
      } else if (lowerMessage.includes('contact')) {
        return "You can contact us via email at rashidj.mwinyi@gmail.com";
      } // ... other simple responses ...
    }

    // Event listeners (unchanged)
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendMessage();
    });

    // Message display functions (unchanged)
    function addUserMessage(text) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message user-message';
      messageDiv.textContent = text;
      chatbotMessages.appendChild(messageDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function addBotMessage(text) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message bot-message';
      messageDiv.textContent = text;
      chatbotMessages.appendChild(messageDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});
