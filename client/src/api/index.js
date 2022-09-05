import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api', //https://collaps.xyz/collapsapi/api //http://localhost:3000/api
})

// User
export const autologinUser = (payload) => api.post(`/user/autologin`, payload)
export const loginUser = (payload) => api.post(`/user/login`, payload)
export const registeringUser = (payload) => api.post(`/user/registering`, payload)

export const getUserById = (id) => api.get(`/user/id/${id}`)
export const getUserByPseudo = (pseudo) => api.get(`/user/pseudo/${pseudo}`)

export const updateUserById = (id, payload) => api.put(`/user/${id}`, payload)

export const deleteUserById = (id) => api.delete(`/user/${id}`)

//Channel
export const insertChannel = (payload) => api.post(`/channel`, payload)

export const getChannelById = (id) => api.get(`/channel/id/${id}`)

export const updateChannelById = (id, payload) => api.put(`/channel/${id}`, payload)

export const deleteChannelById = (id) => api.delete(`/channel/${id}`)

// File
export const uploadFileAvatar = (id, token, file) => api.post(`/file/upload/avatar/${id}/${token}`, file)

export const uploadFileMsg = (id, token, fileId, file) => api.post(`/file/upload/msg/${id}/${token}/${fileId}`, file)

export const getFileById = (type, id) => api.get(`/file/get/${type}/${id}`)

export const deleteFileById = (type, id) => api.delete(`/file/delete/${type}/${id}`)

const apis = {
    autologinUser,
    loginUser,
    registeringUser,
    getUserById,
    getUserByPseudo,
    updateUserById,
    deleteUserById,

    insertChannel,
    getChannelById,
    updateChannelById,
    deleteChannelById,

    uploadFileAvatar,
    uploadFileMsg,
    getFileById,
    deleteFileById
}

export default apis
