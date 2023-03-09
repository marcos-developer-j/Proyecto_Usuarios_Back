const router = require('express').Router();
const Session = require('../models/Session');
const jwt = require('jsonwebtoken');
// validation
const Joi = require('@hapi/joi');

const schemaSession = Joi.object({
    token: Joi.string().required()
})

const verifyToken = (req, res) => {
    console.log();
    const token = req.headers['authorization'].replace('Bearer ', '')
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
    } catch (error) {
        res.status(400).json({ error: 'token no es válido' })
    }
}

router.get('/sessions', async (req, res) => {
/*     await verifyToken(req, res) */
    const session = await Session.find({});
    if(session){res.status(200).json({ error: null, data: session }).end()}
    else {res.status(400).json({ error: "Ninguna sesion activa", data: null }).end()}
    
})
router.post('/session', async (req, res) => {
    await verifyToken(req, res)
    const session = new Session({
        token:req.body.token
    })
    const data = await session.save();
    res.status(200).json({ error: null, data: data }).end()
})
router.delete('/session', async (req, res) => {
    await verifyToken(req, res)
    const sessions = await Session.deleteMany({});
    res.status(200).json({ error: null, data: sessions }).end()
})

module.exports = router;
