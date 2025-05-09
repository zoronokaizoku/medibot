
// Initialize connection status handling
let isOnline = navigator.onLine;
updateConnectionStatus();

// Load medical responses data from server for offline use
let offlineResponses = {};

// Fetch responses and store them for offline use
async function fetchAndStoreResponses() {
    try {
        const response = await fetch('/get-medical-responses');
        const data = await response.json();
        offlineResponses = data;
        localStorage.setItem('medicalResponses', JSON.stringify(data));
        console.log('Medical responses cached for offline use');
    } catch (error) {
        console.error('Failed to fetch medical responses:', error);
        // Try to load from localStorage if fetch fails
        const cachedResponses = localStorage.getItem('medicalResponses');
        if (cachedResponses) {
            offlineResponses = JSON.parse(cachedResponses);
        }
    }
}

// Initialize by fetching responses
fetchAndStoreResponses();

// Listen for online/offline events
window.addEventListener('online', function() {
    isOnline = true;
    updateConnectionStatus();
});

window.addEventListener('offline', function() {
    isOnline = false;
    updateConnectionStatus();
});

function updateConnectionStatus() {
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    
    if (isOnline) {
        statusIndicator.className = 'online';
        statusText.textContent = 'Online';
    } else {
        statusIndicator.className = 'offline';
        statusText.textContent = 'Offline - Limited Features';
    }
}

// Initialize timestamps
document.addEventListener('DOMContentLoaded', function() {
    const timestampDivs = document.querySelectorAll('.message-timestamp');
    updateTimestamps(timestampDivs);
    
    // Add Enter key event listener
    document.getElementById('message').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

function updateTimestamps(elements) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    elements.forEach(element => {
        element.textContent = `${formattedHours}:${formattedMinutes} ${ampm}`;
    });
}

function selectSymptom(symptom) {
    document.getElementById('message').value = symptom;
    sendMessage();
}

async function sendMessage() {
    const messageInput = document.getElementById('message');
    const chatbox = document.getElementById('chatbox');
    const audioPlayerDiv = document.getElementById('audio-player');
    const message = messageInput.value.trim();
    messageInput.value = '';

    if (message === '') return;

    // Add user message
    const userDiv = document.createElement('div');
    userDiv.classList.add('message', 'user-message');
    
    const userHeader = document.createElement('div');
    userHeader.classList.add('message-header');
    
    const userAvatar = document.createElement('div');
    userAvatar.classList.add('user-avatar');
    userAvatar.textContent = 'Y';
    userHeader.appendChild(userAvatar);
    userDiv.appendChild(userHeader);
    
    const userBubble = document.createElement('div');
    userBubble.classList.add('message-bubble');
    userBubble.textContent = message;
    userDiv.appendChild(userBubble);
    
    const timestampDiv = document.createElement('div');
    timestampDiv.classList.add('message-timestamp');
    userDiv.appendChild(timestampDiv);
    updateTimestamps([timestampDiv]);
    
    chatbox.appendChild(userDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
    
    // Hide suggestions after user sends message
    const suggestions = document.querySelector('.suggestions');
    if (suggestions) {
        suggestions.style.display = 'none';
    }

    // Show typing indicator
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'block';
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    // Check if online or offline
    if (navigator.onLine) {
        try {
            const response = await fetch('/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            
            // Add bot response
            addBotMessage(data.response, chatbox, typingIndicator);
            
            // Add audio player if available
            if (audioPlayerDiv) {
                audioPlayerDiv.innerHTML = `<audio controls autoplay><source src="/static/response.mp3?t=${new Date().getTime()}" type="audio/mpeg"></audio>`;
            }
            
        } catch (error) {
            console.error('Error:', error);
            handleOfflineOrError(message, chatbox, typingIndicator);
        }
    } else {
        // Offline handling
        handleOfflineOrError(message, chatbox, typingIndicator);
    }
}

function handleOfflineOrError(message, chatbox, typingIndicator) {
    // Get responses from localStorage or use default fallbacks
    let responses = offlineResponses;
    
    if (Object.keys(responses).length === 0) {
        // Try to get from localStorage
        const cachedResponses = localStorage.getItem('medicalResponses');
        if (cachedResponses) {
            responses = JSON.parse(cachedResponses);
        } else {
            // Default fallback responses
            responses = {
                "fever": "You mentioned having a fever. Please monitor your temperature. Stay hydrated and rest. If your fever is high (above 102°F or 39°C), persists for more than 3 days, or is accompanied by other concerning symptoms, please seek medical attention immediately.",
                "headache": "You're experiencing a headache. Try resting in a quiet, dark room and staying hydrated. Over-the-counter pain relievers might help. If your headache is severe or unusual, please seek medical attention.",
                "cough": "You mentioned a cough. Try staying hydrated and using honey (if you're not allergic and over 1 year old). If you have difficulty breathing, seek immediate medical help.",
                "sore throat": "A sore throat can be uncomfortable. Try gargling with warm salt water or using throat lozenges. If it's severe or persists, please consult a doctor.",
                "thank you": "You're welcome! Take care.",
                "goodbye": "Goodbye! Stay healthy.",
                "default": "I'm currently in offline mode with limited responses. Please check your connection or try again later."
            };
        }
    }
    
    // Process the message offline with basic keywords
    let response = responses["default"];
    if (Array.isArray(response)) {
        response = response[0];
    }
    
    const lowercaseMessage = message.toLowerCase();
    
    for (const keyword in responses) {
        if (lowercaseMessage.includes(keyword)) {
            response = responses[keyword];
            if (Array.isArray(response)) {
                response = response[0];
            }
            break;
        }
    }
    
    // Simulate a short delay for typing
    setTimeout(() => {
        addBotMessage(response, chatbox, typingIndicator);
    }, 1000);
}

function addBotMessage(responseText, chatbox, typingIndicator) {
    // Hide typing indicator if it exists
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
    
    // Add bot response
    const botDiv = document.createElement('div');
    botDiv.classList.add('message', 'bot-message');
    
    const botHeader = document.createElement('div');
    botHeader.classList.add('message-header');
    
    const botAvatar = document.createElement('div');
    botAvatar.classList.add('bot-avatar');
    botAvatar.textContent = 'M';
    botHeader.appendChild(botAvatar);
    botDiv.appendChild(botHeader);
    
    const botBubble = document.createElement('div');
    botBubble.classList.add('message-bubble');
    botBubble.textContent = responseText;
    botDiv.appendChild(botBubble);
    
    const botTimestampDiv = document.createElement('div');
    botTimestampDiv.classList.add('message-timestamp');
    botDiv.appendChild(botTimestampDiv);
    updateTimestamps([botTimestampDiv]);
    
    chatbox.appendChild(botDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}
