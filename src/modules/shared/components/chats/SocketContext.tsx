import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextProps {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextProps>({ socket: null })

export const useSocket = () => useContext(SocketContext)


interface User {
  id: string
  name: string
  lastName: string
  avatar: string | null
}

interface IProps {
  currentUser: User
  children: React.ReactNode
}

const PUBLIC_SOCKET_SERVER = import.meta.env.PUBLIC_SOCKET_SERVER

export const SocketProvider = ( { currentUser, children } : IProps ) => {
  const [ socket, setSocket ] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io( PUBLIC_SOCKET_SERVER, {
      auth: {
        token: currentUser.id,
      },
    } )
    setSocket( newSocket )
    console.log( 'socket', newSocket )

    return () => {
      newSocket.close()
    }
  }, [ currentUser.id ])

  return (
    <SocketContext.Provider value={{ socket }}>
      { children }
    </SocketContext.Provider>
  )
}
