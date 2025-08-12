from flask import Flask, request, jsonify
from flask_cors import CORS
from my_calendar import create_event
import datetime

app = Flask(__name__)

# Libera CORS só para o domínio do Firebase
CORS(app, origins=[
    "https://anoteaqui-44325.web.app"
])

# Rota principal
@app.route('/')
def home():
    return "NoteSync Backend ativo!"

# Rota para adicionar nota no Google Calendar
@app.route('/add-note', methods=['POST'])
def add_note():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    datetime_str = data.get('datetime')  # Exemplo: "2025-08-02T14:00"

    try:
        start_datetime = datetime.datetime.fromisoformat(datetime_str)
        event_link = create_event(title, description, start_datetime)
        return jsonify({'message': 'Anotação criada no Google Calendar', 'link': event_link}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rota para teste de conexão
@app.route('/api/test', methods=['GET'])
def test_connection():
    return jsonify({"status": "ok", "message": "Backend conectado com sucesso!"})

# Executa localmente
if __name__ == '__main__':
    app.run(debug=True)
