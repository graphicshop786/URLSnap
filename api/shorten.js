const fs = require('fs').promises;
const path = require('path');

const linksFile = path.join(__dirname, '../links.json');

function generateShortCode() {
    return Math.random().toString(36).substring(2, 8);
}

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { url } = req.body;

        if (!url || !url.startsWith('http')) {
            res.status(400).json({ error: 'Invalid URL' });
            return;
        }

        let links = {};
        try {
            const data = await fs.readFile(linksFile, 'utf8');
            links = JSON.parse(data);
        } catch (error) {
            links = {};
        }

        const shortCode = generateShortCode();
        links[shortCode] = url;

        await fs.writeFile(linksFile, JSON.stringify(links, null, 2));

        const shortURL = `${req.headers.host}/${shortCode}`;
        res.status(200).json({ shortURL: `https://${shortURL}` });
    } else if (req.method === 'GET') {
        const shortCode = req.query.code;
        let links = {};
        try {
            const data = await fs.readFile(linksFile, 'utf8');
            links = JSON.parse(data);
        } catch (error) {
            res.status(404).send('Short URL not found');
            return;
        }

        const originalURL = links[shortCode];
        if (originalURL) {
            res.redirect(originalURL);
        } else {
            res.status(404).send('Short URL not found');
        }
    } else {
        res.status(405).send('Method not allowed');
    }
};