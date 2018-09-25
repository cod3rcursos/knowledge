const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()

        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    res.status(401).send()
                    return
                }

                const now = Math.floor(Date.now() / 1000)

                const payload = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    admin: user.admin,
                    iat: now,
                    exp: now + (60 * 60 * 24 * 3)
                }

                res.json({
                    ...payload,
                    token: jwt.encode(payload, authSecret),
                })
            })
        } else {
            res.status(400).send('Usuário não encontrado!')
        }
    }

    const validateToken = async (req, res) => {
        const userData = req.body || null
        
        if(userData) {
            const token = jwt.decode(userData.token, authSecret)
            if(new Date(token.exp * 1000) > new Date()) {
                return res.send(true)
            }
        }
        
        res.send(false)
    }

    return { signin, validateToken }
}