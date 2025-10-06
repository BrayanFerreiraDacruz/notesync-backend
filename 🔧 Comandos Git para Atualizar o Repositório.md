# 🔧 Comandos Git para Atualizar o Repositório

## Opção 1: Usando o Script Automatizado (Recomendado)

\`\`\`bash
cd /home/ubuntu/notesync-backend
./push_changes.sh
\`\`\`

O script irá:
1. Configurar seu nome e email do Git (se necessário)
2. Mostrar os arquivos que serão enviados
3. Fazer o push para o GitHub

## Opção 2: Comandos Manuais

### Passo 1: Configurar Git (apenas primeira vez)

\`\`\`bash
git config user.name "Seu Nome"
git config user.email "seu-email@exemplo.com"
\`\`\`

### Passo 2: Verificar Status

\`\`\`bash
git status
\`\`\`

### Passo 3: Fazer Commit (se ainda não fez)

\`\`\`bash
git commit -m "feat: implementar backend completo com autenticação JWT e todas as rotas necessárias"
\`\`\`

### Passo 4: Push para GitHub

\`\`\`bash
git push origin main
\`\`\`

## 🔐 Se Pedir Autenticação

### Opção A: Usar Token de Acesso Pessoal (PAT)

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Selecione permissões: `repo` (todas)
4. Copie o token gerado
5. Use o comando:

\`\`\`bash
git push https://SEU_TOKEN@github.com/BrayanFerreiraDacruz/notesync-backend.git main
\`\`\`

### Opção B: Usar GitHub CLI

\`\`\`bash
gh auth login
git push origin main
\`\`\`

## ✅ Verificar se o Push Funcionou

Acesse o repositório no GitHub:
https://github.com/BrayanFerreiraDacruz/notesync-backend

Você deve ver os novos arquivos:
- ✅ app.py
- ✅ requirements.txt (atualizado)
- ✅ render.yaml
- ✅ README_DEPLOY.md
- ✅ INSTRUCOES_ATUALIZACAO.md

## 🚀 Após o Push

### 1. Verificar Deploy no Render

Acesse: https://dashboard.render.com

O Render deve detectar automaticamente as mudanças e iniciar um novo deploy.

### 2. Aguardar Deploy

O processo pode levar 2-5 minutos.

### 3. Testar o Backend

\`\`\`bash
curl https://backend-u287.onrender.com/api/test
\`\`\`

Resposta esperada:
\`\`\`json
{
  "status": "success",
  "message": "Backend NoteAqui funcionando!",
  "timestamp": "2025-10-06T..."
}
\`\`\`

## 🐛 Troubleshooting

### Erro: "fatal: unable to auto-detect email address"

**Solução:**
\`\`\`bash
git config user.name "Seu Nome"
git config user.email "seu-email@exemplo.com"
\`\`\`

### Erro: "Authentication failed"

**Solução:**
Use um Personal Access Token (PAT) em vez da senha.

### Erro: "Permission denied"

**Solução:**
Verifique se você tem permissão de escrita no repositório.

## 📞 Precisa de Ajuda?

Se encontrar problemas, você pode:

1. **Verificar logs do Git:**
   \`\`\`bash
   git log --oneline
   \`\`\`

2. **Verificar configuração:**
   \`\`\`bash
   git config --list
   \`\`\`

3. **Verificar remote:**
   \`\`\`bash
   git remote -v
   \`\`\`
