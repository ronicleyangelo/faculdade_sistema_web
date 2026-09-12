export async function checkBackend() {
    const response = await fetch('/api/health');

    if (!response.ok) {
        throw new Error(`Erro HTTP ${response.status}`);
    }

    return response.json();
}
