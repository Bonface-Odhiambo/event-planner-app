import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Bot, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { findFAQAnswer, getWelcomeMessage, getLiveChatMessage, getNoMatchMessage } from '../../data/faqData';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [showNameForm, setShowNameForm] = useState(true);
  const [isLiveChatMode, setIsLiveChatMode] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { 
    isChatOpen, 
    messages, 
    unreadCount, 
    typingUsers,
    toggleChat, 
    closeChat, 
    sendMessage, 
    loadMessages,
    startTyping,
    stopTyping,
    currentChatId
  } = useChat();

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      setSenderName(user.name);
      setSenderEmail(user.email);
      setShowNameForm(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (isChatOpen && !chatStarted) {
      // Add welcome message when chat opens
      const welcomeMsg = getWelcomeMessage();
      // Add to local state instead of sending to server
      setChatStarted(true);
    }
  }, [isChatOpen, chatStarted]);

  useEffect(() => {
    if (currentChatId && isChatOpen) {
      loadMessages(currentChatId);
    }
  }, [currentChatId, isChatOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    if (!isAuthenticated && (!senderName.trim() || !senderEmail.trim())) {
      setShowNameForm(true);
      return;
    }

    const userMessage = message.trim();
    
    // Check if user wants live chat
    if (userMessage.toLowerCase().includes('live chat') || userMessage.toLowerCase().includes('speak to someone')) {
      setIsLiveChatMode(true);
      const liveChatMsg = getLiveChatMessage();
      // Add bot response locally first
      setTimeout(() => {
        // This would be handled by the chat context in a real implementation
      }, 500);
    } else if (!isLiveChatMode) {
      // Handle FAQ responses
      const faqAnswer = findFAQAnswer(userMessage);
      if (faqAnswer) {
        // Send user message first
        await sendMessage(userMessage, senderName, senderEmail);
        // Then send bot response
        setTimeout(async () => {
          await sendMessage(faqAnswer.answer, 'FAQ Bot', 'bot@elegantevents.com', 'bot');
        }, 1000);
      } else {
        // Send user message and no-match response
        await sendMessage(userMessage, senderName, senderEmail);
        setTimeout(async () => {
          const noMatchMsg = getNoMatchMessage();
          await sendMessage(noMatchMsg.content, 'FAQ Bot', 'bot@elegantevents.com', 'bot');
        }, 1000);
      }
    } else {
      // Live chat mode - send to real admin
      await sendMessage(userMessage, senderName, senderEmail);
    }
    
    setMessage('');
    stopTyping(senderName, user?.id || 'anonymous');
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    if (e.target.value.trim()) {
      startTyping(senderName, user?.id || 'anonymous');
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(senderName, user?.id || 'anonymous');
      }, 1000);
    } else {
      stopTyping(senderName, user?.id || 'anonymous');
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (senderName.trim() && senderEmail.trim()) {
      setShowNameForm(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 z-50"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Chat with us</h3>
            <div className="flex space-x-2">
              <button
                onClick={closeChat}
                className="text-primary-200 hover:text-white transition-colors"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={closeChat}
                className="text-primary-200 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Name Form */}
          {showNameForm && !isAuthenticated && (
            <div className="p-4 border-b border-gray-200">
              <form onSubmit={handleNameSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="input text-sm"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="input text-sm"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full text-sm">
                  Start Chat
                </button>
              </form>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Welcome Message */}
            {!showNameForm && messages.length === 0 && (
              <div className="flex justify-start">
                <div className="max-w-xs px-3 py-2 rounded-lg text-sm bg-blue-50 text-gray-800 border border-blue-200">
                  <div className="flex items-center mb-1">
                    <Bot className="h-4 w-4 mr-1 text-blue-600" />
                    <div className="text-xs font-medium text-blue-600">FAQ Assistant</div>
                  </div>
                  <div className="whitespace-pre-line">{getWelcomeMessage().content}</div>
                </div>
              </div>
            )}
            
            {messages.length === 0 && showNameForm ? (
              <div className="text-center text-gray-500 text-sm">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Welcome to Elegant Events!</p>
                <p className="text-xs mt-1">Please provide your details to start chatting.</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      msg.senderType === 'user'
                        ? 'bg-primary-600 text-white'
                        : msg.senderName === 'FAQ Bot'
                        ? 'bg-blue-50 text-gray-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.senderType !== 'user' && (
                      <div className="flex items-center mb-1">
                        {msg.senderName === 'FAQ Bot' ? (
                          <Bot className="h-4 w-4 mr-1 text-blue-600" />
                        ) : (
                          <User className="h-4 w-4 mr-1 text-gray-600" />
                        )}
                        <div className={`text-xs font-medium ${
                          msg.senderName === 'FAQ Bot' ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {msg.senderName}
                        </div>
                      </div>
                    )}
                    <div className="whitespace-pre-line">{msg.content}</div>
                    <div className={`text-xs mt-1 ${
                      msg.senderType === 'user' ? 'text-primary-200' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Live Chat Mode Indicator */}
            {isLiveChatMode && (
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Connected to live support
                </div>
              </div>
            )}
            
            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-center space-x-1">
                    <span>Someone is typing</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {!showNameForm && (
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  placeholder={isLiveChatMode ? "Connected to live support..." : "Ask about events, pricing, or type 'live chat'..."}
                  className="flex-1 input text-sm"
                  disabled={showNameForm}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || showNameForm}
                  className="btn-primary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Chat;
