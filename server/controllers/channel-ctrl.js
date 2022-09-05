const Channel = require('../models/channel-model')
const User = require('../models/user-model')

createChannel = async (req, res) => {
    const body = req.body
    if (!body) {
        return res
            .status(400)
            .json({ status: { success: false, msg: "Erreur requête" } })
    }
    function editClient() {
        return new Promise((resolve) => {
            User.findOne({ id: body.client.id }, (err, user) => {
                if (err) {
                    console.log(err)
                    resolve({ status: { code: 400, success: false, msg: "Erreur requête" } })
                } else if (!user) {
                    resolve({ status: { code: 404, success: false, msg: "Utilisateur introuvable" } })
                } else if (user.token !== body.client.token) {
                    resolve({ status: { code: 401, success: false, msg: "Token invalide" } })
                } else {
                    // J'ajoute l'id du channels et le type
                    user.channels.push({ id: body.channel.id, type: "private" })
                    // Je sauvgarde 
                    user
                        .save()
                        .then(() => {
                            resolve({ status: { code: 200, success: true, msg: "Modification sauvgarder" } })
                        })
                        .catch(err => {
                            console.log(err)
                            resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
                        })
                }
            }).catch(err => {
                console.log(err)
                resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
            })
        })
    }
    function editRecipient() {
        return new Promise((resolve) => {
            User.findOne({ id: body.recipient.id }, (err, recipient) => {
                if (err) {
                    console.log(err)
                    resolve({ status: { code: 400, success: false, msg: "Erreur requête" } })
                } else if (!recipient) {
                    resolve({ status: { code: 404, success: false, msg: "Utilisateur introuvable" } })
                } else {
                    // J'ajoute l'id du channels et le type
                    recipient.channels.push({ id: body.channel.id, type: "private" })
                    // Je sauvgarde 
                    recipient
                        .save()
                        .then(() => {
                            resolve({ status: { code: 200, success: true, msg: "Modification sauvgarder" }, data: recipient })
                        })
                        .catch(err => {
                            console.log(err)
                            resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
                        })
                }
            }).catch(err => {
                console.log(err)
                resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
            })
        })
    }
    function editChannels() {
        return new Promise((resolve) => {
            const channel = new Channel(body.channel)
            if (!channel) {
                resolve({ status: { code: 400, success: false, msg: "Erreur requête" } })
            }
            channel
                .save()
                .then(() => {
                    resolve({ status: { code: 201, success: true, msg: "Channel crée" } })
                })
                .catch(err => {
                    console.log(err)
                    resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
                })
        })
    }

    const resEditClient = await editClient()
    const resEditRecipient = await editRecipient()
    const resEditChannels = await editChannels()

    if (resEditClient.status.success === false) {
        return res
            .status(resEditClient.status.code)
            .json({ status: { success: resEditClient.status.success, msg: resEditClient.status.msg } })
    } else if (resEditRecipient.status.success === false) {
        return res
            .status(resEditRecipient.status.code)
            .json({ status: { success: resEditRecipient.status.success, msg: resEditRecipient.status.msg } })
    } else if (resEditChannels.status.success === false) {
        return res
            .status(resEditChannels.status.code)
            .json({ status: { success: resEditChannels.status.success, msg: resEditChannels.status.msg } })
    } else {
        return res
            .status(200)
            .json({ status: { success: true, msg: "Le canal a été crée" }, recipient: resEditRecipient.data })
    }
}

// Request { client, recipient, channel }
// Response { status: { success, idValide, tokenValide}, client }
updateChannel = async (req, res) => {
    const body = req.body

    if (!body) {
        return res
            .status(400)
            .json({ status: { success: false } })
    }

    Channel.findOne({ id: req.params.id }, (err, channel) => {
        if (err) {
            console.log(err)
            return res
                .status(400)
                .json({ status: { success: false } })
        }

        if (!channel) {
            return res
                .status(404)
                .json({ status: { success: false } })
        }

        channel.type = body.data.type ? body.data.type : channel.type;
        channel.recipients = body.data.recipients ? body.data.recipients : channel.recipients;
        channel.messages = body.data.messages ? body.data.messages : channel.messages;

        channel
            .save()
            .then(() => {
                return res
                    .status(200)
                    .json({
                        status: { success: true },
                        channel
                    })
            })
            .catch(err => {
                console.log(err)
                return res
                    .status(400)
                    .json({ status: { success: false } })
            })
    })
}

getChannelById = async (req, res) => {
    await Channel.findOne({ id: req.params.id }, (err, channel) => {
        if (err) {
            console.log(err)
            return res
                .status(400)
                .json({ status: { success: false } })
        }

        if (!channel) {
            return res.status(200)
                .json({
                    status:
                        { success: true },
                    channel: null
                })
        }

        return res.status(200).json({
            status: { success: true },
            channel
        })
    }).catch(err => {
        console.log(err)
        return res
            .status(400)
            .json({ status: { success: false } })
    })
}

deleteChannel = async (req, res) => {
    await Channel.findOneAndDelete({ id: req.params.id }, (err, channel) => {
        if (err) {
            return res
                .status(400)
                .json({ status: { success: false } })
        }

        if (!channel) {
            return res
                .status(404)
                .json({ status: { success: false } })
        }

        return res.status(200).json({
            status: { success: true },
        })
    }).catch(err => {
        console.log(err)
        return res
            .status(400)
            .json({ status: { success: false } })
    })
}

module.exports = {
    createChannel,

    updateChannel,

    getChannelById,

    deleteChannel
}
