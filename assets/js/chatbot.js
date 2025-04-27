document.addEventListener('DOMContentLoaded', function() {
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const chatbotSend = document.querySelector('.chatbot-send');
    
    // Toggle chatbot window
    chatbotToggle.addEventListener('click', function() {
      chatbotWindow.classList.toggle('active');
      if (chatbotWindow.classList.contains('active')) {
        // Add welcome message if empty
        if (chatbotMessages.children.length === 0) {
          addBotMessage("Hello! I'm the MTech.ai assistant. How can I help you today?");
        }
      }
    });
    
    // Close chatbot
    chatbotClose.addEventListener('click', function() {
      chatbotWindow.classList.remove('active');
    });
    
    // Send message
    function sendMessage() {
      const message = chatbotInput.value.trim();
      if (message) {
        addUserMessage(message);
        chatbotInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
          <span></span>
          <span></span>
          <span></span>
        `;
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Simulate bot response after delay
        setTimeout(() => {
          chatbotMessages.removeChild(typingIndicator);
          generateBotResponse(message);
        }, 1500);
      }
    }
    
    // Send message on button click
    chatbotSend.addEventListener('click', sendMessage);
    
    // Send message on Enter key
    chatbotInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Add user message to chat
    function addUserMessage(text) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message user-message';
      messageDiv.textContent = text;
      chatbotMessages.appendChild(messageDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Add bot message to chat
    function addBotMessage(text) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message bot-message';
      messageDiv.textContent = text;
      chatbotMessages.appendChild(messageDiv);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Generate bot response
    function generateBotResponse(userMessage) {
      const lowerMessage = userMessage.toLowerCase();
      let response;
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = "Hello there! How can I assist you with AI solutions today?";
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
        response = "You can contact Rashid directly via email at rashidj.mwinyi@gmail.com or through the contact section below.";
      } else if (lowerMessage.includes('portfolio') || lowerMessage.includes('projects')) {
        response = "Check out the portfolio section to see our featured AI projects like TelcoGuard and BrainScan.AI.";
      } else if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
        response = "We offer AI solutions in Predictive Analytics, Computer Vision, and NLP. See the Expertise section for details.";
      } else if (lowerMessage.includes('thank')) {
        response = "You're welcome! Is there anything else I can help you with?";
      } else {
        response = "I'm an AI assistant trained to answer questions about MTech.ai services. You can ask about our projects, expertise, or how to contact us.";
      }
      
      addBotMessage(response);
    }
  });