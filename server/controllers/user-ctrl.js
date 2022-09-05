const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

// Connection d'un utilisateur avec son id est son token
autologinUser = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            status: { success: false }
        })
    }

    // Recherche du pseudo dans la BBD
    await User.findOne({ id: body.id }, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                status: { success: false }
            })
        } else if (user === null) {
            return res.status(200).json({// Id invalide
                status: {
                    success: true,
                    idValid: false,
                    tokenValid: false
                }
            })
        } else if (user.token !== body.token) {// Token invalide
            return res.status(200).json({
                status: {
                    success: true,
                    idValide: true,
                    tokenValid: false
                }
            })
        }

        const token = uuidv4()
        if (!token) return res.status(500).json({ status: { success: false } })
        user.token = token

        user
            .save()
            .then(savedUser => {
                return res.status(200).json({
                    status: {
                        success: true,
                        idValide: true,
                        tokenValide: true
                    },
                    user: savedUser
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(500).json({
                    status: { success: false }
                })
            })
    }).catch(err => console.log(err))
}
// Request { id, token }
// Response { status: { success, idValide, tokenValide}, user }

// Connection d'un utilisateur avec son pseudo est son mot de passe
loginUser = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            status: { success: false }
        })
    }

    // Recherche du pseudo dans la BBD
    await User.findOne({ pseudo: body.pseudo }, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                status: { success: false }
            })
        } else if (user === null) { // Pseudo invalide
            return res.status(200).json({
                status: {
                    success: true,
                    pseudoValid: false,
                    passwordValid: false
                }
            })
        } else if (!bcrypt.compareSync(body.password, user.password)) { // Password invalide
            return res.status(200).json({
                status: {
                    success: true,
                    pseudoValide: true,
                    passwordValid: false
                }
            })
        }

        const token = uuidv4()
        if (!token) return res.status(500).json({ status: { success: false } })
        user.token = token

        user
            .save()
            .then(savedUser => {
                return res.status(200).json({
                    status: {
                        success: true,
                        pseudoValide: true,
                        passwordValide: true
                    },
                    user: savedUser
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(500).json({
                    status: { success: false }
                })
            })
    }).catch(err => console.log(err))
}
// Request { pseudo, password }
// Response { status: { success, pseudoValide, passwordValide}, user }

// Enregistrement d'un utilisateur
registeringUser = (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            status: { success: false }
        })
    }

    const user = new User(body)

    if (!user) {
        return res.status(400).json({
            status: { success: false }
        })
    }

    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10))

    const token = uuidv4()
    if (!token) return res.status(500).json({ status: { success: false } })
    user.token = token

    user
        .save()
        .then(newUser => {
            return res.status(201).json({
                status: { success: true },
                user: newUser
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({
                status: { success: false }
            })
        })
}
// Request { id, token }
// Response { status: { success, idValide, tokenValide}, user }

updateUser = async (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            status: { success: false }
        })
    }

    await User.findOne({ id: req.params.id }, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                status: { success: false }
            })
        }

        if (!user) {
            return res.status(404).json({
                status: { success: false }
            })
        }

        user.pseudo = body.pseudo ? body.pseudo : user.pseudo;
        user.channels = body.channels ? body.channels : user.channels;

        user
            .save()
            .then(() => {
                return res.status(200).json({
                    status: { success: true },
                    user
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    status: { success: false }
                })
            })
    })
}
// Request { id, token }
// Response { status: { success }, user }

getUserById = async (req, res) => {
    await User.findOne({ id: req.params.id }, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                status: { success: false }
            })
        }

        if (user === null) {
            return res.status(200).json({
                status: { success: true },
                user: null
            })
        }

        return res.status(200).json({
            status: { success: true },
            user
        })
    }).catch(err => console.log(err))
}

getUserByPseudo = async (req, res) => {
    await User.findOne({ pseudo: req.params.pseudo }, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                status: { success: false }
            })
        }

        if (!user) {
            return res.status(200).json({
                status: { success: true },
                user: null
            })
        }

        return res.status(200).json({
            status: { success: true },
            user
        })
    }).catch(err => console.log(err))
}

deleteUser = async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                status: { success: false }
            })
        }

        if (!user) {
            return res.status(404).json({
                status: { success: false }
            })
        }

        return res.status(200).json({
            status: { success: true }
        })
    }).catch(err => console.log(err))
}


module.exports = {
    autologinUser,
    loginUser,

    registeringUser,

    updateUser,

    getUserById,
    getUserByPseudo,

    deleteUser
}
