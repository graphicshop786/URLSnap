function shortenURL() {
    const urlInput = document.getElementById('urlInput').value;
    const resultDiv = document.getElementById('result');

    if (!urlInput || !urlInput.startsWith('http')) {
        resultDiv.innerHTML = "Please enter a valid URL starting with http:// or https://";
        return;
    }

    fetch('/api/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: urlInput })
    })
    .then(response => response.json())
    .then(data => {
        if (data.shortURL) {
            resultDiv.innerHTML = `Shortened URL: <a href="${data.shortURL}" target="_blank">${data.shortURL}</a>`;
        } else {
            resultDiv.innerHTML = "Error shortening URL.";
        }
    })
    .catch(error => {
        resultDiv.innerHTML = "Error connecting to server.";
        console.error('Error:', error);
    });
}