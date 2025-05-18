import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Users, Settings, LogOut, Moon, Sun, MessageSquare } from 'lucide-react';

// Types
interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
}

interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
  lastSeen?: Date;
  online: boolean;
}

function App() {
  // State
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with sample data
  useEffect(() => {
    const sampleContacts: Contact[] = [
      { id: '1', name: 'John Doe', lastMessage: 'Hey, how are you?', lastSeen: new Date(), online: true },
      { id: '2', name: 'Jane Smith', lastMessage: 'Can we meet tomorrow?', lastSeen: new Date(Date.now() - 3600000), online: false },
      { id: '3', name: 'Mike Johnson', lastMessage: 'Thanks for your help!', lastSeen: new Date(Date.now() - 7200000), online: true },
      { id: '4', name: 'Sarah Williams', lastMessage: "I'll send you the files soon", lastSeen: new Date(Date.now() - 86400000), online: false },
      { id: '5', name: 'David Brown', lastMessage: "Let's discuss the project", lastSeen: new Date(Date.now() - 172800000), online: true },
    ];
    
    setContacts(sampleContacts);
    setCurrentContact(sampleContacts[0]);
    
    const sampleMessages: Message[] = [
      { id: '1', text: 'Hey there!', sender: 'contact', timestamp: new Date(Date.now() - 3600000) },
      { id: '2', text: 'Hi! How are you?', sender: 'user', timestamp: new Date(Date.now() - 3500000) },
      { id: '3', text: "I'm doing great, thanks for asking!", sender: 'contact', timestamp: new Date(Date.now() - 3400000) },
      { id: '4', text: 'What about you?', sender: 'contact', timestamp: new Date(Date.now() - 3300000) },
      { id: '5', text: 'Pretty good! Just working on some projects.', sender: 'user', timestamp: new Date(Date.now() - 3200000) },
      { id: '6', text: 'That sounds interesting. What kind of projects?', sender: 'contact', timestamp: new Date(Date.now() - 3100000) },
      { id: '7', text: 'Mostly web development stuff. Building a chat app actually!', sender: 'user', timestamp: new Date(Date.now() - 3000000) },
      { id: '8', text: "That's cool! Like this one?", sender: 'contact', timestamp: new Date(Date.now() - 2900000) },
      { id: '9', text: 'Exactly! 😊', sender: 'user', timestamp: new Date(Date.now() - 2800000) },
    ];
    
    setMessages(sampleMessages);
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Generate contextual response based on user's message
  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hi there! How can I help you today?";
    }
    if (lowerMessage.includes('how are you')) {
      return "I'm doing well, thanks for asking! How about you?";
    }
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return "Goodbye! Have a great day!";
    }
    if (lowerMessage.includes('thank')) {
      return "You're welcome! Let me know if you need anything else.";
    }
    if (lowerMessage.includes('help')) {
      return "I'd be happy to help! What do you need assistance with?";
    }
    if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
      return "That sounds interesting! Could you tell me more about it?";
    }
    
    // Default responses for other cases
    const defaultResponses = [
      "That's interesting! Tell me more.",
      "I understand. Please continue.",
      "Thanks for sharing that with me.",
      "I see what you mean. What are your thoughts on this?",
      "That's a good point. How would you like to proceed?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Generate contextual response after 1 second
    setTimeout(() => {
      const responseMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(newMessage),
        sender: 'contact',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, responseMsg]);
    }, 1000);
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-indigo-600 dark:bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6" />
            <h1 className="text-xl font-bold">Chat Plus</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-indigo-500 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className="p-2 rounded-full hover:bg-indigo-500 dark:hover:bg-gray-700 transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-indigo-500 dark:hover:bg-gray-700 transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full p-2 pl-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider p-4">
              Recent Chats
            </h2>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {contacts.map(contact => (
                <li 
                  key={contact.id}
                  onClick={() => setCurrentContact(contact)}
                  className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    currentContact?.id === contact.id ? 'bg-indigo-50 dark:bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center px-4 py-3 relative">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-indigo-200 dark:bg-indigo-600 flex items-center justify-center text-indigo-700 dark:text-indigo-200">
                        <User className="h-6 w-6" />
                      </div>
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {contact.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {contact.lastSeen ? formatTime(contact.lastSeen) : ''}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {contact.lastMessage}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Maheswari Sugumanchi</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <section className="flex-1 flex flex-col">
          {currentContact ? (
            <>
              {/* Chat Header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-indigo-200 dark:bg-indigo-600 flex items-center justify-center text-indigo-700 dark:text-indigo-200">
                    <User className="h-5 w-5" />
                  </div>
                  {currentContact.online && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                  )}
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{currentContact.name}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentContact.online ? 'Online' : 'Last seen ' + (currentContact.lastSeen ? formatTime(currentContact.lastSeen) : 'recently')}
                  </p>
                </div>
                <div className="ml-auto flex space-x-2">
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none shadow'
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 py-2 px-4 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No conversation selected</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose a contact to start chatting</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;