import os

project_name = "NoteSyncApp"
base_path = os.getcwd()  

folders = [
    "backend",
    "backend/routes",
    "backend/templates",
    "backend/static",
    "backend/static/css",
    "backend/static/js",
    "backend/static/img",
    "frontend",
    "frontend/components",
    "frontend/assets",
    "auth",
    "docs",
]

files = {
    "README.md": "# NoteSyncApp\nAplicação de anotações com integração ao Google Calendar",
    ".gitignore": "__pycache__/\n.env\n*.pyc\nvenv/",
    "backend/app.py": "# App Flask aqui",
    "backend/routes/main.py": "# Rotas principais",
    "backend/templates/index.html": "<!-- Página principal -->",
    "backend/static/css/style.css": "/* CSS principal */",
    "backend/static/js/app.js": "// JS principal",
    "auth/auth0_config.py": "# Configuração do Auth0",
    "frontend/index.html": "<!-- SPA ou integração -->",
    "requirements.txt": "flask\nauthlib\nrequests\ngoogle-api-python-client\ngoogle-auth-httplib2\ngoogle-auth-oauthlib\ndotenv",
}

def create_structure():
    print(f"🎯 Criando estrutura para {project_name}...")
    for folder in folders:
        folder_path = os.path.join(base_path, folder)
        os.makedirs(folder_path, exist_ok=True)
    
    for file, content in files.items():
        file_path = os.path.join(base_path, file)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
    
    print("✅ Estrutura criada com sucesso em:")
    print(f"📁 {base_path}")

if __name__ == "__main__":
    create_structure()
