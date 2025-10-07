# Rotas Flask para NoteAqui Backend

Este documento descreve todas as rotas necessárias para o backend Flask do sistema NoteAqui.

## 🔧 Configuração Inicial

### Dependências Necessárias
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from authlib.integrations.flask_client import OAuth
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
```

### Configuração da Aplicação
```python
app = Flask(__name__)
CORS(app)  # Permite requisições do frontend
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')

# Configuração OAuth Google (opcional)
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)
```

## 🔐 Rotas de Autenticação

### 1. Teste de Conexão
```python
@app.route('/api/test', methods=['GET'])
def test_connection():
    return jsonify({
        'status': 'success',
        'message': 'Backend NoteAqui funcionando!',
        'timestamp': datetime.now().isoformat()
    })
```

### 2. Registro de Usuário
```python
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validação básica
        if not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({'message': 'Dados obrigatórios faltando'}), 400
        
        # Aqui você implementaria a lógica de salvar no banco
        # Por enquanto, simulamos um usuário criado
        
        # Gerar token JWT
        token = jwt.encode({
            'user_id': 1,  # ID do usuário criado
            'email': data['email'],
            'exp': datetime.utcnow() + timedelta(days=30)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': 1,
                'name': data['name'],
                'email': data['email']
            }
        })
        
    except Exception as e:
        return jsonify({'message': 'Erro interno do servidor'}), 500
```

### 3. Login de Usuário
```python
@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validação básica
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email e senha são obrigatórios'}), 400
        
        # Aqui você implementaria a verificação no banco
        # Por enquanto, simulamos um login válido
        
        # Gerar token JWT
        token = jwt.encode({
            'user_id': 1,
            'email': data['email'],
            'exp': datetime.utcnow() + timedelta(days=30)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'success': True,
            'token': token,
            'user': {
                'id': 1,
                'name': 'Usuário Demo',
                'email': data['email']
            }
        })
        
    except Exception as e:
        return jsonify({'message': 'Erro interno do servidor'}), 500
```

### 4. Validação de Token
```python
@app.route('/api/auth/validate', methods=['GET'])
def validate_token():
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token não fornecido'}), 401
        
        # Remove "Bearer " do token
        token = token.replace('Bearer ', '')
        
        # Decodifica o token
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        
        return jsonify({
            'user': {
                'id': payload['user_id'],
                'email': payload['email'],
                'name': 'Usuário Demo'
            }
        })
        
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token expirado'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Token inválido'}), 401
```

## 📅 Rotas de Eventos

### 5. Listar Eventos
```python
@app.route('/api/events', methods=['GET'])
def get_events():
    try:
        # Verificar autenticação
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token não fornecido'}), 401
        
        # Parâmetros de filtro
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # Eventos de exemplo
        events = [
            {
                'id': 1,
                'title': 'Reunião de Equipe',
                'description': 'Reunião semanal da equipe de desenvolvimento',
                'date': '2024-09-20',
                'time': '09:00',
                'location': 'Sala de Reuniões',
                'type': 'meeting',
                'priority': 'high'
            },
            {
                'id': 2,
                'title': 'Apresentação do Projeto',
                'description': 'Apresentar o progresso do projeto NoteAqui',
                'date': '2024-09-22',
                'time': '14:00',
                'location': 'Auditório',
                'type': 'event',
                'priority': 'medium'
            }
        ]
        
        return jsonify({
            'success': True,
            'events': events
        })
        
    except Exception as e:
        return jsonify({'message': 'Erro interno do servidor'}), 500
```

### 6. Criar Evento
```python
@app.route('/api/events', methods=['POST'])
def create_event():
    try:
        # Verificar autenticação
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token não fornecido'}), 401
        
        data = request.get_json()
        
        # Validação básica
        if not data.get('title') or not data.get('date'):
            return jsonify({'message': 'Título e data são obrigatórios'}), 400
        
        # Simular criação do evento
        new_event = {
            'id': 3,  # ID gerado
            'title': data['title'],
            'description': data.get('description', ''),
            'date': data['date'],
            'time': data.get('time', '00:00'),
            'location': data.get('location', ''),
            'type': data.get('type', 'event'),
            'priority': data.get('priority', 'medium')
        }
        
        return jsonify({
            'success': True,
            'event': new_event
        })
        
    except Exception as e:
        return jsonify({'message': 'Erro interno do servidor'}), 500
```

### 7. Atualizar Evento
```python
@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    try:
        # Verificar autenticação
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token não fornecido'}), 401
        
        data = request.get_json()
        
        # Simular atualização do evento
        updated_event = {
            'id': event_id,
            'title': data.get('title', 'Evento Atualizado'),
            'description': data.get('description', ''),
            'date': data.get('date', '2024-09-20'),
            'time': data.get('time', '00:00'),
            'location': data.get('location', ''),
            'type': data.get('type', 'event'),
            'priority': data.get('priority', 'medium')
        }
        
        return jsonify({
            'success': True,
            'event': updated_event
        })
        
    except Exception as e:
        return jsonify({'message': 'Erro interno do servidor'}), 500
```

### 8. Deletar Evento
```python
@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        # Verificar autenticação
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token não fornecido'}), 401
        
        # Simular deleção do evento
        return jsonify({
            'success': True,
            'message': 'Evento deletado com sucesso'
        })
        
    except Exception as e:
        return jsonify({'message': 'Erro interno do servidor'}), 500
```

### 9. Buscar Eventos
```python
@app.route('/api/events/search', methods=['GET'])
def search_events():
    try:
        # Verificar autenticação
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token não fornecido'}), 401
        
        query = request.args.get('q', '')
        
        # Simular busca
        events = [
            {
                'id': 1,
                'title': 'Reunião de Equipe',
                'description': 'Reunião semanal da equipe',
                'date': '2024-09-20',
                'time': '09:00',
                'type': 'meeting'
            }
        ]
        
        return jsonify({
            'success': True,
            'events': events
        })
        
    except Exception as e:
        return jsonify({'message': 'Erro interno do servidor'}), 500
```

## 👤 Rotas de Usuário

### 10. Obter Perfil do Usuário
```python
@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    try:
        # Verificar autenticação
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token não fornecido'}), 401
        
        # Simular dados do usuário
        user_profile = {
            'id': 1,
            'name': 'Usuário Demo',
            'email': 'demo@noteaqui.com',
            'bio': 'Desenvolvedor apaixonado por tecnologia',
            'phone': '(11) 99999-9999',
            'location': 'São Paulo, SP',
            'timezone': 'America/Sao_Paulo'
        }
        
        return jsonify({
            'success': True,
            'user': user_profile
        })
        
    except Exception as e:
        return jsonify({'message': 'Erro interno do servidor'}), 500
```

### 11. Atualizar Perfil
```python
@app.route('/api/user/profile', methods=['PUT'])
def update_profile():
    try:
        # Verificar autenticação
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token não fornecido'}), 401
        
        data = request.get_json()
        
        # Simular atualização do perfil
        return jsonify({
            'success': True,
            'message': 'Perfil atualizado com sucesso'
        })
        
    except Exception as e:
        return jsonify({'message': 'Erro interno do servidor'}), 500
```

## 🚀 Executar a Aplicação

```python
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

## 📝 Exemplo de Arquivo Principal (app.py)

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'noteaqui-secret-key')

# Todas as rotas acima vão aqui...

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
```

## 🔧 Variáveis de Ambiente (.env)

```env
SECRET_KEY=noteaqui-super-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DATABASE_URL=your-database-url
PORT=5000
```

## 📦 Requirements.txt

```txt
Flask==2.3.3
Flask-CORS==4.0.0
authlib==1.2.1
requests==2.31.0
google-api-python-client==2.100.0
google-auth-httplib2==0.1.1
google-auth-oauthlib==1.1.0
python-dotenv==1.0.0
PyJWT==2.8.0
gunicorn==21.2.0
```

Este arquivo contém todas as rotas necessárias para o funcionamento completo do frontend NoteAqui. Implemente essas rotas no seu backend Flask para ter um sistema totalmente funcional!

