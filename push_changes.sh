#!/bin/bash

echo "=========================================="
echo "Script de Push para GitHub"
echo "=========================================="
echo ""

# Verificar se já está configurado
if ! git config user.name > /dev/null 2>&1; then
    echo "⚠️  Configuração do Git necessária!"
    echo ""
    read -p "Digite seu nome: " user_name
    read -p "Digite seu email do GitHub: " user_email
    
    git config user.name "$user_name"
    git config user.email "$user_email"
    
    echo ""
    echo "✅ Configuração do Git concluída!"
    echo ""
fi

echo "📦 Arquivos que serão enviados:"
git status --short
echo ""

read -p "Deseja continuar com o push? (s/n): " confirm

if [ "$confirm" = "s" ] || [ "$confirm" = "S" ]; then
    echo ""
    echo "🚀 Fazendo push para o GitHub..."
    
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Push realizado com sucesso!"
        echo ""
        echo "🎯 Próximos passos:"
        echo "1. Acesse o Render Dashboard"
        echo "2. Verifique se o deploy automático foi iniciado"
        echo "3. Aguarde o deploy ser concluído"
        echo "4. Teste a URL: https://backend-u287.onrender.com/api/test"
    else
        echo ""
        echo "❌ Erro ao fazer push!"
        echo ""
        echo "Possíveis soluções:"
        echo "1. Verifique suas credenciais do GitHub"
        echo "2. Configure um token de acesso pessoal (PAT)"
        echo "3. Use: git push https://TOKEN@github.com/BrayanFerreiraDacruz/notesync-backend.git main"
    fi
else
    echo ""
    echo "❌ Push cancelado pelo usuário."
fi

echo ""
echo "=========================================="
