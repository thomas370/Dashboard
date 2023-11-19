const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).send('Token is not valid');
            }
            req.userId = decoded.id;
            next();
        });
    } else {
        res.status(401).send('Token is missing');
    }
}
module.exports = authMiddleware;