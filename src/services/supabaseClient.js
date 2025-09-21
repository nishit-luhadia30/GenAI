import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions
export const dbHelpers = {
  // Save user assessment data
  async saveAssessment(userId, assessmentData) {
    console.log('🔄 dbHelpers.saveAssessment called with:', { userId, assessmentData });
    
    const insertData = {
      user_id: userId,
      assessment_data: assessmentData,
      created_at: new Date().toISOString()
    };
    
    console.log('📝 Inserting data:', insertData);
    
    const { data, error } = await supabase
      .from('assessments')
      .insert(insertData)
      .select()
    
    console.log('📊 Supabase response:', { data, error });
    
    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }
    
    console.log('✅ Successfully saved to Supabase:', data[0]);
    return data[0]
  },

  // Get user assessments
  async getUserAssessments(userId) {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Save chat history
  async saveChatMessage(userId, message, response, context = null) {
    console.log('💬 dbHelpers.saveChatMessage called with:', { userId, message, response });
    
    const insertData = {
      user_id: userId,
      message,
      response,
      context,
      created_at: new Date().toISOString()
    };
    
    console.log('📝 Inserting chat data:', insertData);
    
    const { data, error } = await supabase
      .from('chat_history')
      .insert(insertData)
      .select()
    
    console.log('📊 Chat response:', { data, error });
    
    if (error) {
      console.error('❌ Chat error:', error);
      throw error;
    }
    
    console.log('✅ Successfully saved chat to Supabase:', data[0]);
    return data[0]
  },

  // Get chat history
  async getChatHistory(userId, limit = 50) {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data.reverse() // Return in chronological order
  },

  // Save career recommendations
  async saveRecommendations(userId, recommendations, assessmentId = null) {
    console.log('🎯 dbHelpers.saveRecommendations called with:', { userId, recommendations, assessmentId });
    
    const insertData = {
      user_id: userId,
      assessment_id: assessmentId,
      recommendations: recommendations,
      created_at: new Date().toISOString()
    };
    
    console.log('📝 Inserting recommendations:', insertData);
    
    const { data, error } = await supabase
      .from('career_recommendations')
      .insert(insertData)
      .select()
    
    console.log('📊 Recommendations response:', { data, error });
    
    if (error) {
      console.error('❌ Recommendations error:', error);
      throw error;
    }
    
    console.log('✅ Successfully saved recommendations to Supabase:', data[0]);
    return data[0]
  }
}