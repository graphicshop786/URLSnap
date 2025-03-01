const { kv } = require('@vercel/kv');

function generateShortCode() {
    return Math.random().toString(36).substring(2, 8);
}

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { url, customCode } = req.body;

        if (!url || !url.startsWith('http')) {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        let shortCode;
        const links = (await kv.get('links')) || {};

        if (customCode) {
            if (!/^[a-zA-Z0-9]{3,15}$/.test(customCode)) {
                return res.status(400).json({ error: 'Custom code must be 3-15 alphanumeric characters' });
            }
            if (links[customCode]) {
                return res.status(400).json({ error: 'Custom code already taken' });
            }
            shortCode = customCode;
        } else {
            do {
                shortCode = generateShortCode();
            } while (links[shortCode]);
        }

        links[shortCode] = url;
        await kv.set('links', links);

        const shortURL = `${req.headers.host}/${shortCode}`;
        return res.status(200).json({ shortURL: `https://${shortURL}` });
    } 

    if (req.method === 'GET') {
        const shortCode = req.query.code;
        const links = (await kv.get('links')) || {};

        if (links[shortCode]) {
            return res.redirect(links[shortCode]);
        } else {
            return res.status(404).json({ error: 'Short URL not found' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
