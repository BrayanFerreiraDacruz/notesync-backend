# NoteAqui - Sistema de Agenda Profissional

Um sistema completo de agenda e gerenciamento de eventos com interface moderna e funcionalidades avançadas.

## 🚀 Características

### Frontend
- **Interface Moderna**: Design profissional com gradientes verde/azul
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Animações Suaves**: Transições elegantes com Framer Motion
- **Componentes Reutilizáveis**: Arquitetura baseada em componentes React
- **Autenticação Completa**: Sistema de login/registro com validação
- **Múltiplas Visualizações**: Calendário por dia, semana e mês
- **Gerenciamento de Eventos**: CRUD completo de eventos
- **Perfil de Usuário**: Configurações pessoais e preferências

### Backend
- **API RESTful**: Endpoints organizados e documentados
- **Autenticação JWT**: Sistema seguro de autenticação
- **CORS Configurado**: Permite comunicação frontend-backend
- **Deploy no Render**: Backend hospedado e acessível

## 🛠️ Tecnologias

### Frontend
- **React 18**: Framework principal
- **React Router**: Navegação e rotas
- **Tailwind CSS**: Estilização moderna
- **Shadcn/UI**: Componentes de interface
- **Framer Motion**: Animações
- **Lucide Icons**: Ícones modernos
- **Vite**: Build tool rápido

### Backend
- **Flask**: Framework Python
- **Flask-CORS**: Configuração CORS
- **Authlib**: Autenticação
- **Gunicorn**: Servidor WSGI
- **Google APIs**: Integração com serviços Google

## 📁 Estrutura do Projeto

```
notesync-backend/
├── public/                 # Frontend buildado (Firebase)
│   ├── assets/            # CSS e JS compilados
│   ├── index.html         # Página principal
│   └── favicon.ico        # Ícone do site
├── backend/               # Código do backend (Flask)
├── requirements.txt       # Dependências Python
└── README.md             # Este arquivo
```

## 🚀 Como Executar

### Desenvolvimento Local

1. **Clone o repositório**:
```bash
git clone https://github.com/BrayanFerreiraDacruz/notesync-backend.git
cd notesync-backend
```

2. **Backend (Flask)**:
```bash
# Instalar dependências
pip install -r requirements.txt

# Executar servidor
python app.py
```

3. **Frontend (React)**:
```bash
# Se quiser desenvolver o frontend
cd frontend-dev
npm install
npm run dev
```

### Deploy

#### Frontend (Firebase)
O frontend já está buildado na pasta `public/` e pronto para deploy no Firebase:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar projeto
firebase init hosting

# Deploy
firebase deploy
```

#### Backend (Render)
O backend está configurado para deploy automático no Render através do GitHub.

## 🎨 Design System

### Cores Principais
- **Verde Claro**: `#10b981` (emerald-500)
- **Azul Claro**: `#3b82f6` (blue-500)
- **Gradientes**: Combinações harmoniosas verde-azul
- **Neutros**: Tons de cinza para texto e backgrounds

### Componentes
- **Cards**: Sombras suaves e bordas arredondadas
- **Botões**: Gradientes com hover effects
- **Formulários**: Validação visual e feedback
- **Navegação**: Sidebar responsiva com animações

## 📱 Funcionalidades

### Autenticação
- [x] Login com email/senha
- [x] Registro de novos usuários
- [x] Validação de formulários
- [x] Proteção de rotas
- [x] Persistência de sessão

### Dashboard
- [x] Visão geral dos eventos
- [x] Estatísticas em cards
- [x] Eventos próximos
- [x] Ações rápidas
- [x] Saudação personalizada

### Calendário
- [x] Visualização por dia
- [x] Visualização por semana
- [x] Visualização por mês
- [x] Navegação entre períodos
- [x] Eventos coloridos por tipo

### Eventos
- [x] Criar novos eventos
- [x] Editar eventos existentes
- [x] Excluir eventos
- [x] Busca e filtros
- [x] Categorização por tipo
- [x] Prioridades visuais

### Perfil
- [x] Informações pessoais
- [x] Alteração de senha
- [x] Preferências de notificação
- [x] Configurações de aparência
- [x] Upload de avatar

## 🔧 Configuração

### Variáveis de Ambiente

```env
# Backend
FLASK_ENV=production
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url

# Frontend (build time)
VITE_API_URL=https://backend-u287.onrender.com
```

### APIs Integradas
- **Backend Principal**: `https://backend-u287.onrender.com`
- **Google APIs**: Para autenticação e calendário
- **Firebase**: Para hosting do frontend

## 🚀 Deploy URLs

- **Frontend**: https://anoteaqui-44325.web.app/
- **Backend**: https://backend-u287.onrender.com

## 📝 Próximos Passos

- [ ] Integração com Google Calendar
- [ ] Notificações push
- [ ] Modo offline
- [ ] Temas personalizáveis
- [ ] Exportação de eventos
- [ ] Compartilhamento de calendários

## 👨‍💻 Desenvolvedor

Desenvolvido por **Brayan Ferreira da Cruz** com assistência de IA para criar uma solução completa e profissional.

---

**NoteAqui** - Sua agenda profissional inteligente 📅✨