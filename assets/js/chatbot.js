// document.addEventListener('DOMContentLoaded', function() {
//   // DOM Elements
//   const chatbotToggle = document.querySelector('.chatbot-toggle');
//   const chatbotWindow = document.querySelector('.chatbot-window');
//   const chatbotClose = document.querySelector('.chatbot-close');
//   const chatbotMessages = document.querySelector('.chatbot-messages');
//   const chatbotInput = document.querySelector('.chatbot-input input');
//   const chatbotSend = document.querySelector('.chatbot-send');
  
//   // Configuration - Updated with your Hugging Face endpoint
//   const API_BASE_URL = "https://rasheedj-mtech-chatbot.hf.space";
//   const LOCAL_KNOWLEDGE = {
//       // Empty now since we're getting everything from the backend
//       projects: [],
//       technologies: []
//   };

//   // Toggle chatbot window
//   chatbotToggle.addEventListener('click', function() {
//       chatbotWindow.classList.toggle('active');
//       if (chatbotWindow.classList.contains('active') && chatbotMessages.children.length === 0) {
//           addBotMessage("Hello! I'm the MTech.ai assistant. Ask me about our projects or expertise!");
//       }
//   });

//   // Close chatbot
//   chatbotClose.addEventListener('click', function() {
//       chatbotWindow.classList.remove('active');
//   });

//   // Send message (async)
//   async function sendMessage() {
//       const message = chatbotInput.value.trim();
//       if (message) {
//           addUserMessage(message);
//           chatbotInput.value = '';
//           await processUserMessage(message);
//       }
//   }

//   // Process message with typing indicators
//   async function processUserMessage(message) {
//       showTypingIndicator();
      
//       try {
//           const response = await generateBotResponse(message);
//           addBotMessage(response);
//       } catch (error) {
//           console.error("Chat error:", error);
//           addBotMessage(getFallbackResponse(message));
//       } finally {
//           removeTypingIndicator();
//       }
//   }

//   // Typing indicators
//   function showTypingIndicator() {
//       const indicator = document.createElement('div');
//       indicator.className = 'message bot-message typing-indicator';
//       indicator.id = 'typing-indicator';
//       indicator.innerHTML = '<span></span><span></span><span></span>';
//       chatbotMessages.appendChild(indicator);
//       chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
//   }

//   function removeTypingIndicator() {
//       const indicator = document.getElementById('typing-indicator');
//       if (indicator) indicator.remove();
//   }

//   // Message display functions
//   function addUserMessage(text) {
//       const messageDiv = document.createElement('div');
//       messageDiv.className = 'message user-message';
//       messageDiv.textContent = text;
//       chatbotMessages.appendChild(messageDiv);
//       chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
//   }

//   function addBotMessage(text) {
//       // Remove typing indicator if present
//       removeTypingIndicator();
      
//       const messageDiv = document.createElement('div');
//       messageDiv.className = 'message bot-message';
      
//       // Format response with line breaks and basic markup
//       const formattedText = text.replace(/\n/g, '<br>')
//                                .replace(/\*(.*?)\*/g, '<strong>$1</strong>');
//       messageDiv.innerHTML = formattedText;
      
//       chatbotMessages.appendChild(messageDiv);
//       chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
//   }

//   // Main response generator - Updated for unified endpoint
//   async function generateBotResponse(userMessage) {
//       const lowerMessage = userMessage.toLowerCase();
      
//       // 1. Handle simple local responses
//       const localResponse = getLocalResponse(lowerMessage);
//       if (localResponse) return localResponse;
      
//       // 2. Query unified Hugging Face endpoint
//       try {
//           const response = await fetch(`${API_BASE_URL}/query`, {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ query: userMessage })
//           });
          
//           if (!response.ok) throw new Error(`API error: ${response.status}`);
          
//           const data = await response.json();
//           return data.response || "I couldn't find information about that.";
//       } catch (error) {
//           console.error("API Error:", error);
//           return getFallbackResponse(userMessage);
//       }
//   }

//   // Simple local responses
//   function getLocalResponse(message) {
//       const responses = {
//           'hello': "Hello! How can I assist you with MTech.ai today?",
//           'hi': "Hi there! What would you like to know about our AI solutions?",
//           'contact': "You can reach us at: rashidj.mwinyi@gmail.com",
//           'thank': "You're welcome! Let me know if you have other questions.",
//           'service': "We specialize in: Predictive Analytics, Computer Vision, and NLP solutions."
//       };

//       for (const [keyword, response] of Object.entries(responses)) {
//           if (message.includes(keyword)) return response;
//       }
//       return null;
//   }

//   // Fallback responses when API fails
//   function getFallbackResponse(message) {
//       return "I'm having trouble connecting to our knowledge base. Please try again later or contact us directly.";
//   }

//   // Event listeners
//   chatbotSend.addEventListener('click', sendMessage);
//   chatbotInput.addEventListener('keypress', function(e) {
//       if (e.key === 'Enter') sendMessage();
//   });
// });




document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const chatbotSend = document.querySelector('.chatbot-send');

    // Configuration - Updated with your Hugging Face endpoint
    const API_BASE_URL = "https://rasheedj-mtech-chatbot.hf.space";
    const LOCAL_KNOWLEDGE = {
        projects: [],
        technologies: []
    };

    // Toggle chatbot window
    chatbotToggle.addEventListener('click', function() {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active') && chatbotMessages.children.length === 0) {
            addBotMessage("Hello! I'm the MTech.ai assistant. Ask me about our projects or expertise!");
        }
    });

    // Close chatbot
    chatbotClose.addEventListener('click', function() {
        chatbotWindow.classList.remove('active');
    });

    // Send message (async)
    async function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addUserMessage(message);
            chatbotInput.value = '';
            await processUserMessage(message);
        }
    }

    // Process message with typing indicators
    async function processUserMessage(message) {
        showTypingIndicator();

        try {
            const response = await generateBotResponse(message);
            addBotMessage(response);
        } catch (error) {
            console.error("Chat error:", error);
            addBotMessage(getFallbackResponse(message));
        } finally {
            removeTypingIndicator();
        }
    }

    // Typing indicators
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message bot-message typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = '<span></span><span></span><span></span>';
        chatbotMessages.appendChild(indicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }

    // Message display functions
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function addBotMessage(text) {
        // Remove typing indicator if present
        removeTypingIndicator();

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';

        // Format response with line breaks and basic markup
        const formattedText = text.replace(/\n/g, '<br>')
            .replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        messageDiv.innerHTML = formattedText;

        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Main response generator - Updated for unified endpoint
    async function generateBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // 1. Handle simple local responses
        const localResponse = getLocalResponse(lowerMessage);
        if (localResponse) return localResponse;

        // 2. Query unified Hugging Face endpoint
        try {
            const response = await fetch(`${API_BASE_URL}/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMessage })
            });

            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const data = await response.json();
            return data.response || "I couldn't find information about that.";
        } catch (error) {
            console.error("API Error:", error);
            return getFallbackResponse(userMessage);
        }
    }

    // Simple local responses
    function getLocalResponse(message) {
        const responses = {
            'hello': "Hello! How can I assist you with MTech.ai today?",
            'hi': "Hi there! What would you like to know about our AI solutions?",
            'contact': "You can reach us at: rashidj.mwinyi@gmail.com",
            'thank': "You're welcome! Let me know if you have other questions.",
            'service': "We specialize in: Predictive Analytics, Computer Vision, and NLP solutions."
        };

        for (const [keyword, response] of Object.entries(responses)) {
            if (message.includes(keyword)) return response;
        }
        return null;
    }

    // Fallback responses when API fails
    function getFallbackResponse(message) {
        return "I'm having trouble connecting to our knowledge base. Please try again later or contact us directly.";
    }

    // Event listeners
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
});
