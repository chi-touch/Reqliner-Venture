const axios = require('axios');
const { parseReqline } = require('../parser/reqlineParser');

exports.handleReqline = async (req, res) => {
    const { reqline } = req.body;

    if (!reqline || typeof reqline !== 'string') {
        return res.status(400).json({ error: true, message: 'Missing or invalid reqline input' });
    }

    let parsed;
    try {
        parsed = parseReqline(reqline);
    } catch (err) {
        return res.status(400).json({ error: true, message: err.message });
    }

    const start = Date.now();
    try {
        const response = await axios({
            method: parsed.method,
            url: parsed.full_url,
            headers: parsed.headers,
            data: parsed.body
        });
        const stop = Date.now();

        return res.status(200).json({
            request: {
                query: parsed.query,
                body: parsed.body,
                headers: parsed.headers,
                full_url: parsed.full_url
            },
            response: {
                http_status: response.status,
                duration: stop - start,
                request_start_timestamp: start,
                request_stop_timestamp: stop,
                response_data: response.data
            }
        });
    } catch (err) {
        return res.status(400).json({ error: true, message: err.message });
    }
};
