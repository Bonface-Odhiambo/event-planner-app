import { createContext, useContext, useReducer, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const ChatContext = createContext();

const initialState = {
  socket: null,
  isConnected: false,
  currentChatId: null,
  messages: [],
  activeChats: [],
  isTyping: false,
  typingUsers: [],
  unreadCount: 0,
  isChatOpen: false
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SOCKET':
      return {
        ...state,
        socket: action.payload,
        isConnected: true
      };
    case 'DISCONNECT_SOCKET':
      return {
        ...state,
        socket: null,
        isConnected: false
      };
    case 'SET_CURRENT_CHAT':
      return {
        ...state,
        currentChatId: action.payload
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case 'SET_ACTIVE_CHATS':
      return {
        ...state,
        activeChats: action.payload
      };
    case 'SET_TYPING_USERS':
      return {
        ...state,
        typingUsers: action.payload
      };
    case 'SET_UNREAD_COUNT':
      return {
        ...state,
        unreadCount: action.payload
      };
    case 'TOGGLE_CHAT':
      return {
        ...state,
        isChatOpen: !state.isChatOpen
      };
    case 'OPEN_CHAT':
      return {
        ...state,
        isChatOpen: true
      };
    case 'CLOSE_CHAT':
      return {
        ...state,
        isChatOpen: false
      };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Initialize socket connection
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    socket.on('connect', () => {
      dispatch({ type: 'SET_SOCKET', payload: socket });
    });

    socket.on('disconnect', () => {
      dispatch({ type: 'DISCONNECT_SOCKET' });
    });

    socket.on('newMessage', (message) => {
      dispatch({ type: 'ADD_MESSAGE', payload: message });
      
      // Update unread count if chat is not open or not current chat
      if (!state.isChatOpen || state.currentChatId !== message.chatId) {
        dispatch({ type: 'SET_UNREAD_COUNT', payload: state.unreadCount + 1 });
      }
    });

    socket.on('userTyping', (data) => {
      if (data.isTyping) {
        dispatch({
          type: 'SET_TYPING_USERS',
          payload: [...state.typingUsers.filter(u => u.userId !== data.userId), data]
        });
      } else {
        dispatch({
          type: 'SET_TYPING_USERS',
          payload: state.typingUsers.filter(u => u.userId !== data.userId)
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const generateChatId = () => {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const joinChat = (chatId) => {
    if (state.socket) {
      state.socket.emit('joinChat', chatId);
      dispatch({ type: 'SET_CURRENT_CHAT', payload: chatId });
    }
  };

  const leaveChat = (chatId) => {
    if (state.socket) {
      state.socket.emit('leaveChat', chatId);
    }
  };

  const sendMessage = async (content, senderName, senderEmail) => {
    try {
      let chatId = state.currentChatId;
      
      // Generate new chat ID if this is the first message
      if (!chatId) {
        chatId = generateChatId();
        dispatch({ type: 'SET_CURRENT_CHAT', payload: chatId });
        joinChat(chatId);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/${chatId}/messages`,
        {
          content,
          senderName,
          senderEmail
        }
      );

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Send message error:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to send message' };
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/chat/${chatId}`);
      dispatch({ type: 'SET_MESSAGES', payload: response.data.messages });
      return { success: true };
    } catch (error) {
      console.error('Load messages error:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to load messages' };
    }
  };

  const startTyping = (userName, userId) => {
    if (state.socket && state.currentChatId) {
      state.socket.emit('typing', {
        chatId: state.currentChatId,
        userName,
        userId,
        isTyping: true
      });
    }
  };

  const stopTyping = (userName, userId) => {
    if (state.socket && state.currentChatId) {
      state.socket.emit('typing', {
        chatId: state.currentChatId,
        userName,
        userId,
        isTyping: false
      });
    }
  };

  const openChat = () => {
    dispatch({ type: 'OPEN_CHAT' });
    dispatch({ type: 'SET_UNREAD_COUNT', payload: 0 });
  };

  const closeChat = () => {
    dispatch({ type: 'CLOSE_CHAT' });
  };

  const toggleChat = () => {
    dispatch({ type: 'TOGGLE_CHAT' });
    if (!state.isChatOpen) {
      dispatch({ type: 'SET_UNREAD_COUNT', payload: 0 });
    }
  };

  const value = {
    ...state,
    joinChat,
    leaveChat,
    sendMessage,
    loadMessages,
    startTyping,
    stopTyping,
    openChat,
    closeChat,
    toggleChat
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
