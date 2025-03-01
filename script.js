function shortenURL() {
    const urlInput = document.getElementById('urlInput').value;
    const customCode = document.getElementById('customCode').value.trim();
    const resultDiv = document.getElementById('result');

    if (!urlInput || !urlInput.startsWith('http')) {
        resultDiv.innerHTML = "Please enter a valid URL starting with http:// or https://";
        return;
    }

    // Agar custom code diya gaya hai, toh usey bhejo, warna empty chhod do
    const requestBody = { url: urlInput };
    if (customCode) {
        requestBody.customCode = customCode;
    }

    fetch('/api/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (data.shortURL) {
            resultDiv.innerHTML = `Shortened URL: <a href="${data.shortURL}" target="_blank">${data.shortURL}</a>`;
        } else if (data.error) {
            resultDiv.innerHTML = `Error: ${data.error}`;
        } else {
            resultDiv.innerHTML = "Error shortening URL.";
        }
    })
    .catch(error => {
        resultDiv.innerHTML = "Error connecting to server.";
        console.error('Error:', error);
    });
}