import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { InlineSpinner } from './LoadingSpinner';
import aiService from '../services/aiService';

const ChatBot = () => {
  const { assessmentData, addChatMessage, chatHistory } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    "How do I write a good resume for tech jobs?",
    "What skills should I learn for data science?",
    "How to prepare for technical interviews?",
    "Best programming courses for beginners?",
    "How to switch careers to tech?",
    "What's the salary range for my field?",
    "How to build a strong portfolio?",
    "Tips for networking in tech industry?"
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  // Initialize with welcome message if no chat history
  useEffect(() => {
    if (chatHistory.length === 0) {
      const welcomeMessage = {
        text: assessmentData 
          ? `Hi ${assessmentData.name}! I'm your AI career advisor. I can help you with resume tips, course suggestions, interview preparation, and career guidance based on your profile. What would you like to know?`
          : "Hi! I'm your AI career advisor. I can help you with resume tips, course suggestions, interview preparation, and career guidance. What would you like to know?",
        sender: 'bot'
      };
      addChatMessage(welcomeMessage);
    }
  }, [assessmentData, chatHistory.length, addChatMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      sender: 'user'
    };

    addChatMessage(userMessage);
    setInputMessage('');
    setIsTyping(true);
    setShowQuickQuestions(false);

    try {
      const response = await aiService.chatWithAssistant(
        inputMessage, 
        chatHistory.slice(-10), // Last 10 messages for context
        assessmentData
      );

      const botMessage = {
        text: response,
        sender: 'bot'
      };

      addChatMessage(botMessage);
    } catch (error) {
      console.error('Error getting chat response:', error);
      const errorMessage = {
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        sender: 'bot'
      };
      addChatMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setShowQuickQuestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (text) => {
    // Simple formatting for better readability
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic text
      .replace(/•/g, '•') // Bullet points
      .split('\n').map((line, index) => (
        <div key={index} className={line.trim() === '' ? 'h-2' : ''}>
          <span dangerouslySetInnerHTML={{ __html: line }} />
        </div>
      ));
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all z-50 ${
          isOpen ? 'hidden' : 'block'
        } hover:scale-110`}
      >
        <MessageCircle className="h-6 w-6" />
        {chatHistory.length > 1 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            !
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bot className="h-6 w-6" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <span className="font-semibold">CareerAI Assistant</span>
                <div className="text-xs text-primary-200">Always here to help</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chatHistory.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm border">
                        <div className="flex items-center space-x-2">
                          <InlineSpinner size="small" />
                          <span className="text-sm text-gray-500">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {showQuickQuestions && chatHistory.length <= 2 && (
                <div className="p-4 border-t border-gray-200 bg-white">
                  <p className="text-sm text-gray-600 mb-3 font-medium">Quick questions to get started:</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {quickQuestions.slice(0, 4).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="w-full text-left text-sm text-primary-600 hover:text-primary-800 p-2 rounded hover:bg-primary-50 transition-colors border border-primary-200 hover:border-primary-300"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                <div className="flex space-x-2">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about careers..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
                    rows="1"
                    style={{ minHeight: '44px', maxHeight: '100px' }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                  {assessmentData && (
                    <span className="text-primary-600">✓ Profile loaded</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

// Chat Message Component
const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-2 max-w-[85%] ${
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      }`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-primary-600' : 'bg-gray-200'
        }`}>
          {isUser ? (
            <User className="h-4 w-4 text-white" />
          ) : (
            <Bot className="h-4 w-4 text-gray-600" />
          )}
        </div>
        <div className={`p-3 rounded-lg shadow-sm border ${
          isUser
            ? 'bg-primary-600 text-white border-primary-600'
            : 'bg-white text-gray-900 border-gray-200'
        }`}>
          <div className="text-sm leading-relaxed">
            {typeof message.text === 'string' ? (
              <div className="whitespace-pre-wrap">
                {message.text.split('\n').map((line, index) => (
                  <div key={index} className={line.trim() === '' ? 'h-2' : ''}>
                    {line.replace(/\*\*(.*?)\*\*/g, (match, p1) => p1).replace(/\*(.*?)\*/g, (match, p1) => p1)}
                  </div>
                ))}
              </div>
            ) : (
              message.text
            )}
          </div>
          {message.timestamp && (
            <div className={`text-xs mt-2 ${
              isUser ? 'text-primary-200' : 'text-gray-500'
            }`}>
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;