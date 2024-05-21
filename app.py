from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Load words from file
with open('words.txt') as f:
    words = [word.strip().lower() for word in f.read().splitlines()]

# Choose a random word
def get_new_word():
    return random.choice(words).lower()

secret_word = get_new_word()

@app.route('/')
def index():
    global secret_word
    secret_word = get_new_word()  # Regenerate a new word on page load
    return render_template('index.html', secret_word=secret_word)

@app.route('/guess', methods=['POST'])
def guess():
    data = request.get_json()
    guess = data['guess'].lower()
    result = []

    for i in range(len(secret_word)):
        if guess[i] == secret_word[i]:
            result.append('correct')
        elif guess[i] in secret_word:
            result.append('present')
        else:
            result.append('absent')
    
    return jsonify(result=result)

if __name__ == '__main__':
    app.run(debug=True)
