// public/main.js

// URL base do backend
const API_URL = "https://backend-u287.onrender.com";

// Exemplo de requisição GET
async function getData() {
    try {
        const response = await fetch(`${API_URL}/api/rota`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Resposta da API:", data);

        // Exibir na página
        document.getElementById("resultado").innerText = JSON.stringify(data, null, 2);

    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

// Chama a função quando a página carrega
document.addEventListener("DOMContentLoaded", getData);
