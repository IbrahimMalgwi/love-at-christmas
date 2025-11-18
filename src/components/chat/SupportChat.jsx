import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import Button from '../common/Button'

const SupportChat = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm here to help with any questions about Love At Christmas. How can I assist you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!inputMessage.trim()) return

        // Add user message
        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage])
        setInputMessage('')

        // Simulate bot response
        setTimeout(() => {
            const botResponse = {
                id: Date.now() + 1,
                text: getBotResponse(inputMessage),
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, botResponse])
        }, 1000)
    }

    const getBotResponse = (message) => {
        const lowerMessage = message.toLowerCase()

        if (lowerMessage.includes('volunteer') || lowerMessage.includes('help')) {
            return "Great! You can register as a volunteer on our registration page. We have roles in publicity, logistics, registration, and more. Would you like me to direct you to the registration form?"
        } else if (lowerMessage.includes('donat') || lowerMessage.includes('give')) {
            return "Thank you for your generosity! You can make donations through our donation page. We accept financial donations as well as items like clothing, food, and household goods."
        } else if (lowerMessage.includes('event') || lowerMessage.includes('when')) {
            return "The main Love At Christmas event is typically held in mid-December. Specific dates and locations for 2025 will be announced soon. Please check our website regularly for updates!"
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
            return "You can reach us at info@loveatchristmas.org or call +1 (555) 123-4567. Our team is happy to help with any questions!"
        } else {
            return "I understand you're asking about Love At Christmas. For specific questions about volunteering, donations, or event details, I can provide more detailed information. What would you like to know more about?"
        }
    }

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-50"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 flex flex-col">
                    {/* Header */}
                    <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Bot className="h-5 w-5" />
                            <span className="font-semibold">Support Chat</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                        <div className="space-y-4">
                            {messages.map(message => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                            message.sender === 'user'
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-white text-gray-800 border border-gray-200'
                                        }`}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                        <p className={`text-xs mt-1 ${
                                            message.sender === 'user' ? 'text-primary-200' : 'text-gray-500'
                                        }`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                            <Button type="submit" size="sm">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}

export default SupportChat