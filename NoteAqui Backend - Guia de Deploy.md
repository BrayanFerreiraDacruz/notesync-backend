# NoteAqui Backend - Guia de Deploy

## 📋 Sobre o Projeto

Backend Flask para o aplicativo **AnoteAqui** - Sistema de gerenciamento de eventos e agenda profissional.

## 🚀 Deploy no Render

### Passo 1: Preparar o Repositório

Certifique-se de que os seguintes arquivos estão no repositório:

- `app.py` - Aplicação Flask principal
- `requirements.txt` - Dependências Python
- `render.yaml` - Configuração do Render (opcional)

### Passo 2: Configurar no Render

1. Acesse [render.com](https://render.com)
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: notesync-backend (ou outro nome)
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

### Passo 3: Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente no Render:

```
SECRET_KEY=noteaqui-super-secret-key-2024
PYTHON_VERSION=3.11.0
```

### Passo 4: Deploy

Clique em "Create Web Service" e aguarde o deploy ser concluído.

## 🔗 URL do Backend

Após o deploy, você receberá uma URL como:
```
https://seu-app.onrender.com
```

## 🔧 Atualizar Frontend

Atualize a URL do backend no arquivo `authService.js` e `eventService.js`:

```javascript
const API_BASE_URL = 'https://seu-app.onrender.com/api'
```

## 📡 Rotas Disponíveis

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/validate` - Validar token

### Eventos
- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento
- `GET /api/events/:id` - Buscar evento
- `PUT /api/events/:id` - Atualizar evento
- `DELETE /api/events/:id` - Deletar evento
- `GET /api/events/search?q=query` - Buscar eventos

### Perfil
- `GET /api/user/profile` - Obter perfil
- `PUT /api/user/profile` - Atualizar perfil

### Teste
- `GET /api/test` - Testar conexão

## 🔐 Autenticação

Todas as rotas (exceto `/api/auth/*` e `/api/test`) requerem autenticação via JWT.

Envie o token no header:
```
Authorization: Bearer seu-token-jwt
```

## ⚠️ Importante

- O backend usa armazenamento em memória (não persistente)
- Para produção, implemente um banco de dados (PostgreSQL, MongoDB, etc.)
- As senhas estão sendo armazenadas em texto plano (use bcrypt em produção)
- Configure CORS adequadamente para seu domínio do Firebase

## 📦 Dependências

- Flask 2.3.3
- Flask-CORS 4.0.0
- PyJWT 2.8.0
- gunicorn 21.2.0

## 🐛 Troubleshooting

### Erro de CORS
Verifique se a URL do frontend está configurada corretamente no `app.py`:
```python
CORS(app, origins=["https://anoteaqui-44325.web.app"])
```

### Erro 401 (Unauthorized)
Verifique se o token JWT está sendo enviado corretamente no header.

### Erro 500
Verifique os logs no Render Dashboard para identificar o problema.
