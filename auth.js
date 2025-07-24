
const jwt = require('jsonwebtoken');

module.exports= function (req, res, next){
    const authHeader = req.headers['authorization'];

    if(!authHeader) return res.status(401).json({message:'access denied'});
    try{
        const token = authHeader;
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user= verified;
        next();
    }
    catch(error){
        res.status(400).json({message:'invalid token'});
    }
};

    