const axios = require('axios');

module.exports = {
    swapToken,
    refreshToken
}

// async function swapToken(req, res) {
//     const code = req.body.code;
//     try {
//         const params = new URLSearchParams({
//             grant_type: 'authorization_code',
//             code: code,
//             redirect_uri: process.env.REDIRECT_URI,
//         });

//         const response = await axios.post(
//             'https://accounts.spotify.com/api/token',
//             params,
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//                 auth: {
//                     username: process.env.CLIENT_ID,
//                     password: process.env.CLIENT_SECRET,
//                 },
//             }
//         );

//         res.json(response.data);
//     } catch (error) {
//         console.error('Swap error:', error.response?.data || error.message);
//         res.status(500).json({ error: 'Token swap unsuccessful' });
//     }
// };
async function swapToken(req, res) {
    const code = req.body.code;
    const code_verifier = req.body.code_verifier; // SDK sends this automatically

    try {
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
            client_id: process.env.CLIENT_ID,
            code_verifier: code_verifier  // replaces client_secret entirely
        });

        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            params,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            // No `auth` field — no client secret
        );

        res.json(response.data);
    } catch (error) {
        console.error('Swap error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Token swap unsuccessful' });
    }
}

async function refreshToken(req, res) {
    const refresh_token = req.body.refresh_token;

    try {
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
            client_id: process.env.CLIENT_ID
            // No client_secret
        });

        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            params,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            // No `auth` field
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error refreshing token:', error.response?.data || error.message);
        res.status(500).json({ error: 'Token refresh unsuccessful' });
    }
}

// async function refreshToken(req, res) {

//     const refresh_token = req.body.refresh_token;

//     try {
//         const params = new URLSearchParams({
//             grant_type: 'refresh_token',
//             refresh_token: refresh_token
//         })

//         const response = await axios.post (
//             'https://accounts.spotify.com/api/token',
//             params,
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 },
//                 auth: {
//                     username: process.env.CLIENT_ID,
//                     password: process.env.CLIENT_SECRET,
//                 }
//             }
//         )

//         res.json(response.data)
//     } catch (error) {
//         console.error('Error refreshing token: ', error)
//         res.status(500).json({ error: 'Token refresh unsuccessful'})
//     }
// }