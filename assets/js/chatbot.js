window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Animate elements on scroll
document.addEventListener('DOMContentLoaded', function () {
    const animateElements = document.querySelectorAll('.animate__animated');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__fadeInUp');
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(el => observer.observe(el));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    document.getElementById('contactPageBtn').addEventListener('click', function () {
        const modal = bootstrap.Modal.getInstance(document.getElementById('demoRequestModal'));
        modal.hide();

        document.getElementById('demoRequestModal').addEventListener('hidden.bs.modal', function () {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }, { once: true });
    });

    document.getElementById('currentYear').textContent = new Date().getFullYear();
});


// SECURE CHATBOT INTEGRATION
document.addEventListener('DOMContentLoaded', function () {
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotWindow = document.querySelector('.chatbot-window');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInput = document.querySelector('.chatbot-input input');
    const chatbotSend = document.querySelector('.chatbot-send');

    const API_BASE_URL = "https://fatushnas.duckdns.org";
    const MAX_MESSAGE_LENGTH = 500;
    const RATE_LIMIT_WINDOW = 60000;
    const MAX_REQUESTS_PER_WINDOW = 10;
    let requestHistory = [];

    let userSession = {
        userIP: null,
        sessionId: generateSessionId(),
        startTime: Date.now(),
        messageCount: 0,
        apiHealthy: false
    };

    function generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    function sanitizeInput(input) {
        return input.replace(/[<>\"']/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '')
            .trim()
            .substring(0, MAX_MESSAGE_LENGTH);
    }

    function checkRateLimit() {
        const now = Date.now();
        requestHistory = requestHistory.filter(time => now - time < RATE_LIMIT_WINDOW);
        if (requestHistory.length >= MAX_REQUESTS_PER_WINDOW) return false;
        requestHistory.push(now);
        return true;
    }

    function generateAuthToken() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return btoa(`${timestamp}:${random}:${userSession.sessionId}`);
    }

    async function initializeUserSession() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const ipResponse = await fetch('https://api.ipify.org?format=json', {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const ipData = await ipResponse.json();
            userSession.userIP = ipData.ip;
        } catch (error) {
            userSession.userIP = 'unknown';
        }
    }

    initializeUserSession();

    chatbotToggle.addEventListener('click', function () {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active') && chatbotMessages.children.length === 0) {
            addBotMessage("Hello! I'm the MTech.ai assistant. Ask me about our projects or expertise!");
        }
    });

    chatbotClose.addEventListener('click', function () {
        chatbotWindow.classList.remove('active');
    });

    async function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        const sanitizedMessage = sanitizeInput(message);
        if (!sanitizedMessage) {
            addBotMessage("Please enter a valid message.");
            return;
        }

        if (!checkRateLimit()) {
            addBotMessage("Too many requests. Please wait a moment.");
            return;
        }

        if (sanitizedMessage.length > MAX_MESSAGE_LENGTH) {
            addBotMessage(`Message too long. Keep it under ${MAX_MESSAGE_LENGTH} characters.`);
            return;
        }

        addUserMessage(sanitizedMessage);
        chatbotInput.value = '';
        userSession.messageCount++;

        await processUserMessage(sanitizedMessage);
    }

    async function processUserMessage(message) {
        showTypingIndicator();
        try {
            const response = await generateBotResponse(message);
            addBotMessage(response);
        } catch (error) {
            console.error("Chat error:", error);
            addBotMessage(getFallbackResponse());
        } finally {
            removeTypingIndicator();
        }
    }

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

    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function addBotMessage(text) {
        removeTypingIndicator();
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        const formattedText = text.replace(/\n/g, '<br>').replace(/\*(.*?)\*/g, '<strong>$1</strong>');
        messageDiv.innerHTML = formattedText;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function generateBotResponse(userMessage) {
        const localResponse = getLocalResponse(userMessage.toLowerCase());
        if (localResponse) return localResponse;

        if (!userSession.apiHealthy) return getFallbackResponse();

        try {
            const payload = {
                query: userMessage,
                max_tokens: 150,
                temperature: 0.7,
                session_id: userSession.sessionId,
                user_ip: userSession.userIP,
                message_count: userSession.messageCount,
                timestamp: Date.now()
            };

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const response = await fetch(`${API_BASE_URL}/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': userSession.sessionId,
                    'X-Auth-Token': generateAuthToken(),
                    'User-Agent': 'MTech-Website-Chatbot/1.0'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const data = await response.json();
            if (!data || typeof data.response !== 'string') throw new Error('Invalid response');

            return data.response || "I couldn't find anything about that.";

        } catch (error) {
            console.error("API Error:", error);
            userSession.apiHealthy = false;
            return getFallbackResponse();
        }
    }

    function getLocalResponse(message) {
        const responses = {
            'hello': "Hello! How can I assist you with MTech.ai today?",
            'hi': "Hi there! What would you like to know about our AI solutions?",
            'contact': "You can reach us at: rashidj.mwinyi@gmail.com",
            'thank': "You're welcome! Let me know if you have other questions.",
            'service': "We specialize in: Predictive Analytics, Computer Vision, and NLP solutions.",
            'about': "MTech.ai is a leading AI solutions provider in predictive analytics, computer vision, and NLP.",
            'team': "Our team includes top AI engineers and data scientists passionate about innovation.",
            'projects': "We work on projects like image classification, predictive maintenance, and smart assistants."
        };

        for (const [keyword, response] of Object.entries(responses)) {
            if (message.includes(keyword)) return response;
        }
        return null;
    }

    function getFallbackResponse() {
        const fallbacks = [
            "I'm currently running in offline mode. Please email us at rashidj.mwinyi@gmail.com.",
            "Trouble connecting to our system. Try again later or reach out directly.",
            "I can't access the database right now. Contact us for more info."
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    async function checkChatbotHealth() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'MTech-Website-Chatbot/1.0'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                userSession.apiHealthy = true;
            } else {
                throw new Error("Health check failed");
            }
        } catch (error) {
            console.warn("Health check failed:", error.message);
            userSession.apiHealthy = false;
            setTimeout(checkChatbotHealth, 30000);
        }
    }

    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });

    chatbotWindow.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    checkChatbotHealth();
});
