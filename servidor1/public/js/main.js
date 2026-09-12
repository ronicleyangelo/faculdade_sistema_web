import { checkBackend } from './services/api.js';

const statusDot = document.querySelector('#status-dot');
const statusTitle = document.querySelector('#status-title');
const statusMessage = document.querySelector('#status-message');
const checkButton = document.querySelector('#check-button');

function updateStatus(connected, message) {
    statusDot.classList.toggle('connected', connected);
    statusTitle.textContent = connected ? 'Backend online' : 'Backend indisponível';
    statusMessage.textContent = message;
}

async function loadStatus() {
    checkButton.disabled = true;
    statusTitle.textContent = 'Verificando conexão...';
    statusMessage.textContent = 'Aguardando resposta da API.';

    try {
        const data = await checkBackend();
        updateStatus(
            true,
            `${data.message} às ${new Date(data.timestamp).toLocaleTimeString('pt-BR')}.`
        );
    } catch {
        updateStatus(
            false,
            'Não foi possível acessar o backend. Confirme se o servidor está rodando.'
        );
    } finally {
        checkButton.disabled = false;
    }
}

checkButton.addEventListener('click', loadStatus);
loadStatus();
