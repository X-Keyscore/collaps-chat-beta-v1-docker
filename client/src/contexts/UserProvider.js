import React, { useContext, useState, useEffect } from 'react'
import api from "../api"

const UserContext = React.createContext()

export function useUser() {
  return useContext(UserContext)
}

export function UserProvider({ storageLocal, children }) {
  const [client, setClient] = useState(null)
  const id = storageLocal.id
  const token = storageLocal.token

  useEffect(() => {
    // Si le client n'est pas null pas besoin de mise a jour
    if (client === null) {
      // Je récupère les données du client grace à l'api
      api.getUserById(id).then(
        (response) => {
          var userEdit = response.data.user
          // Assignation de la valeur "avatar" à "userEdit"
          Object.assign(userEdit, {
            avatar_url: `${process.env.REACT_APP_API_URL}/api/file/get/avatars/`,
            api_url: process.env.REACT_APP_API_URL
          })
          return setClient(userEdit)
      })
    }
  }, [])

  function updateUser(id, payload) {
    Object.assign(payload, { token })
    api.updateUserById(id, payload)
  }

  const value = {
    client,
    setClient,
    updateUser
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext

// https://dmitripavlutin.com/react-usestate-hook-guide/