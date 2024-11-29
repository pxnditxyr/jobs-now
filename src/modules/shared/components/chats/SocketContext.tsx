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

export const SocketProvider = ( { currentUser, children } : IProps ) => {
  const [ socket, setSocket ] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io( 'http://localhost:4000', {
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
