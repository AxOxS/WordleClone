from flask import Flask, render_template, request, jsonify, session
import random

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Set a secret key for session management

# Load words from file
with open('app/words.txt') as f:
    words = [word.strip().lower() for word in f.read().splitlines()]

# Choose a random word
def get_new_word():
    return random.choice(words).lower()

@app.route('/')
def index():
    # Generate a new word and store it in the session if not already present
    if 'secret_word' not in session:
        session['secret_word'] = get_new_word()
    return render_template('index.html', secret_word=session['secret_word'])

@app.route('/guess', methods=['POST'])
def guess():
    data = request.get_json()
    guess = data['guess'].lower()
    secret_word = session.get('secret_word')
    result = []

    for i in range(len(secret_word)):
        if guess[i] == secret_word[i]:
            result.append('correct')
        elif guess[i] in secret_word:
            result.append('present')
        else:
            result.append('absent')
    
    return jsonify(result=result, secret_word=secret_word)

@app.route('/new_game', methods=['POST'])
def new_game():
    # Generate a new word for a new game
    session['secret_word'] = get_new_word()
    return jsonify(status='new game started')

if __name__ == '__main__':
    app.run(debug=True)
