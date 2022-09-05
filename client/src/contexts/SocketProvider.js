import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ storageLocal, children }) {
  const [socket, setSocket] = useState()
  const id = storageLocal.id

  useEffect(() => {

    /*
    const newSocket = io(
      'https://collaps.xyz',
      { path:'/collapssocket', query: { id } }
    )
    */

    const newSocket = io(
      'http://localhost:3000',
      { query: { id } }
    )
    setSocket(newSocket)

    return () => newSocket.close()
  }, [id])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContext
