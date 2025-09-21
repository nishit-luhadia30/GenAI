// AI Service with Google Gemini integration
// This service handles all AI-related operations including career recommendations,
// skill gap analysis, and chat functionality

import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from './supabaseClient.js';

class AIService {
  constructor() {
    this.supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.isProduction = import.meta.env.PROD;

    console.log('🔧 AIService initialized');
    console.log('🔑 Gemini API Key:', this.geminiApiKey ? `${this.geminiApiKey.substring(0, 10)}...` : 'Not found');

    // Initialize Gemini AI
    if (this.geminiApiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log('✅ Gemini model initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing Gemini:', error);
        this.model = null;
      }
    } else {
      console.warn('⚠️ No Gemini API key found in environment variables');
    }
  }

  // Test API key validity
  async testGeminiConnection() {
    try {
      console.log('🧪 Testing Gemini API connection...');
      console.log('🔑 API Key:', this.geminiApiKey ? `${this.geminiApiKey.substring(0, 10)}...` : 'Missing');

      if (!this.geminiApiKey) {
        throw new Error('No Gemini API key found');
      }

      if (!this.model) {
        throw new Error('Gemini model not initialized');
      }

      // Simple test with minimal content
      const result = await this.model.generateContent('Say "Hello"');
      console.log('📊 Raw result:', result);

      const response = await result.response;
      console.log('📨 Response object:', response);

      const text = response.text();
      console.log('📄 Response text:', text);

      console.log('✅ Gemini API test successful:', text);
      return { success: true, response: text };
    } catch (error) {
      console.error('❌ Gemini API test failed:');
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Full error object:', error);

      // Check for specific error types
      let errorType = 'Unknown';
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('invalid')) {
        errorType = 'Invalid API Key';
      } else if (error.message?.includes('PERMISSION_DENIED')) {
        errorType = 'Permission Denied';
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        errorType = 'Quota Exceeded';
      } else if (error.message?.includes('fetch')) {
        errorType = 'Network Error';
      }

      return {
        success: false,
        error: error.message,
        errorType: errorType,
        fullError: error
      };
    }
  }

  // Alternative method using direct REST API
  async callGeminiDirectly(prompt) {
    try {
      console.log('🌐 Making direct API call to Gemini...');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      console.log('📊 Direct API Response status:', response.status);
      console.log('📊 Direct API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error Response:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('📄 Direct API Response data:', JSON.stringify(data, null, 2));

      // Check different possible response formats
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        console.log('🎯 First candidate:', JSON.stringify(candidate, null, 2));
        
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          const text = candidate.content.parts[0].text;
          console.log('✅ Extracted text:', text);
          return text;
        } else {
          console.error('❌ No content.parts found in candidate');
          throw new Error('No content found in API response');
        }
      } else {
        console.error('❌ No candidates found in response');
        console.log('Full response structure:', Object.keys(data));
        throw new Error('No candidates in API response');
      }
    } catch (error) {
      console.error('❌ Direct API call failed:', error);
      throw error;
    }
  }

  // Generate career recommendations using Google Gemini
  async generateCareerRecommendations(assessmentData) {
    try {
      if (this.geminiApiKey && this.model) {
        console.log('🤖 Using Gemini AI for career recommendations');
        console.log('🔑 API Key present:', this.geminiApiKey ? 'Yes' : 'No');
        console.log('📝 Assessment data:', assessmentData);

        const prompt = this.buildCareerPrompt(assessmentData);
        console.log('📋 Prompt length:', prompt.length);

        const result = await this.model.generateContent(prompt);
        console.log('📊 Gemini result:', result);

        const response = await result.response;
        console.log('📨 Gemini response:', response);

        const text = response.text();
        console.log('📄 Response text:', text);

        // Parse the JSON response from Gemini
        try {
          const recommendations = JSON.parse(text);
          console.log('✅ Gemini recommendations:', recommendations);
          return Array.isArray(recommendations) ? recommendations : recommendations.recommendations || [];
        } catch (parseError) {
          console.error('❌ Error parsing Gemini response:', parseError);
          console.log('Raw Gemini response:', text);
          // Fallback to mock data if parsing fails
          return this.generateEnhancedMockRecommendations(assessmentData);
        }
      } else {
        console.log('🔄 Using mock data (no Gemini API key)');
        console.log('API Key:', this.geminiApiKey ? 'Present' : 'Missing');
        console.log('Model:', this.model ? 'Initialized' : 'Not initialized');
        return this.generateEnhancedMockRecommendations(assessmentData);
      }
    } catch (error) {
      console.error('❌ Gemini API Error Details:');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error status:', error.status);
      console.error('Full error:', error);

      // Check for specific error types
      if (error.message?.includes('API_KEY_INVALID')) {
        console.error('🔑 Invalid API Key - Please check your Gemini API key');
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        console.error('📊 Quota exceeded - You may have hit the free tier limit');
      } else if (error.message?.includes('PERMISSION_DENIED')) {
        console.error('🚫 Permission denied - API key may not have proper permissions');
      }

      // Fallback to mock data
      return this.generateEnhancedMockRecommendations(assessmentData);
    }
  }

  // Generate skill gap analysis
  async generateSkillGapAnalysis(userSkills, targetCareer, assessmentData) {
    try {
      if (this.isProduction && this.supabaseUrl) {
        const { data, error } = await supabase.functions.invoke('skill-gap-analysis', {
          body: { userSkills, targetCareer, assessmentData }
        });

        if (error) throw error;
        return data.analysis;
      } else {
        return this.generateMockSkillGapAnalysis(userSkills, targetCareer);
      }
    } catch (error) {
      console.error('Error generating skill gap analysis:', error);
      return this.generateMockSkillGapAnalysis(userSkills, targetCareer);
    }
  }

  // Chat with AI assistant using Google Gemini
  async chatWithAssistant(message, context = [], assessmentData = null) {
    try {
      if (this.geminiApiKey && this.model) {
        console.log('🤖 Using Gemini AI for chat');
        console.log('💬 User message:', message);

        const prompt = this.buildChatPrompt(message, context, assessmentData);
        console.log('📋 Chat prompt:', prompt);

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Gemini chat response:', text);
        return text;
      } else {
        console.log('🔄 Using mock chat response (no Gemini API key)');
        return this.generateMockChatResponse(message, assessmentData);
      }
    } catch (error) {
      console.error('❌ Gemini Chat Error Details:');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Full error:', error);

      return this.generateMockChatResponse(message, assessmentData);
    }
  }

  // Build prompts for Gemini AI
  buildCareerPrompt(assessmentData) {
    return `You are a career advisor AI specifically trained for the Indian job market. 
Based on the following student profile, recommend exactly 5 suitable career paths.

STUDENT PROFILE:
Name: ${assessmentData.name}
Age: ${assessmentData.age}
Education: ${assessmentData.education}
Field of Study: ${assessmentData.fieldOfStudy}
Location: ${assessmentData.location}

Technical Skills:
- Programming Languages: ${(assessmentData.programmingLanguages || []).join(', ') || 'None'}
- Frameworks: ${(assessmentData.frameworks || []).join(', ') || 'None'}
- Databases: ${(assessmentData.databases || []).join(', ') || 'None'}
- Cloud Platforms: ${(assessmentData.cloudPlatforms || []).join(', ') || 'None'}
- Tools: ${(assessmentData.toolsAndTech || []).join(', ') || 'None'}

Career Interests: ${(assessmentData.careerInterests || []).join(', ')}
Work Environment Preference: ${assessmentData.workEnvironment}
Work Style: ${assessmentData.workStyle}
Career Goals: ${assessmentData.careerGoals}

Experience:
- Internships: ${assessmentData.internships || 'None'}
- Projects: ${assessmentData.projects || 'None'}
- Certifications: ${assessmentData.certifications || 'None'}
- Achievements: ${assessmentData.achievements || 'None'}

Strengths: ${(assessmentData.strengths || []).join(', ')}
Languages: ${(assessmentData.languages || []).join(', ')}

REQUIREMENTS:
1. Provide exactly 5 career recommendations
2. Focus on realistic opportunities in India
3. Consider current market trends and demand
4. Include salary ranges in INR (Lakhs Per Annum)
5. Provide match percentage (70-95% range)
6. Include specific reasoning for each recommendation

IMPORTANT: Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "title": "Job Title",
    "match": 85,
    "description": "Detailed description...",
    "skills": ["skill1", "skill2", "skill3"],
    "salaryRange": "₹X-Y LPA",
    "growth": "High",
    "companies": ["company1", "company2", "company3"],
    "timeToEntry": "X-Y months",
    "reasoning": "Specific reasoning...",
    "careerPath": "Career progression...",
    "responsibilities": ["responsibility1", "responsibility2"],
    "industryOutlook": "Industry outlook...",
    "jobOpenings": "High"
  }
]

Do not include any text before or after the JSON array.`;
  }

  buildChatPrompt(message, context, assessmentData) {
    const contextStr = context.slice(-5).map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    const profileStr = assessmentData ? `
User Profile: ${assessmentData.name}, ${assessmentData.education}, interested in ${(assessmentData.careerInterests || []).join(', ')}
    ` : '';

    return `You are CareerAI, a helpful career advisor for Indian students. 
    
${profileStr}

Previous conversation:
${contextStr}

Current question: ${message}

Provide helpful, actionable advice specific to the Indian job market and education system.
Be conversational, supportive, and practical. Keep responses concise but informative.
If the user asks about specific careers, provide India-specific information.
Focus on practical advice that students can implement immediately.`;
  }

  // Enhanced mock implementations with realistic data
  generateEnhancedMockRecommendations(assessmentData) {
    const baseRecommendations = this.getBaseRecommendations();

    // Filter and customize based on assessment data
    let filteredRecommendations = baseRecommendations.filter(rec => {
      const interests = assessmentData.careerInterests || [];
      const skills = [
        ...(assessmentData.programmingLanguages || []),
        ...(assessmentData.frameworks || []),
        ...(assessmentData.toolsAndTech || [])
      ].filter(skill => skill !== 'None');

      // Calculate match based on interests and skills
      let matchScore = 0;

      // Interest matching (40% weight)
      const interestMatch = interests.some(interest =>
        rec.relatedInterests.some(relInt =>
          interest.toLowerCase().includes(relInt.toLowerCase()) ||
          relInt.toLowerCase().includes(interest.toLowerCase())
        )
      );
      if (interestMatch) matchScore += 40;

      // Skill matching (35% weight)
      const skillMatch = skills.some(skill =>
        rec.skills.some(reqSkill =>
          skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
          reqSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      if (skillMatch) matchScore += 35;

      // Education level matching (15% weight)
      if (assessmentData.fieldOfStudy && rec.preferredEducation.includes(assessmentData.fieldOfStudy)) {
        matchScore += 15;
      }

      // Experience matching (10% weight)
      if (assessmentData.projects || assessmentData.internships) {
        matchScore += 10;
      }

      rec.match = Math.min(95, Math.max(70, matchScore + Math.random() * 10));
      return matchScore > 30; // Only include if reasonable match
    });

    // Ensure we have at least 5 recommendations
    if (filteredRecommendations.length < 5) {
      filteredRecommendations = baseRecommendations.slice(0, 5);
      filteredRecommendations.forEach(rec => {
        rec.match = Math.floor(Math.random() * 25) + 70; // 70-95 range
      });
    }

    // Sort by match score and take top 5
    filteredRecommendations.sort((a, b) => b.match - a.match);
    return filteredRecommendations.slice(0, 5).map((rec, index) => ({
      ...rec,
      id: index + 1,
      match: Math.round(rec.match)
    }));
  }

  getBaseRecommendations() {
    return [
      {
        title: "Full Stack Developer",
        description: "Build end-to-end web applications using modern frameworks and cloud technologies. Work on both frontend user interfaces and backend server logic to create complete digital solutions.",
        skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express.js", "HTML/CSS", "Git", "Supabase"],
        salaryRange: "₹6-18 LPA",
        growth: "High",
        companies: ["TCS", "Infosys", "Wipro", "Accenture", "Flipkart"],
        timeToEntry: "6-12 months",
        reasoning: "High demand in Indian IT sector with excellent growth opportunities for freshers.",
        careerPath: "Junior Developer → Senior Developer → Tech Lead → Engineering Manager",
        responsibilities: [
          "Develop responsive web applications using modern frameworks",
          "Design and implement RESTful APIs and database schemas",
          "Collaborate with designers and product managers on feature development",
          "Write clean, maintainable code and conduct code reviews",
          "Deploy and maintain applications on cloud platforms"
        ],
        industryOutlook: "Excellent growth prospects with India's booming tech sector and digital transformation initiatives.",
        jobOpenings: "High",
        relatedInterests: ["Software Development", "Web Development", "Technology"],
        preferredEducation: ["Computer Science/IT", "Electronics & Communication"]
      },
      {
        title: "Data Scientist",
        description: "Analyze complex datasets to derive actionable business insights and build predictive models. Use statistical methods and machine learning to solve real-world problems.",
        skills: ["Python", "Machine Learning", "SQL", "Statistics", "Pandas", "Scikit-learn", "Tableau", "PostgreSQL"],
        salaryRange: "₹8-25 LPA",
        growth: "Very High",
        companies: ["Google", "Microsoft", "Flipkart", "Zomato", "Paytm"],
        timeToEntry: "8-15 months",
        reasoning: "Rapidly growing field with high demand across industries in India's data-driven economy.",
        careerPath: "Data Analyst → Data Scientist → Senior Data Scientist → Data Science Manager",
        responsibilities: [
          "Collect, clean, and analyze large datasets from various sources",
          "Build and deploy machine learning models for business problems",
          "Create data visualizations and reports for stakeholders",
          "Collaborate with engineering teams to implement data solutions",
          "Stay updated with latest data science techniques and tools"
        ],
        industryOutlook: "Explosive growth expected with India's focus on AI and data analytics across sectors.",
        jobOpenings: "Very High",
        relatedInterests: ["Data Science & Analytics", "Artificial Intelligence/Machine Learning", "Analytics"],
        preferredEducation: ["Computer Science/IT", "Mathematics", "Statistics"]
      },
      {
        title: "Product Manager",
        description: "Lead product development from conception to launch, working with cross-functional teams. Define product strategy, gather requirements, and ensure successful product delivery.",
        skills: ["Product Strategy", "Analytics", "Communication", "Agile", "User Research", "Roadmapping", "SQL", "Excel"],
        salaryRange: "₹12-30 LPA",
        growth: "High",
        companies: ["Swiggy", "Paytm", "Ola", "Byju's", "Razorpay"],
        timeToEntry: "12-24 months",
        reasoning: "High-impact role with excellent compensation, perfect for those with business acumen and technical understanding.",
        careerPath: "Associate PM → Product Manager → Senior PM → VP Product",
        responsibilities: [
          "Define product vision and strategy based on market research",
          "Gather and prioritize product requirements from stakeholders",
          "Work with engineering and design teams to deliver features",
          "Analyze product metrics and user feedback for improvements",
          "Present product updates to leadership and stakeholders"
        ],
        industryOutlook: "Strong demand as Indian startups and enterprises focus on product-led growth.",
        jobOpenings: "High",
        relatedInterests: ["Product Management", "Business Analysis", "Strategy"],
        preferredEducation: ["Computer Science/IT", "Commerce/Business", "Engineering"]
      },
      {
        title: "UI/UX Designer",
        description: "Design intuitive and engaging user interfaces for web and mobile applications. Focus on user experience research, wireframing, prototyping, and visual design.",
        skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems", "HTML/CSS", "Sketch", "InVision"],
        salaryRange: "₹5-15 LPA",
        growth: "High",
        companies: ["Razorpay", "Freshworks", "Zoho", "PhonePe", "Design Studios"],
        timeToEntry: "6-12 months",
        reasoning: "Growing demand for user-centered design as Indian companies prioritize user experience.",
        careerPath: "Junior Designer → UX Designer → Senior Designer → Design Lead",
        responsibilities: [
          "Conduct user research and create user personas and journey maps",
          "Design wireframes, mockups, and interactive prototypes",
          "Collaborate with developers to ensure design implementation",
          "Create and maintain design systems and style guides",
          "Test and iterate designs based on user feedback"
        ],
        industryOutlook: "Excellent prospects as digital products become more sophisticated in India.",
        jobOpenings: "High",
        relatedInterests: ["UI/UX Design", "Graphic Design", "Creative"],
        preferredEducation: ["Design", "Computer Science/IT", "Arts"]
      },
      {
        title: "Backend Developer",
        description: "Build robust server-side applications and APIs using modern backend technologies. Focus on database design, API development, and system architecture.",
        skills: ["Node.js", "Python", "PostgreSQL", "REST APIs", "Docker", "Supabase", "Express.js", "Authentication"],
        salaryRange: "₹7-20 LPA",
        growth: "Very High",
        companies: ["Amazon", "Flipkart", "Myntra", "Uber", "Tech Startups"],
        timeToEntry: "8-15 months",
        reasoning: "Critical role in modern software development with high demand for scalable backend systems.",
        careerPath: "Backend Developer → Senior Developer → Backend Architect → Engineering Manager",
        responsibilities: [
          "Design and implement scalable APIs and microservices",
          "Optimize database queries and manage data architecture",
          "Implement security best practices and authentication systems",
          "Collaborate with frontend teams on API integration",
          "Monitor system performance and implement optimizations"
        ],
        industryOutlook: "Exceptional growth as Indian companies build complex digital platforms.",
        jobOpenings: "Very High",
        relatedInterests: ["Backend Development", "Database Design", "System Architecture"],
        preferredEducation: ["Computer Science/IT", "Electronics & Communication"]
      }
    ];
  }

  generateMockSkillGapAnalysis(userSkills, targetCareer) {
    const requiredSkills = targetCareer.skills;
    const existingSkills = requiredSkills.filter(skill =>
      userSkills.some(userSkill =>
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    const missingSkills = requiredSkills.filter(skill => !existingSkills.includes(skill));

    return {
      existing: existingSkills,
      missing: missingSkills,
      learningPath: this.generateLearningPath(missingSkills, targetCareer.title)
    };
  }

  generateLearningPath(missingSkills, careerTitle) {
    const learningResources = {
      'JavaScript': {
        priority: 'High',
        timeEstimate: '2-3 months',
        resources: [
          { name: 'JavaScript.info - Complete Tutorial', type: 'Free', url: 'https://javascript.info', rating: 4.8 },
          { name: 'Complete JavaScript Course (Udemy)', type: 'Paid', url: '#', rating: 4.7 },
          { name: 'freeCodeCamp JavaScript', type: 'Free', url: 'https://freecodecamp.org', rating: 4.6 }
        ]
      },
      'React': {
        priority: 'High',
        timeEstimate: '2-3 months',
        resources: [
          { name: 'React Official Tutorial', type: 'Free', url: 'https://reactjs.org/tutorial', rating: 4.8 },
          { name: 'Complete React Developer Course', type: 'Paid', url: '#', rating: 4.7 },
          { name: 'React Projects for Beginners', type: 'Free', url: '#', rating: 4.6 }
        ]
      },
      'Supabase': {
        priority: 'Medium',
        timeEstimate: '1-2 months',
        resources: [
          { name: 'Supabase Official Documentation', type: 'Free', url: 'https://supabase.com/docs', rating: 4.8 },
          { name: 'Build with Supabase Course', type: 'Free', url: 'https://supabase.com/docs/guides/getting-started', rating: 4.7 },
          { name: 'Supabase YouTube Channel', type: 'Free', url: 'https://youtube.com/@supabase', rating: 4.6 }
        ]
      },
      'PostgreSQL': {
        priority: 'High',
        timeEstimate: '2-3 months',
        resources: [
          { name: 'PostgreSQL Tutorial', type: 'Free', url: 'https://postgresqltutorial.com', rating: 4.7 },
          { name: 'Complete PostgreSQL Course', type: 'Paid', url: '#', rating: 4.8 },
          { name: 'PostgreSQL Documentation', type: 'Free', url: 'https://postgresql.org/docs', rating: 4.6 }
        ]
      }
    };

    return missingSkills.map(skill => ({
      skill,
      ...learningResources[skill] || {
        priority: 'Medium',
        timeEstimate: '2-3 months',
        resources: [
          { name: `Learn ${skill} - Official Docs`, type: 'Free', url: '#', rating: 4.5 },
          { name: `${skill} Complete Course (Udemy)`, type: 'Paid', url: '#', rating: 4.6 },
          { name: `${skill} Tutorial (YouTube)`, type: 'Free', url: '#', rating: 4.4 }
        ]
      }
    }));
  }

  generateMockChatResponse(message, assessmentData) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('supabase')) {
      return `Supabase is an excellent choice for modern applications! Here's what makes it great:

**Key Benefits:**
• **Real-time database**: PostgreSQL with real-time subscriptions
• **Built-in authentication**: Social logins, magic links, row-level security
• **Edge Functions**: Serverless functions for custom logic
• **Storage**: File uploads and management
• **Auto-generated APIs**: REST and GraphQL APIs from your schema

**Getting Started:**
1. Create a Supabase project at supabase.com
2. Set up your database schema
3. Install the JavaScript client: \`npm install @supabase/supabase-js\`
4. Configure your environment variables
5. Start building with real-time features!

**Perfect for:**
• Full-stack applications
• Real-time chat apps
• User authentication systems
• File storage and management
• Rapid prototyping

${assessmentData ? `With your background in ${assessmentData.fieldOfStudy}, Supabase can help you build production-ready apps quickly!` : ''}`;
    }

    if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
      return `Here are key resume tips for Indian students:

• **Keep it concise**: 1-2 pages maximum, focus on relevant information
• **Technical skills section**: List programming languages, frameworks, and tools prominently
• **Project showcase**: Include 2-3 key projects with technologies used and outcomes
• **Quantify achievements**: Use numbers wherever possible (e.g., "Improved performance by 30%")
• **ATS-friendly format**: Use simple formatting, avoid graphics that ATS can't read
• **Include relevant coursework**: Especially if you're a fresher
• **Contact information**: Professional email, LinkedIn profile, GitHub (for tech roles)

${assessmentData ? `Based on your profile in ${assessmentData.fieldOfStudy}, make sure to highlight relevant projects and skills!` : ''}`;
    }

    // Default response
    return `I'm here to help with your career questions! I can assist with:

• **Career recommendations** based on your skills and interests
• **Skill development** guidance and learning resources
• **Resume and interview** preparation tips
• **Technology choices** like Supabase, React, and modern development
• **Job market insights** for the Indian tech industry

What specific area would you like to explore? Feel free to ask about any career-related topic!

${assessmentData ? `I have your assessment data and can provide personalized advice based on your background in ${assessmentData.fieldOfStudy}.` : 'Complete the career assessment to get personalized recommendations!'}`;
  }
}

export default new AIService();