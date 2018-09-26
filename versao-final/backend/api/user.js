const bcrypt = require('bcrypt-nodejs')
const { existsOrError, notExistsOrError, equalsOrError } = require('./validation')

module.exports = app => {
    const encryptPassword = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }

    const save = async (req, res) => {
        const user = { ...req.body }
        if(req.params.id) user.id = req.params.id
        
        try {
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword, 
                'Senhas não conferem')
            
            if(!user.id) {
                const userFromDB = await app.db('users')
                    .where({ email: user.email }).first()
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch(msg) {
            return res.status(400).send(msg)
        }

        encryptPassword(req.body.password, hash => {
            user.password = hash
            delete user.confirmPassword

            if(user.id) {
                app.db('users')
                    .update(user)
                    .where({ id: user.id })
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(400).json(err))    
            } else {
                app.db('users')
                    .insert(user)
                    .then(_ => res.status(204).send())
                    .catch(err => res.status(400).json(err))
            }
        })
    }

    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(400).json(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('id, name, email')
            .where({ id: req.params.id })
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(400).json(err))
    }

    return { save, get, getById }
}