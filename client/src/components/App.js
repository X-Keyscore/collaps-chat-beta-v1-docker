import React, { useState, useEffect } from 'react'
import Connection from './Connection/Connection'
import useLocalStorage from '../hooks/useLocalStorage';
import Dashboard from './Dashboard'
import api from '../api'
import { ChannelsProvider } from '../contexts/ChannelsProvider';
import { SocketProvider } from '../contexts/SocketProvider';
import { UserProvider } from '../contexts/UserProvider';

function App() {
  // Fonctions pour utiliser le stockage local pour l'id et le token
  const [id, setId] = useLocalStorage('id')
  const [token, setToken] = useLocalStorage('token')

  // Création d'un état local pour la validation de l'accès
  const [loginValidity, setLoginValidity] = useState(false)

  useEffect(() => {

    // je teste si l'id et le token sont présent
    if (id === undefined || token === undefined) {
      return
    } else {
      // Je fais un appel à l'api et vérifie le résultat
      api.autologinUser({ id, token }).then(res => {
        if (!res.data.status.success) return
        if (!res.data.status.idValide) return
        if (!res.data.status.tokenValide) return

        // Sauvegarde du token en locale
        setToken(res.data.user.token)
        // Valider l'accés
        setLoginValidity(true)
      })
    }
  }, [id]);

  // Je teste "loginValidity"
  if (loginValidity) {
    // J'affiche le "Dashboard"
    const storageLocal = { id, token, setId, setToken, setLoginValidity }
    return (
      <SocketProvider storageLocal={storageLocal}>
        <UserProvider storageLocal={storageLocal}>
          <ChannelsProvider storageLocal={storageLocal}>
            <Dashboard storageLocal={storageLocal} />
          </ChannelsProvider>
        </UserProvider>
      </SocketProvider>
    )
  } else {
    // J'affiche la page de connection
    return <Connection setId={setId} setToken={setToken} setLoginValidity={setLoginValidity} />
  }

}

export default App;