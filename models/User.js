const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    apellido: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    correo: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    contraseña: {
        type: String,
        required: true,
        minlength: 6
    },
    rol:{
        type:String,
        required:true,
        default: 'Administrador'
    },
    fecha_nacimiento: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema);