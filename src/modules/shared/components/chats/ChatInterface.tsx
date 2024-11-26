import { useState, useEffect, useRef, useLayoutEffect } from 'react'

interface User {
  id: string
  name: string
  avatar: string
}

interface Message {
  id: string
  senderId: string
  content: string
  createdAt: Date
  status: 'sent' | 'delivered' | 'read'
}

interface Conversation {
  id: string
  name: string
  isGroup: boolean
  participants: User[]
  lastMessage?: Message
}

const currentUser: User = {
  id: 'current-user-id',
  name: 'Current User',
  avatar: '/placeholder.svg?height=40&width=40'
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'John Doe',
    isGroup: false,
    participants: [{ id: '2', name: 'John Doe', avatar: '/placeholder.svg?height=40&width=40' }],
    lastMessage: { id: 'msg1', senderId: '2', content: 'Hey, how are you?', createdAt: new Date(), status: 'read' }
  },
  {
    id: '2',
    name: 'Project Team',
    isGroup: true,
    participants: [
      { id: '3', name: 'Alice', avatar: '/placeholder.svg?height=40&width=40' },
      { id: '4', name: 'Bob', avatar: '/placeholder.svg?height=40&width=40' },
      { id: '5', name: 'Charlie', avatar: '/placeholder.svg?height=40&width=40' }
    ],
    lastMessage: { id: 'msg2', senderId: '3', content: 'Meeting at 3 PM', createdAt: new Date(), status: 'delivered' }
  }
]

const mockMessages: { [key: string]: Message[] } = {
  '1': [
    { id: 'msg1', senderId: '2', content: 'Hey, how are you?', createdAt: new Date(Date.now() - 3600000), status: 'read' },
    { id: 'msg2', senderId: 'current-user-id', content: 'I`m good, thanks! How about you?', createdAt: new Date(Date.now() - 3500000), status: 'read' },
    { id: 'msg3', senderId: '2', content: 'Doing well, thanks for asking!', createdAt: new Date(Date.now() - 3400000), status: 'read' }
  ],
  '2': [
    { id: 'msg4', senderId: '3', content: 'Hello everyone!', createdAt: new Date(Date.now() - 7200000), status: 'read' },
    { id: 'msg5', senderId: '4', content: 'Hi Alice!', createdAt: new Date(Date.now() - 7100000), status: 'read' },
    { id: 'msg6', senderId: '5', content: 'Meeting at 3 PM, don`t forget!', createdAt: new Date(Date.now() - 3600000), status: 'delivered' }
  ]
}

export const ChatInterface = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation.id] || [])
    }
  }, [selectedConversation])

  //useLayoutEffect(() => {
  //  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  //}, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const newMsg: Message = {
        id: `msg${Date.now()}`,
        senderId: currentUser.id,
        content: newMessage.trim(),
        createdAt: new Date(),
        status: 'sent'
      }
      setMessages([...messages, newMsg])
      setNewMessage('')

      // Update last message in conversation list
      setConversations(conversations.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: newMsg }
          : conv
      ))
    }
  }

  const handleCreateConversation = () => {
    const newConv: Conversation = {
      id: `conv${Date.now()}`,
      name: 'New Conversation',
      isGroup: false,
      participants: [{ id: `user${Date.now()}`, name: 'New User', avatar: '/placeholder.svg?height=40&width=40' }]
    }
    setConversations([newConv, ...conversations])
    setSelectedConversation(newConv)
  }

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

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversation List */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {filteredConversations.map(conv => (
            <div
              key={conv.id}
              className={`flex items-center p-4 border-b border-gray-200 cursor-pointer ${selectedConversation?.id === conv.id ? 'bg-blue-50' : ''}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <img src={conv.isGroup ? '/placeholder.svg?height=40&width=40' : conv.participants[0].avatar} alt={conv.name} className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1">
                <h3 className="font-semibold">{conv.name}</h3>
                <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.content}</p>
              </div>
              <button onClick={() => handleDeleteConversation(conv.id)} className="text-red-500 hover:text-red-700">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button
          className="absolute bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600"
          onClick={handleCreateConversation}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-semibold">{selectedConversation.name}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
              {messages.map(msg => (
                <div key={msg.id} className={`flex mb-4 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.senderId === currentUser.id ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                    <p>{msg.content}</p>
                    <div className="text-xs mt-1 text-gray-400">
                      {msg.createdAt.toLocaleTimeString()}
                      {msg.senderId === currentUser.id && (
                        <span className="ml-2">
                          {msg.status === 'sent' && '✓'}
                          {msg.status === 'delivered' && '✓✓'}
                          {msg.status === 'read' && '✓✓'}
                        </span>
                      )}
                    </div>
                    {msg.senderId === currentUser.id && (
                      <div className="flex mt-1">
                        <button onClick={() => handleEditMessage(msg.id, prompt('Edit message:', msg.content) || msg.content)} className="text-xs text-gray-300 hover:text-gray-100 mr-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDeleteMessage(msg.id)} className="text-xs text-gray-300 hover:text-gray-100">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  className="bg-blue-500 text-white rounded-r-lg px-4 py-2 hover:bg-blue-600"
                  onClick={handleSendMessage}
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
