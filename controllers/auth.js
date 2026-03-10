const axios = require('axios');

module.exports = {
    swapToken,
    refreshToken
}

async function swapToken(req, res) {
    const code = req.body.code;

    const authHeader = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')

    try {
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
        });

        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            params,
            {
                headers: {
                    'Authorization': `Basic ${authHeader}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Swap error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Token swap unsuccessful' });
    }
};


async function refreshToken(req, res) {
    const refresh_token = req.body.refresh_token;

    const authHeader = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')

    try {
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
        });

        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            params,
            { 
                headers: {
                    'Authorization': `Basic ${authHeader}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                } 
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error refreshing token:', error.response?.data || error.message);
        res.status(500).json({ error: 'Token refresh unsuccessful' });
    }
}
