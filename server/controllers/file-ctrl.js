const path = require('path');
const fs = require('fs')
const User = require('../models/user-model')
// Multer est un middleware nodejs utilisé pour enregistrer des fichiers.
const multer = require('multer');

const dir = path.join(__dirname + '/../public');

uploadFileAvatar = async (req, res) => {
    function accessAuth() {
        return new Promise((resolve) => {
            User.findOne({ id: req.params.id }, (err, user) => {
                if (err) {
                    console.log(err)
                    resolve({ status: { code: 400, success: false, msg: "Erreur requête" } })
                } else if (!user) {
                    resolve({ status: { code: 404, success: false, msg: "Utilisateur introuvable" } })
                } else if (user.token !== req.params.token) {
                    resolve({ status: { code: 401, success: false, msg: "Token invalide" } })
                } else {
                    resolve({ status: { code: 200, success: true, msg: "Autoriser" } })
                }
            }).catch(err => {
                console.log(err)
                resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
            })
        })
    }
    function deleteAvatar() {
        return new Promise((resolve) => {
            // Chemin du fichier 'avatars' et lecture du fichier
            const files = fs.readdirSync(dir + `/avatars/`)
            // Extensions disponibles
            const extensionTable = ['.jpg', '.jpeg', '.png', '.gif']
            // Je boucle toutes les extensions
            extensionTable.forEach((extension, index) => {
                // Je teste si j'ai trouvé une image
                if (files.find(element => element == `${req.params.id}${extension}`)) {
                    // Suppression du fichier
                    fs.unlink(`${dir}/avatars/${req.params.id}${extension}`, function (err) {
                        if (err) {
                            // Erreur de suppression
                            console.log(err)
                            resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
                        } else {
                            // Le fichier a été supprimé avec succès
                            resolve({ status: { code: 200, success: true, msg: "Image supprimer" } })
                        }
                    });
                }
                // Si je ne trouve pas d'image je "resolve"
                if ((extensionTable.length - 1) === index) resolve({ status: { code: 200, success: true, msg: "Aucune image trouvé" } })
            });
        })
    }
    function uploadAvatar() {
        return new Promise((resolve) => {

            // Paramètre d'enregistrement
            const storage = multer.diskStorage({
                // Emplacement du fichier
                destination: (req, file, cb) => {
                    cb(null, dir + `/avatars/`)
                },
                // Nom du fichier
                filename: (req, file, cb) => {
                    const fileName = `${req.params.id}.${file.originalname.substring(file.originalname.lastIndexOf(".") + 1, file.originalname.length)}`
                    cb(null, fileName)
                }
            });

            const upload = multer({ storage }).single('avatar');

            upload(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    // Une erreur Multer s'est produite lors du téléchargement
                    console.log(err)
                    resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
                } else if (err) {
                    // Une erreur inconnue s'est produite lors du téléchargement
                    console.log(err)
                    resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
                }
                // Le fichier a été "upload" avec succès
                resolve({ status: { code: 200, success: true, msg: "Image sauvgarder" } })
            })

        })
    }

    const resAccessAuth = await accessAuth()
    if (resAccessAuth.status.success === false) {
        return res
            .status(resAccessAuthr.status.code)
            .json({ status: { success: resAccessAuth.status.success, msg: resAccessAuth.status.msg } })

    }
    const resDeleteAvatar = await deleteAvatar()
    if (resDeleteAvatar.status.success === false) {
        return res
            .status(resDeleteAvatar.status.code)
            .json({ status: { success: resDeleteAvatar.status.success, msg: resDeleteAvatar.status.msg } })

    }
    const resUploadAvatar = await uploadAvatar()
    if (resUploadAvatar.status.success === false) {
        return res
            .status(resUploadAvatar.status.code)
            .json({ status: { success: resUploadAvatar.status.success, msg: resUploadAvatar.status.msg } })
    }

    return res
        .status(200)
        .json({ status: { success: true, msg: "Image sauvgarder" } })
}

uploadFileMsg = async (req, res) => {
    function accessAuth() {
        return new Promise((resolve) => {
            User.findOne({ id: req.params.id }, (err, user) => {
                if (err) {
                    console.log(err)
                    resolve({ status: { code: 400, success: false, msg: "Erreur requête" } })
                } else if (!user) {
                    resolve({ status: { code: 404, success: false, msg: "Utilisateur introuvable" } })
                } else if (user.token !== req.params.token) {
                    resolve({ status: { code: 401, success: false, msg: "Token invalide" } })
                } else {
                    resolve({ status: { code: 200, success: true, msg: "Autoriser" } })
                }
            }).catch(err => {
                console.log(err)
                resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
            })
        })
    }
    function uploadFile() {
        return new Promise((resolve) => {

            // Paramètre d'enregistrement
            const storage = multer.diskStorage({
                // Emplacement du fichier
                destination: (req, file, cb) => {
                    cb(null, dir + `/files/`)
                },
                // Nom du fichier
                filename: (req, file, cb) => {
                    const fileName = `${req.params.fileId}.${file.originalname.substring(file.originalname.lastIndexOf(".") + 1, file.originalname.length)}`
                    cb(null, fileName)
                }
            });

            const upload = multer({ storage }).single('files'); // faire le array multer

            upload(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    // Une erreur Multer s'est produite lors du téléchargement
                    console.log(err)
                    resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
                } else if (err) {
                    // Une erreur inconnue s'est produite lors du téléchargement
                    console.log(err)
                    resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
                }
                // Le fichier a été "upload" avec succès
                resolve({ status: { code: 200, success: true, msg: "Fichier sauvgarder" } })
            })

        })
    }

    const resAccessAuth = await accessAuth()
    if (resAccessAuth.status.success === false) {
        return res
            .status(resAccessAuthr.status.code)
            .json({ status: { success: resAccessAuth.status.success, msg: resAccessAuth.status.msg } })

    }
    const resUploadFile = await uploadFile()
    if (resUploadFile.status.success === false) {
        return res
            .status(resUploadFile.status.code)
            .json({ status: { success: resUploadFile.status.success, msg: resUploadFile.status.msg } })
    }

    return res
        .status(200)
        .json({ 
            status: { success: true, msg: "Fichier sauvgarder" }
        })
}

getFileById = async (req, res) => {
    function getFile() {
        return new Promise((resolve) => {
            var files;
            try {
                // Chemin du fichier et lecture du fichier
                files = fs.readdirSync(dir + `/${req.params.type}/`)
            } catch (err) {
                resolve({ status: { code: 400, success: false, msg: "Erreur requête" } })
            }
            // Récupération du fichier avec son ids
            const file = files.find(element => element.split('.')[0] == req.params.id)
            // Middleware express.static
            var options = {
                root: dir + `/${req.params.type}/`
            }
            // Je teste si j'ai trouvé un fichier
            if (file) {
                // Le fichier a été envoyer avec succès
                resolve({ status: { code: 500, success: true, msg: "Fichier envoyer" }, data: { file, options } })
            }
            // Si je ne trouve pas de fichier
            if (req.params.type === "avatars" && file === undefined) {
                resolve({ status: { code: 200, success: true, msg: "Aucun fichier" }, data: { file: 'default_avatar.png', options } })
            } else {
                resolve({ status: { code: 400, success: false, msg: "Aucun fichier" } })
            }
        })
    }

    const resGetFile = await getFile()
    if (resGetFile.status.success === false) {
        return res
            .status(resGetFile.status.code)
            .json({ status: { success: resGetFile.status.success, msg: resGetFile.status.msg } })

    }

    return res
        .status(resGetFile.status.code)
        .sendFile(resGetFile.data.file, resGetFile.data.options)
}

deleteFileById = async (req, res) => {
    function accessAuth() {
        return new Promise((resolve) => {
            User.findOne({ id: req.params.id }, (err, user) => {
                if (err) {
                    console.log(err)
                    resolve({ status: { code: 400, success: false, msg: "Erreur requête" } })
                } else if (!user) {
                    resolve({ status: { code: 404, success: false, msg: "Utilisateur introuvable" } })
                } else if (user.token !== req.params.token) {
                    resolve({ status: { code: 401, success: false, msg: "Token invalide" } })
                } else {
                    resolve({ status: { code: 200, success: true, msg: "Autoriser" } })
                }
            }).catch(err => {
                console.log(err)
                resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
            })
        })
    }
    function deleteFile() {
        return new Promise((resolve) => {
            // Chemin du fichier et lecture du fichier
            const files = fs.readdirSync(dir + `/${req.params.type}/`)
            // Extensions disponibles
            const extensionTable = ['.jpg', '.jpeg', '.png', '.gif']
            // Je boucle toutes les extensions
            extensionTable.forEach((extension, index) => {
                // Je teste si j'ai trouvé un fichier
                if (files.find(element => element == `${req.params.id}${extension}`)) {
                    // Suppression du fichier
                    fs.unlink(`${dir}/${req.params.type}/${req.params.id}${extension}`, function (err) {
                        if (err) {
                            // Erreur de suppression
                            console.log(err)
                            resolve({ status: { code: 500, success: false, msg: "Erreur serveur" } })
                        } else {
                            // Le fichier a été supprimé avec succès
                            resolve({ status: { code: 200, success: true, msg: "Fichier supprimer" } })
                        }
                    });
                }
                // Si je ne trouve pas de fichier
                if ((extensionTable.length - 1) === index) resolve({ status: { code: 200, success: true, msg: "Aucune fichier" } })
            });
        })
    }

    const resAccessAuth = await accessAuth()
    if (resAccessAuth.status.success === false) {
        return res
            .status(resAccessAuthr.status.code)
            .json({ status: { success: resAccessAuth.status.success, msg: resAccessAuth.status.msg } })
    }
    const resDeleteFile = await deleteFile()
    if (resDeleteFile.status.success === false) {
        return res
            .status(resDeleteFile.status.code)
            .json({ status: { success: resDeleteFile.status.success, msg: resDeleteFile.status.msg } })
    }

    return res
        .status(200)
        .json({ status: { success: true, msg: resDeleteFile.status.msg } })
}

module.exports = {
    uploadFileAvatar,
    uploadFileMsg,

    getFileById,

    deleteFileById
}
