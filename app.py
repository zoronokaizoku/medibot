
from flask import Flask, request, jsonify, render_template, send_from_directory
from gtts import gTTS
import os
import random
import json

app = Flask(__name__, static_folder='static', template_folder='templates')

# Load medical responses from a JSON file to allow offline usage
def load_medical_responses():
    try:
        with open('static/medical_responses.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Default responses if file not found
        return {
            "greeting": ["Hello! Welcome to your AI Health Assistant. How can I help you today?"],
            "fever": ["You mentioned having a fever. Please monitor your temperature. Stay hydrated and rest. If your fever is high (above 102°F or 39°C), persists for more than 3 days, or is accompanied by other concerning symptoms like stiff neck, severe headache, or difficulty breathing, please seek medical attention immediately."],
            "headache": ["You're experiencing a headache. Try resting in a quiet, dark room and staying hydrated. Over-the-counter pain relievers like Paracetamol or Ibuprofen might help. If your headache is severe, sudden, accompanied by vision changes, numbness, weakness, or a stiff neck, please seek immediate medical attention."],
            "cough": ["You mentioned a cough. Could you describe if it's dry or if you're bringing up any phlegm? If you have difficulty breathing, seek immediate medical help."],
            "default": ["Sorry, I didn't understand your symptoms. Please be more specific, or consult a healthcare professional for accurate diagnosis and treatment."]
        }

# Home route to serve the frontend
@app.route('/')
def index():
    return render_template('index.html')

# Route to serve the offline capable app
@app.route('/offline.html')
def offline():
    return render_template('offline.html')

# Serve the service worker
@app.route('/sw.js')
def service_worker():
    return send_from_directory(app.static_folder, 'sw.js')

# Process medical query route
@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    user_input = data.get('message', '').lower()
    
    responses = load_medical_responses()
    
    # Find the appropriate response based on keywords in the user input
    response = None
    for key in responses:
        if key in user_input:
            if isinstance(responses[key], list):
                response = random.choice(responses[key])
            else:
                response = responses[key]
            break
    
    # If no matching keyword is found, use the default response
    if response is None:
        response = random.choice(responses["default"])
    
    # Create audio file with text-to-speech
    try:
        tts = gTTS(response, lang='en')
        tts.save("static/response.mp3")
    except Exception as e:
        print(f"TTS Error: {e}")
        # Create a simple message if TTS fails
        return jsonify({"response": response, "audio_error": str(e)})
    
    return jsonify({"response": response})

# Endpoint to get medical responses JSON for offline use
@app.route('/get-medical-responses')
def get_medical_responses():
    responses = load_medical_responses()
    return jsonify(responses)

if __name__ == '__main__':
    # Create folders if they don't exist
    os.makedirs('static', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    app.run(debug=True)
