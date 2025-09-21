import { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase, dbHelpers } from '../services/supabaseClient.js';

// Initial state
const initialState = {
  user: null,
  assessmentData: null,
  recommendations: null,
  skillAnalysis: null,
  chatHistory: [],
  currentStep: 'home',
  isLoading: false,
  error: null
};

// Action types
const ActionTypes = {
  SET_USER: 'SET_USER',
  SET_ASSESSMENT_DATA: 'SET_ASSESSMENT_DATA',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  SET_SKILL_ANALYSIS: 'SET_SKILL_ANALYSIS',
  ADD_CHAT_MESSAGE: 'ADD_CHAT_MESSAGE',
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_USER_DATA: 'RESET_USER_DATA'
};

// Reducer function
const userReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload
      };

    case ActionTypes.SET_ASSESSMENT_DATA:
      return {
        ...state,
        assessmentData: action.payload,
        currentStep: 'recommendations'
      };

    case ActionTypes.SET_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: action.payload,
        currentStep: 'skills'
      };

    case ActionTypes.SET_SKILL_ANALYSIS:
      return {
        ...state,
        skillAnalysis: action.payload
      };

    case ActionTypes.ADD_CHAT_MESSAGE:
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload]
      };

    case ActionTypes.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ActionTypes.RESET_USER_DATA:
      return {
        ...initialState,
        user: state.user
      };

    default:
      return state;
  }
};

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Check authentication and load user data
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          dispatch({ type: ActionTypes.SET_USER, payload: user });
          await loadUserData(user.id);
        } else {
          // Create anonymous user for demo purposes
          const anonymousUser = { id: uuidv4(), email: 'anonymous@demo.com', isAnonymous: true };
          dispatch({ type: ActionTypes.SET_USER, payload: anonymousUser });
          loadLocalData(); // Fallback to localStorage for anonymous users
        }
      } catch (error) {
        console.error('Error checking user:', error);
        // Fallback to localStorage
        loadLocalData();
      }
    };

    checkUser();
  }, []);

  // Load user data from Supabase
  const loadUserData = async (userId) => {
    try {
      // Load assessments
      const assessments = await dbHelpers.getUserAssessments(userId);
      if (assessments.length > 0) {
        const latestAssessment = assessments[0];
        dispatch({ type: ActionTypes.SET_ASSESSMENT_DATA, payload: latestAssessment.assessment_data });
      }

      // Load chat history
      const chatHistory = await dbHelpers.getChatHistory(userId);
      chatHistory.forEach(chat => {
        dispatch({ 
          type: ActionTypes.ADD_CHAT_MESSAGE, 
          payload: {
            id: chat.id,
            sender: 'user',
            text: chat.message,
            timestamp: chat.created_at
          }
        });
        dispatch({ 
          type: ActionTypes.ADD_CHAT_MESSAGE, 
          payload: {
            id: chat.id + '-response',
            sender: 'ai',
            text: chat.response,
            timestamp: chat.created_at
          }
        });
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to localStorage
      loadLocalData();
    }
  };

  // Fallback: Load data from localStorage
  const loadLocalData = () => {
    const savedData = localStorage.getItem('careerAI_userData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.assessmentData) {
          dispatch({ type: ActionTypes.SET_ASSESSMENT_DATA, payload: parsedData.assessmentData });
        }
        if (parsedData.recommendations) {
          dispatch({ type: ActionTypes.SET_RECOMMENDATIONS, payload: parsedData.recommendations });
        }
        if (parsedData.skillAnalysis) {
          dispatch({ type: ActionTypes.SET_SKILL_ANALYSIS, payload: parsedData.skillAnalysis });
        }
        if (parsedData.chatHistory) {
          parsedData.chatHistory.forEach(message => {
            dispatch({ type: ActionTypes.ADD_CHAT_MESSAGE, payload: message });
          });
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  };

  // Save data to Supabase (with localStorage fallback)
  const saveToDatabase = async (dataType, data) => {
    console.log('💾 saveToDatabase called:', { dataType, user: state.user });
    
    if (!state.user) {
      console.log('❌ No user found, cannot save');
      return;
    }

    try {
      if (state.user.isAnonymous) {
        console.log('👤 Anonymous user - saving to localStorage AND Supabase');
        // Save to localStorage for anonymous users
        const savedData = JSON.parse(localStorage.getItem('careerAI_userData') || '{}');
        savedData[dataType] = data;
        localStorage.setItem('careerAI_userData', JSON.stringify(savedData));
        
        // ALSO save to Supabase for anonymous users
        if (dataType === 'assessmentData') {
          console.log('🚀 Saving assessment to Supabase with user ID:', state.user.id);
          const result = await dbHelpers.saveAssessment(state.user.id, data);
          console.log('✅ Assessment save result:', result);
        } else if (dataType === 'recommendations') {
          console.log('🎯 Saving recommendations to Supabase with user ID:', state.user.id);
          const result = await dbHelpers.saveRecommendations(state.user.id, data);
          console.log('✅ Recommendations save result:', result);
        }
      } else {
        console.log('🔐 Authenticated user - saving to Supabase');
        // Save to Supabase for authenticated users
        if (dataType === 'assessmentData') {
          const result = await dbHelpers.saveAssessment(state.user.id, data);
          console.log('✅ Assessment save result:', result);
        } else if (dataType === 'recommendations') {
          const result = await dbHelpers.saveRecommendations(state.user.id, data);
          console.log('✅ Recommendations save result:', result);
        }
      }
    } catch (error) {
      console.error(`❌ Error saving ${dataType}:`, error);
      // Fallback to localStorage
      const savedData = JSON.parse(localStorage.getItem('careerAI_userData') || '{}');
      savedData[dataType] = data;
      localStorage.setItem('careerAI_userData', JSON.stringify(savedData));
    }
  };

  // Action creators
  const actions = {
    setUser: (user) => {
      dispatch({ type: ActionTypes.SET_USER, payload: user });
    },

    setAssessmentData: async (data) => {
      console.log('🔄 Saving assessment data:', data);
      console.log('👤 Current user:', state.user);
      dispatch({ type: ActionTypes.SET_ASSESSMENT_DATA, payload: data });
      await saveToDatabase('assessmentData', data);
    },

    setRecommendations: async (recommendations) => {
      dispatch({ type: ActionTypes.SET_RECOMMENDATIONS, payload: recommendations });
      await saveToDatabase('recommendations', recommendations);
    },

    setSkillAnalysis: async (analysis) => {
      dispatch({ type: ActionTypes.SET_SKILL_ANALYSIS, payload: analysis });
      await saveToDatabase('skillAnalysis', analysis);
    },

    addChatMessage: async (message) => {
      const messageWithId = {
        ...message,
        id: uuidv4(),
        timestamp: new Date().toISOString()
      };
      dispatch({ type: ActionTypes.ADD_CHAT_MESSAGE, payload: messageWithId });
      
      // Save chat message to database if it's a complete conversation
      if (message.sender === 'bot' && state.user) {
        try {
          // Find the corresponding user message
          const userMessage = state.chatHistory[state.chatHistory.length - 1];
          if (userMessage && userMessage.sender === 'user') {
            console.log('💬 Saving chat message to database');
            await dbHelpers.saveChatMessage(
              state.user.id, 
              userMessage.text, 
              message.text
            );
          }
        } catch (error) {
          console.error('❌ Error saving chat message:', error);
        }
      }
    },

    setCurrentStep: (step) => {
      dispatch({ type: ActionTypes.SET_CURRENT_STEP, payload: step });
    },

    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    },

    resetUserData: () => {
      dispatch({ type: ActionTypes.RESET_USER_DATA });
      localStorage.removeItem('careerAI_userData');
    },

    // New authentication methods
    signIn: async (email, password) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        dispatch({ type: ActionTypes.SET_USER, payload: data.user });
        await loadUserData(data.user.id);
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        
        return { success: true };
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    signUp: async (email, password) => {
      try {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        
        if (error) throw error;
        
        dispatch({ type: ActionTypes.SET_USER, payload: data.user });
        dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        
        return { success: true };
      } catch (error) {
        dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        return { success: false, error: error.message };
      }
    },

    signOut: async () => {
      try {
        await supabase.auth.signOut();
        dispatch({ type: ActionTypes.RESET_USER_DATA });
        // Create new anonymous user
        const anonymousUser = { id: uuidv4(), email: 'anonymous@demo.com', isAnonymous: true };
        dispatch({ type: ActionTypes.SET_USER, payload: anonymousUser });
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Selectors for common data access patterns
export const useAssessmentProgress = () => {
  const { assessmentData } = useUser();
  
  if (!assessmentData) return { progress: 0, isComplete: false };
  
  const requiredFields = ['name', 'age', 'education', 'careerInterests'];
  const completedFields = requiredFields.filter(field => assessmentData[field]);
  
  return {
    progress: (completedFields.length / requiredFields.length) * 100,
    isComplete: completedFields.length === requiredFields.length
  };
};

export const useRecommendationStats = () => {
  const { recommendations } = useUser();
  
  if (!recommendations || !Array.isArray(recommendations)) {
    return { totalRecommendations: 0, averageMatch: 0, topMatch: null };
  }
  
  const totalRecommendations = recommendations.length;
  const averageMatch = recommendations.reduce((sum, rec) => sum + rec.match, 0) / totalRecommendations;
  const topMatch = recommendations.reduce((top, rec) => rec.match > top.match ? rec : top, recommendations[0]);
  
  return {
    totalRecommendations,
    averageMatch: Math.round(averageMatch),
    topMatch
  };
};

export default UserContext;