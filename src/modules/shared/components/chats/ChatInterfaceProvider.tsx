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
  disabled: boolean
}

export const ChatInterfaceProvider = ( { currentUser, userId, workerId, disabled } : IProps ) => {

  return (
    <SocketProvider currentUser={ currentUser }>
      <ChatInterface
        userId={ userId }
        workerId={ workerId }
        currentUser={ currentUser }
        disabled={ disabled }
      />
    </SocketProvider>
  )
}
