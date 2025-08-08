function parseReqline(reqline) {
    const requiredOrder = ['HTTP', 'URL'];
    const validKeywords = ['HTTP', 'URL', 'HEADERS', 'QUERY', 'BODY'];

    const parts = reqline.split(' | ');
    if (parts.length < 2) throw new Error('Invalid spacing around pipe delimiter');

    const parsed = {
        method: null,
        url: null,
        headers: {},
        query: {},
        body: {}
    };

    let keywordOrder = [];

    for (const part of parts) {
        const spaceIndex = part.indexOf(' ');
        if (spaceIndex === -1) throw new Error('Missing space after keyword');

        const keyword = part.substring(0, spaceIndex);
        const value = part.substring(spaceIndex + 1).trim();

        if (!validKeywords.includes(keyword)) throw new Error('Keywords must be uppercase');
        keywordOrder.push(keyword);

        switch (keyword) {
            case 'HTTP':
                if (parsed.method) throw new Error('Duplicate HTTP keyword');
                if (value !== 'GET' && value !== 'POST') throw new Error('Invalid HTTP method. Only GET and POST are supported');
                parsed.method = value;
                break;

            case 'URL':
                if (parsed.url) throw new Error('Duplicate URL keyword');
                parsed.url = value;
                break;

            case 'HEADERS':
                try {
                    parsed.headers = JSON.parse(value);
                } catch {
                    throw new Error('Invalid JSON format in HEADERS section');
                }
                break;

            case 'QUERY':
                try {
                    parsed.query = JSON.parse(value);
                } catch {
                    throw new Error('Invalid JSON format in QUERY section');
                }
                break;

            case 'BODY':
                try {
                    parsed.body = JSON.parse(value);
                } catch {
                    throw new Error('Invalid JSON format in BODY section');
                }
                break;
        }
    }

    if (!parsed.method) throw new Error('Missing required HTTP keyword');
    if (!parsed.url) throw new Error('Missing required URL keyword');
    if (keywordOrder[0] !== 'HTTP' || keywordOrder[1] !== 'URL') {
        throw new Error('HTTP and URL must appear first and in order');
    }

    const queryString = new URLSearchParams(parsed.query).toString();
    parsed.full_url = queryString ? `${parsed.url}?${queryString}` : parsed.url;

    return parsed;
}

module.exports = { parseReqline };
