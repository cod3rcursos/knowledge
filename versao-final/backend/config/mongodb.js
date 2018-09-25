const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/knowledge3', { useNewUrlParser: true })
    .catch(e => {
        const msg = 'Não foi possível conectar com o MongoDB!'
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
    })