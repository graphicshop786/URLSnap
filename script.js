async function shortenURL() {
    const urlInput = document.getElementById('urlInput').value.trim();
    const customCode = document.getElementById('customCode').value.trim();
    const resultDiv = document.getElementById('result');

    if (!urlInput || !urlInput.startsWith('http')) {
        resultDiv.innerHTML = "Please enter a valid URL starting with http:// or https://";
        return;
    }

    const requestBody = { url: urlInput };
    if (customCode) requestBody.customCode = customCode;

    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (data.shortURL) {
            resultDiv.innerHTML = `Shortened URL: <a href="${data.shortURL}" target="_blank">${data.shortURL}</a>`;
        } else {
            resultDiv.innerHTML = `Error: ${data.error || "Something went wrong"}`;
        }
    } catch (error) {
        resultDiv.innerHTML = "Error connecting to server.";
        console.error('Error:', error);
    }
}
