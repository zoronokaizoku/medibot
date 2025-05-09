
// Medical responses database for offline use
const medicalResponses = {
    "greeting": "Hello! Welcome to your AI Health Assistant. How can I help you today?",
    "fever": "You mentioned having a fever. Please monitor your temperature. Stay hydrated and rest. If your fever is high (above 102°F or 39°C), persists for more than 3 days, or is accompanied by other concerning symptoms like stiff neck, severe headache, or difficulty breathing, please seek medical attention immediately.",
    "high fever": "A high fever (above 102°F or 39°C) requires close monitoring. Ensure you stay hydrated and rest. If it persists or is accompanied by other symptoms, seek medical attention.",
    "low grade fever": "A low-grade fever might just need rest and hydration. Monitor your temperature and if it increases or other symptoms develop, consult a doctor.",
    "headache": "You're experiencing a headache. Try resting in a quiet, dark room and staying hydrated. Over-the-counter pain relievers like Paracetamol or Ibuprofen might help. If your headache is severe, sudden, accompanied by vision changes, numbness, weakness, or a stiff neck, please seek immediate medical attention.",
    "severe headache": "A severe headache, especially if sudden, needs immediate medical attention to rule out serious conditions.",
    "tension headache": "For a tension headache, try relaxation techniques, gentle neck stretches, and over-the-counter pain relievers.",
    "migraine": "Migraines can be debilitating. If you experience frequent or severe migraines, it's best to consult a doctor for a management plan.",
    "cough": "You mentioned a cough. Could you describe if it's dry or if you're bringing up any phlegm? If you have difficulty breathing, seek immediate medical help.",
    "dry cough": "For a dry cough, try soothing lozenges or a humidifier. If it persists or is bothersome, consult a doctor.",
    "wet cough": "If you have a wet cough, ensure you're staying hydrated to help loosen mucus. If it worsens or is accompanied by difficulty breathing or chest pain, consult a doctor.",
    "persistent cough": "A cough that lasts for more than a few weeks should be evaluated by a doctor to determine the cause.",
    "cough with blood": "Coughing up blood is a serious symptom and requires immediate medical attention.",
    "sore throat": "A sore throat can be uncomfortable. Try gargling with warm salt water, drinking warm fluids with honey and lemon, or using throat lozenges. If your sore throat is severe, lasts more than a few days, or is accompanied by fever or difficulty swallowing, please consult a doctor.",
    "strep throat": "If you suspect strep throat (severe sore throat, pain swallowing, fever), it's important to see a doctor for diagnosis and treatment with antibiotics.",
    "hoarse voice": "A hoarse voice can be due to a cold or overuse. Rest your voice and stay hydrated. If it persists for more than a week or is accompanied by pain, consult a doctor.",
    "stomach pain": "You mentioned stomach pain. Please try to describe the location and type of pain (e.g., sharp, dull, cramping). If the pain is severe, sudden, accompanied by fever, vomiting, or blood in your stool, seek immediate medical attention.",
    "sharp stomach pain": "Sudden, sharp stomach pain can indicate a serious issue and requires immediate medical attention.",
    "dull stomach ache": "A mild, dull stomach ache might resolve with rest. Avoid heavy meals and observe if it worsens.",
    "cramping stomach pain": "Cramping stomach pain can be due to gas or indigestion. If it's severe or persistent, consult a doctor.",
    "nausea": "If you're feeling nauseous, try eating bland foods like toast or crackers and sipping on clear fluids. Avoid strong smells. If it's severe or persistent, consult a doctor.",
    "vomiting": "Vomiting can lead to dehydration. Sip on clear fluids. Avoid solid foods until you feel better. If it's severe, persistent, or you see blood, seek medical attention.",
    "diarrhea": "Diarrhea can lead to dehydration. Make sure to drink plenty of fluids, preferably oral rehydration solutions. Avoid dairy and greasy foods. If it's severe, bloody, or lasts more than 2 days, consult a doctor.",
    "constipation": "For constipation, increase your intake of fiber-rich foods, drink plenty of water, and try gentle exercise. If it persists, consult a doctor.",
    "bloating": "If you're feeling bloated, try avoiding gas-producing foods and eating slowly. Gentle exercise might also help. If it's severe or accompanied by pain, consult a doctor.",
    "indigestion": "For indigestion, try smaller, more frequent meals and avoid fatty or spicy foods. Over-the-counter antacids might provide relief. If the pain is severe or persistent, consult a doctor.",
    "heartburn": "For heartburn, try avoiding trigger foods and eating smaller meals. Over-the-counter antacids can provide relief. If it's frequent or severe, consult a doctor.",
    "acid reflux": "Managing acid reflux often involves dietary changes and avoiding lying down after eating. If it's persistent, consult a doctor.",
    "dizziness": "If you feel dizzy, sit or lie down immediately. Stay hydrated. If it's persistent, severe, or accompanied by other symptoms like blurred vision or fainting, consult a doctor.",
    "lightheadedness": "Lightheadedness can have various causes. Ensure you're eating regularly and staying hydrated. If it persists, consult a doctor.",
    "vertigo": "Severe or persistent vertigo (spinning sensation) should be evaluated by a doctor.",
    "fainting": "Fainting can be a sign of an underlying issue. If you faint, it's important to consult a doctor to determine the cause.",
    "fatigue": "Feeling tired can be due to many factors. Ensure you're getting enough sleep, staying hydrated, and eating a balanced diet. If fatigue is persistent and interferes with your daily life, consult a doctor.",
    "thank you": "You're welcome! Take care.",
    "thanks": "Glad I could assist. Feel better!",
    "bye": "Goodbye! Stay healthy.",
    "goodbye": "Wishing you well!",
    "default": "Sorry, I didn't understand your symptoms. Please be more specific, or consult a healthcare professional for accurate diagnosis and treatment."
};

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

function sendMessage() {
    const messageInput = document.getElementById('message');
    const chatbox = document.getElementById('chatbox');
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
    
    // Process the message offline
    setTimeout(() => {
        // Find matching response using more advanced matching
        let response = findBestResponse(message.toLowerCase());
        
        // Add bot message
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
        botBubble.textContent = response;
        botDiv.appendChild(botBubble);
        
        const botTimestampDiv = document.createElement('div');
        botTimestampDiv.classList.add('message-timestamp');
        botDiv.appendChild(botTimestampDiv);
        updateTimestamps([botTimestampDiv]);
        
        chatbox.appendChild(botDiv);
        chatbox.scrollTop = chatbox.scrollHeight;
    }, 1000);
}

function findBestResponse(userInput) {
    // First, check for exact matches
    for (const keyword in medicalResponses) {
        if (userInput === keyword) {
            return medicalResponses[keyword];
        }
    }
    
    // Then check for partial matches
    for (const keyword in medicalResponses) {
        if (userInput.includes(keyword)) {
            return medicalResponses[keyword];
        }
    }
    
    // Check for word-by-word matches
    const userWords = userInput.split(' ');
    for (const keyword in medicalResponses) {
        const keywordWords = keyword.split(' ');
        for (const userWord of userWords) {
            if (keywordWords.includes(userWord) && userWord.length > 3) {  // Only match on significant words
                return medicalResponses[keyword];
            }
        }
    }
    
    // Default response if no match found
    return medicalResponses["default"];
}
