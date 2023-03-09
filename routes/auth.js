const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
// constraseña
const bcrypt = require('bcrypt');
// validation
const Joi = require('@hapi/joi');

const schemaRegister = Joi.object({
    nombre: Joi.string().min(6).max(255).required(),
    apellido: Joi.string().min(6).max(255).required(),
    rol: Joi.string().min(6).max(255).required(),
    fecha_nacimiento: Joi.string().min(6).max(255).required(),
    correo: Joi.string().min(6).max(255).required().email(),
    contraseña: Joi.string().min(6).max(1024).required()
})

const schemaLogin = Joi.object({
    correo: Joi.string().min(6).max(255).required().email(),
    contraseña: Joi.string().min(6).max(1024).required()
})

const verifyToken = (req, res) => {
    console.log();
    const token = req.headers['authorization'].replace('Bearer ','')

    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
    } catch (error) {
        res.status(400).json({error: 'token no es válido'})
    }
}
router.post('/login', async (req, res) => {
    // validaciones
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message })
    
    const user = await User.findOne({ correo: req.body.correo });
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(req.body.contraseña, user.contraseña);
    if (!validPassword) return res.status(400).json({ error: 'contraseña no válida' })  
    // create token
    const token = jwt.sign({
        name: user.nombre,
        id: user._id,
        rol: user.rol,
        correo: user.correo
    }, process.env.TOKEN_SECRET)
    
    res.header('auth-token', token).json({
        error: null,
        data: {token}
    }).end()
})
router.post('/register', async (req, res) => {
    // validate user
    const { error } = schemaRegister.validate(req.body)
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    const isEmailExist = await User.findOne({ correo: req.body.correo });
    if (isEmailExist) {
        return res.status(400).json({error: 'Email ya registrado'})
    }
    // hash contraseña
    const salt = await bcrypt.genSalt(10);
    console.log(req.body.correo, salt);
    const password = await bcrypt.hash(req.body.contraseña, salt);
    const user = new User({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        fecha_nacimiento: req.body.fecha_nacimiento,
        rol: req.body.rol,
        correo: req.body.correo,
        contraseña: password
    });
    try {
        const savedUser = await user.save();
        res.status(200).send({
            error: null,
            data: savedUser
        }).end()

    } catch (error) {
        res.status(400).json({error}).end()
    }
})

router.get('/users',async (req,res)=>{
   await verifyToken(req,res)
   const users = await User.find({});
   res.status(200).json({error:null,data:users}).end()
})
router.get('/users/:id',async (req,res)=>{
    await verifyToken(req,res)
    const id = req.params.id
    const users = await User.findById(id);
    res.status(200).json({error:null,data:users}).end()
 })
router.delete('/users',async (req,res)=>{
    await verifyToken(req,res)
    const correo = req.body.correo
    if(await User.findOne({correo:correo})){
    const user = await User.findOneAndDelete({correo:correo});
    res.status(200).json({error:null,data:user}).end()
    }else{
        res.status(400).json({error:"El usuario no existe",data:null}).end()
    }

})

module.exports = router;