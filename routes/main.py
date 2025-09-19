from flask import Flask, request, jsonify
from flask_cors import CORS
from my_calendar import create_event
import datetime

app = Flask(__name__)

# Libera CORS apenas para o front-end no Firebase
CORS(app, origins=["https://anoteaqui-44325.web.app"])

@app.route('/')
def home():
    return "NoteSync Backend ativo!"

@app.route('/add-note', methods=['POST'])
def add_note():
    try:
        data = request.json
        title = data.get('title')
        description = data.get('description')
        datetime_str = data.get('datetime')  # Ex: "2025-08-02T14:00"

        if not title or not datetime_str:
            return jsonify({'error': 'Título e data são obrigatórios'}), 400

        start_datetime = datetime.datetime.fromisoformat(datetime_str)
        event_link = create_event(title, description, start_datetime)

        return jsonify({'message': 'Anotação criada no Google Calendar', 'link': event_link}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/test', methods=['GET'])
def test_connection():
    return jsonify({"status": "ok", "message": "Backend conectado com sucesso!"})

if __name__ == '__main__':
    app.run(debug=True)
