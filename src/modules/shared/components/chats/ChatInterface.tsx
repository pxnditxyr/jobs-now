import { actions } from 'astro:actions'
import { useState, useEffect, useRef } from 'react'
import { v4 as UUID } from 'uuid'
import { useSocket } from './SocketContext'

interface User {
  id: string
  name: string
  lastName: string
  avatar: string | null
}

interface Message {
  id: string
  senderId: string
  conversationId: string
  content: string
  createdAt: Date
  //status: 'delivered' | 'read'
  state: string
}

interface Conversation {
  id: string
  name: string | null
  isGroup: boolean
  participants: User[]
  lastMessage?: Message
}

interface IProps {
  userId: string
  workerId?: string
  currentUser: User
}

export const ChatInterface = ( { userId, currentUser }: IProps ) => {
  const current = localStorage.getItem( 'currentConversation' )
  const currentConversation = current ? JSON.parse( current ) : null
  const currentInputValue = localStorage.getItem( 'currentInputValue' ) ?? ''

  const { socket } = useSocket()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>( currentConversation )
  const [ enabledConversations, setEnabledConversations ] = useState<any[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState( currentInputValue )
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const setCurrentStatus = () => {
    localStorage.setItem( 'currentConversation', JSON.stringify( selectedConversation ) )
    localStorage.setItem( 'currentInputValue', newMessage )
  }

  useEffect( () => {
    const getEnabledConversations = async () => {
      const { data: enabledConversationsData, error: enabledConversationsError } = await actions.getEnabledConversationsByUserId({ userId: userId })
      if ( enabledConversationsError ) {
        return
      }
      const { enabledConversations } = enabledConversationsData
      console.log({ enabledConversations })
      setEnabledConversations( enabledConversations )
    }
    getEnabledConversations()
  }, [] )

  useEffect( () => {
    setCurrentStatus()
  }, [ selectedConversation, newMessage ] )

  useEffect(() => {
    if (socket) {
      socket.emit('getUserConversations')

      socket.on('userConversations', ( data: { conversations: Conversation[] } ) => {
        setConversations(data.conversations)
      })

      socket.on( 'errorMessage', ( error : any ) => {
        console.error(error.error)
      } )

      return () => {
        socket.off('userConversations')
        socket.off('errorMessage')
      }
    }
  }, [socket])

  useEffect(() => {
    if (selectedConversation && socket) {
      socket.emit( 'joinConversation', selectedConversation.id )
      socket.emit('getConversationMessages', { conversationId: selectedConversation.id })

      socket.on('conversationMessages', ( data : any ) => {
        setMessages(data.messages)
      })

      socket.on( 'receiveMessage', ( message: Message ) => {
        if ( message.conversationId === selectedConversation.id ) {
          setMessages((prevMessages) => [...prevMessages, message])
        }
      } )

      socket.on('errorMessage', ( error : any ) => {
        console.error(error.error)
      })

      return () => {
        socket.off('conversationMessages')
        socket.off('receiveMessage')
        socket.off('errorMessage')
      }

    }
  }, [selectedConversation, socket])

  useEffect(() => {
    if ( selectedConversation ) {
      //setMessages( mockMessages[ selectedConversation.id ] || [] )
      //console.log({ selectedConversation })
      const getMessages = async () => {
        const { data: messagesData, error: messagesError } = await actions.getConversationMessages({ conversationId: selectedConversation.id })
        if ( messagesError ) {
          console.log( messagesError )
          return
        }
        const { messages } = messagesData
        setMessages( messages )
      }
      getMessages()
    }
  }, [ selectedConversation ])


  useEffect( () => {

    const getConversations = async () => {
      const { data: conversationsData, error: conversationsError } = await actions.getUserConversations({ userId })
      if ( conversationsError ) {
        console.log( conversationsError )
        return
      }
      const { conversations } = conversationsData
      setConversations( conversations )
    }

    getConversations()

  }, [] )

  const messagesContainerRef = useRef<HTMLDivElement>( null )
  useEffect( () => {
    if ( messagesContainerRef.current ) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [ messages ] )
  //useLayoutEffect(() => {
  //  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  //}, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation && socket) {
      const messageId = UUID()
      const message = {
        id: messageId,
        conversationId: selectedConversation.id,
        content: newMessage.trim(),
        messageType: 'text',
        attachmentUrl: null,
      }

      socket.emit('sendMessage', message)

      //setMessages( ( prevMessages ) => [
      //  ...prevMessages,
      //  {
      //    ...message,
      //    senderId: currentUser.id,
      //    createdAt: new Date(),
      //    updatedAt: new Date(),
      //    status: true,
      //    state: 'sent',
      //  },
      //] )
      setNewMessage('')
    }
  }


  //const handleCreateConversation = () => {
  //  const newConv: Conversation = {
  //    id: `conv${Date.now()}`,
  //    name: 'New Conversation',
  //    isGroup: false,
  //    participants: [{ id: `user${Date.now()}`, name: 'New User', avatar: '/placeholder.svg?height=40&width=40' }]
  //  }
  //  setConversations([newConv, ...conversations])
  //  setSelectedConversation(newConv)
  //}

  const handleDeleteConversation = (convId: string) => {
    setConversations(conversations.filter(conv => conv.id !== convId))
    if (selectedConversation?.id === convId) {
      setSelectedConversation(null)
      setMessages([])
    }
  }

  const handleDeleteMessage = (msgId: string) => {
    setMessages(messages.filter(msg => msg.id !== msgId))
  }

  const handleEditMessage = (msgId: string, newContent: string) => {
    setMessages(messages.map(msg =>
      msg.id === msgId ? { ...msg, content: newContent, updatedAt: new Date() } : msg
    ))
  }

  const filteredConversations = conversations.filter( conv =>
    conv.participants.some( user => user.name.toLowerCase().includes( searchTerm.toLowerCase() ) || user.lastName.toLowerCase().includes( searchTerm.toLowerCase() ) )
   )

  const getAnotherUserName = ( participants : User[] ) : string => {
    const otherUser = participants.filter( user => user.id !== userId )[ 0 ]
    return `${ otherUser.name } ${ otherUser.lastName }`
  }

  const getAvatar = ( participants : User[] ) : string => {
    const otherUser = participants.filter( user => user.id !== userId )[ 0 ]
    return otherUser.avatar ?? '/avatar.svg'
  }

  const disabled = false

  const isEnabledConversation = (): boolean => {
    if (!enabledConversations.length) return false;

    const workerIds = enabledConversations.map(convo => convo.workerId);

    const participantIds = selectedConversation?.participants.map(participant => participant.id);

    return workerIds.some( workerId => participantIds?.includes(workerId) );
  }


  return (
    <div className="flex bg-gray-100">
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={ searchTerm }
              onChange={ ( e ) => setSearchTerm( e.target.value ) }
            />
            <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-200px)]">
          { filteredConversations.map( conv => (
            <div
              key={ conv.id }
              className={ `flex items-center p-4 border-b border-gray-200 cursor-pointer ${selectedConversation?.id === conv.id ? 'bg-blue-50' : ''}` }
              onClick={ () => setSelectedConversation( conv ) }
            >
              <img
                src={ getAvatar( conv.participants ) }
                alt={ conv.name ?? 'avatar' }
                className="w-10 h-10 rounded-full mr-3 bg-blue-300"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">
                  {
                    getAnotherUserName( conv.participants )
                  }
                </h3>
                <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content}</p>
              </div>
              <button onClick={() => handleDeleteConversation(conv.id)} className="text-red-500 hover:text-red-700">

              </button>
            </div>
          ) )
          }
          {
            ( filteredConversations.length === 0 ) && (
              <div className="flex-1 flex items-center justify-center bg-gray-100">
                <p className="text-xl text-gray-500"> No se encontraron conversaciones recientes 😢 </p>
              </div>
            )
          }
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-slate-800 w-full flex items-center">
              <img
                src={ getAvatar( selectedConversation.participants ) }
                alt={ selectedConversation.name ?? 'avatar' }
                className="w-14 h-14 rounded-full mr-3 bg-blue-300"
              />
              <p className="text-xl text-white font-semibold">
                { getAnotherUserName( selectedConversation.participants ) }
              </p>
            </div>
            {
              ( !isEnabledConversation() ) && (
                <div className="flex-1 flex items-center justify-center bg-gray-100 w-full p-8 rounded-lg text-center">
                  <p className="text-xl text-gray-500">
                  No tienes permiso para enviar mensajes con este trabajador 😢
                  para poder hacerlo debes esperar a que el trabajador acepte tu solicitud 📝
                  o volver a contratarlo 📝
                  </p>

                </div>
              )
            }
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-semibold">{selectedConversation.name}</h2>
            </div>
            <div
              ref={ messagesContainerRef }
              className="flex-1 overflow-y-auto p-4 bg-gray-100 max-h-[calc(100vh-200px)]">
              { messages.map( msg => (
                <div key={ msg.id } className={ `flex mb-4 ${ msg.senderId === currentUser.id ? 'justify-end' : 'justify-start' }` }>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === currentUser.id ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                    <p>{ msg.content }</p>
                    <div className="text-xs mt-1 text-gray-400">
                      { new Date( msg.createdAt ).toLocaleTimeString() }
                      { msg.senderId === currentUser.id && (
                        <span className="ml-2">
                          {
                            ( msg.state === 'delivered' ) && (
                              <span className="text-yellow-500 font-bold text-lg">✓</span>
                            )
                          }
                          {
                            ( msg.state === 'read' ) && (
                              <span className="text-green-500 font-bold text-lg">✓✓</span>
                            )
                          }
                        </span>
                      ) }
                    </div>
                    { msg.senderId === currentUser.id && (
                      <div className="flex mt-1">

                      </div>
                    ) }
                  </div>
                </div>
              ) ) }
              <div ref={ messagesEndRef } />
            </div>
            {
              ( disabled ) && (
                <div>
                  <p className="text-xl text-red-600"> Parece que por el momento no puedes conversar con el trabajador 😢 </p>
                  <span className="text-xs text-red-500"> El motivo puede ser que el trabajador no está aprobado, se haya completado o se haya cancelado la contratación </span>
                </div>
              )
            }
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder={ "Escribe tu mensaje..." }
                  className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={ newMessage }
                  onChange={ (e) => setNewMessage( e.target.value ) }
                  onKeyDown={ (e) => e.key === 'Enter' && handleSendMessage() }
                  disabled={ !isEnabledConversation() }
                />
                <button
                  className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600 disabled:bg-gray-300"
                  onClick={ handleSendMessage }
                  disabled={ !isEnabledConversation() }
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
              <p className="text-xl text-gray-500">Selecciona una conversación para comenzar a chatear</p>
            </div>
          )}
      </div>
    </div>
  )
}
