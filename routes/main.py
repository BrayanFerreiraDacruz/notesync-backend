from flask import Flask, request, jsonify
from flask_cors import CORS
from my_calendar import create_event

import datetime

app = Flask(__name__)
CORS(app)

@app.route('/add-note', methods=['POST'])
def add_note():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    datetime_str = data.get('datetime')  # Ex: "2025-08-02T14:00"

    try:
        start_datetime = datetime.datetime.fromisoformat(datetime_str)
        event_link = create_event(title, description, start_datetime)
        return jsonify({'message': 'Anotação criada no Google Calendar', 'link': event_link}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def home():
    return "NoteSync Backend ativo!"
def home():
        return "NoteSync Backend ativo!"
# Libera CORS só para o domínio do Firebase (coloque o seu real)
CORS(app, origins=[
    "https://anoteaqui-44325.web.app"
])

@app.route('/add-note', methods=['POST'])
def add_note():
    # teu código aqui...
    return jsonify({'message': 'Anotação criada no Google Calendar'}), 201

@app.route('/')
def home():
    return "NoteSync Backend ativo!"
def home():
    return "NoteSync Backend ativo!"

@app.route('/api/test', methods=['GET'])
def test_connection():
    return jsonify({"status": "ok", "message": "Backend conectado com sucesso!"})

if __name__ == '__main__':
    app.run(debug=True)


# 🔹 Rota só pra teste de conexão do front-end
@app.route('/api/test', methods=['GET'])
def test_connection():
    return jsonify({"status": "ok", "message": "Backend conectado com sucesso!"})

if __name__ == '__main__':
    app.run(debug=True)
# Configuração do Auth0
AUTH0_DOMAIN = 'SEU_DOMINIO.auth0.com'
AUTH0_CLIENT_ID = 'SEU_CLIENT_ID'
AUTH0_CLIENT_SECRET = 'SEU_CLIENT_SECRET'
AUTH0_CALLBACK_URL = 'http://localhost:5000/callback'
AUTH0_AUDIENCE = 'https://SEU_DOMINIO.auth0.com/userinfo'
AUTH0_SCOPE = 'openid profile email'
