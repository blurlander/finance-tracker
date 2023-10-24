const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://finance-tracker-app-kappa.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
        // Respond to preflight requests
        res.sendStatus(204);
    } else {
        // Pass control to the next middleware
        next();
    }
};

module.exports = corsMiddleware;