import { useState } from 'react';
import aiService from '../services/aiService.js';

const GeminiTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const result = await aiService.testGeminiConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      console.log('🔑 Testing with API key:', apiKey);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello, just respond with "API working"'
            }]
          }]
        })
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response headers:', response.headers);
      
      const data = await response.json();
      console.log('📄 Response data:', data);
      
      if (response.ok) {
        setTestResult({ 
          success: true, 
          message: 'Direct API call successful',
          data: data 
        });
      } else {
        setTestResult({ 
          success: false, 
          error: `HTTP ${response.status}: ${data.error?.message || 'Unknown error'}`,
          details: data
        });
      }
    } catch (error) {
      console.error('❌ Direct API test error:', error);
      setTestResult({ 
        success: false, 
        error: error.message,
        type: 'Network/CORS Error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testCareerRecommendations = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      const mockAssessment = {
        name: 'Test User',
        age: 22,
        education: 'Bachelor\'s',
        fieldOfStudy: 'Computer Science',
        programmingLanguages: ['JavaScript', 'Python'],
        careerInterests: ['Software Development']
      };
      
      const result = await aiService.generateCareerRecommendations(mockAssessment);
      setTestResult({ success: true, data: result });
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Gemini API Test</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">API Key Status:</h3>
          <p className="text-sm">
            API Key: {aiService.geminiApiKey ? 
              `${aiService.geminiApiKey.substring(0, 10)}...` : 
              '❌ Not found'
            }
          </p>
          <p className="text-sm">
            Model: {aiService.model ? '✅ Initialized' : '❌ Not initialized'}
          </p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={testConnection}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test via SDK'}
          </button>
          
          <button
            onClick={testDirectAPI}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Direct API'}
          </button>
          
          <button
            onClick={testCareerRecommendations}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Career Recommendations'}
          </button>
        </div>

        {testResult && (
          <div className="mt-4 p-4 rounded border">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            {testResult.success ? (
              <div className="text-green-600">
                <p>✅ Success!</p>
                <pre className="bg-gray-100 p-2 rounded text-xs mt-2 overflow-auto">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-red-600">
                <p>❌ Failed: {testResult.error}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold text-blue-800">What Gemini Should Return:</h3>
          <div className="text-sm text-blue-700 mt-2">
            <p className="font-semibold">For Career Recommendations:</p>
            <pre className="bg-white p-2 rounded text-xs mt-1 overflow-auto">
{`[
  {
    "id": 1,
    "title": "Full Stack Developer",
    "match": 88,
    "description": "Build web applications...",
    "skills": ["JavaScript", "React", "Node.js"],
    "salaryRange": "₹6-18 LPA",
    "growth": "High",
    "companies": ["TCS", "Infosys", "Wipro"],
    "timeToEntry": "6-12 months",
    "reasoning": "Strong match based on skills...",
    "careerPath": "Junior → Senior → Lead",
    "responsibilities": ["Develop apps", "Write code"],
    "industryOutlook": "Excellent growth",
    "jobOpenings": "High"
  }
]`}
            </pre>
            
            <p className="font-semibold mt-3">For Chat:</p>
            <pre className="bg-white p-2 rounded text-xs mt-1">
{`"Hello! I'm CareerAI, your career advisor for Indian students. 
I can help you with career guidance, skill development, and job market insights."`}
            </pre>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded">
          <h3 className="font-semibold text-yellow-800">Troubleshooting:</h3>
          <ul className="text-sm text-yellow-700 mt-2 space-y-1">
            <li>1. Make sure your API key is valid and active</li>
            <li>2. Check if you have enabled the Generative AI API in Google Cloud Console</li>
            <li>3. Verify you haven't exceeded the free tier quota</li>
            <li>4. Ensure the API key has proper permissions</li>
            <li>5. Try generating a new API key if the current one doesn't work</li>
          </ul>
          
          <div className="mt-4">
            <p className="font-semibold">Get API Key:</p>
            <a 
              href="https://makersuite.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              https://makersuite.google.com/app/apikey
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiTest;