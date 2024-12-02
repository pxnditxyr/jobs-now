import { SocketProvider } from './SocketContext'
import { ChatInterface } from './ChatInterface'

interface User {
  id: string
  name: string
  lastName: string
  avatar: string | null
}

interface IProps {
  userId: string
  workerId?: string
  currentUser: User
  isWorker: boolean
}

export const ChatInterfaceProvider = ( { currentUser, userId, workerId, isWorker = false } : IProps ) => {

  return (
    <SocketProvider currentUser={ currentUser }>
      <ChatInterface
        userId={ userId }
        workerId={ workerId }
        currentUser={ currentUser }
        isWorker={ isWorker }
      />
    </SocketProvider>
  )
}
