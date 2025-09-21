import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Target, BookOpen, ExternalLink, Clock, Star, CheckCircle, TrendingUp, Award } from 'lucide-react';
import { useUser } from '../context/UserContext';
import LoadingSpinner from './LoadingSpinner';
import aiService from '../services/aiService';

const SkillGapAnalysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { assessmentData, recommendations, skillAnalysis, setSkillAnalysis } = useUser();
  
  const [selectedCareer, setSelectedCareer] = useState(0);
  const [skillGapData, setSkillGapData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!assessmentData) {
      navigate('/assessment');
      return;
    }

    if (!recommendations) {
      navigate('/recommendations');
      return;
    }

    // Check if a specific career was selected from recommendations page
    if (location.state?.selectedCareer) {
      const careerIndex = recommendations.findIndex(rec => rec.id === location.state.selectedCareer.id);
      if (careerIndex !== -1) {
        setSelectedCareer(careerIndex);
      }
    }

    generateSkillGapAnalysis();
  }, [assessmentData, recommendations, selectedCareer, navigate, location.state]);

  const generateSkillGapAnalysis = async () => {
    if (!recommendations || recommendations.length === 0) return;

    setLoading(true);
    try {
      const currentCareer = recommendations[selectedCareer];
      const userSkills = [
        ...(assessmentData.programmingLanguages || []),
        ...(assessmentData.frameworks || []),
        ...(assessmentData.databases || []),
        ...(assessmentData.cloudPlatforms || []),
        ...(assessmentData.toolsAndTech || [])
      ].filter(skill => skill !== 'None');

      const analysis = await aiService.generateSkillGapAnalysis(userSkills, currentCareer, assessmentData);
      setSkillGapData(analysis);
      setSkillAnalysis(analysis);
    } catch (error) {
      console.error('Error generating skill gap analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!assessmentData || !recommendations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Prerequisites Missing</h2>
          <p className="text-gray-600 mb-6">Please complete the assessment and get recommendations first.</p>
          <button
            onClick={() => navigate('/assessment')}
            className="btn-primary"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Analyzing your skill gaps..." />
      </div>
    );
  }

  const currentCareer = recommendations[selectedCareer];
  const skillGap = skillGapData || generateMockSkillGap(currentCareer);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Skill Gap Analysis & Learning Roadmap
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Identify what skills you need to develop and get a personalized learning plan 
            to reach your career goals faster.
          </p>
        </div>

        {/* Career Selection */}
        <div className="card mb-8">
          <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary-600" />
            <span>Select a career path to analyze:</span>
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((career, index) => (
              <button
                key={career.id}
                onClick={() => setSelectedCareer(index)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCareer === index 
                    ? 'border-primary-500 bg-primary-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <h4 className="font-semibold text-gray-900 mb-1">{career.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{career.match}% Match</p>
                <p className="text-xs text-gray-500">{career.salaryRange}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Skills Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Skills You Have */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Skills You Have</h3>
            </div>
            
            {skillGap.existing && skillGap.existing.length > 0 ? (
              <div className="space-y-3">
                {skillGap.existing.map(skill => (
                  <div key={skill} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="font-medium text-green-800">{skill}</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                ))}
                <div className="mt-4 p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    Great! You already have {skillGap.existing.length} relevant skills for this role.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <Target className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500 italic">
                  No matching skills found yet. This is a great opportunity to start learning!
                </p>
              </div>
            )}
          </div>

          {/* Skills to Learn */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <Target className="h-6 w-6 text-red-600" />
              <h3 className="text-xl font-bold text-gray-900">Skills to Develop</h3>
            </div>
            
            {skillGap.missing && skillGap.missing.length > 0 ? (
              <div className="space-y-3">
                {skillGap.missing.map(skill => (
                  <div key={skill} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="font-medium text-red-800">{skill}</span>
                    <Target className="h-5 w-5 text-red-600" />
                  </div>
                ))}
                <div className="mt-4 p-3 bg-red-100 rounded-lg">
                  <p className="text-sm text-red-800 font-medium">
                    Focus on learning these {skillGap.missing.length} skills to become job-ready.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-green-400 mb-4">
                  <Award className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-green-600 font-medium">
                  Congratulations! You have all the required skills for this role.
                </p>
              </div>
            )}
          </div>

          {/* Progress Summary */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Progress Summary</h3>
            </div>
            
            <div className="space-y-4">
              <ProgressBar
                label="Skill Readiness"
                current={skillGap.existing?.length || 0}
                total={(skillGap.existing?.length || 0) + (skillGap.missing?.length || 0)}
                color="bg-blue-500"
              />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {skillGap.existing?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Skills Ready</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {skillGap.missing?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Skills Needed</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Estimated Timeline:</strong> {currentCareer.timeToEntry} with focused learning
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Roadmap */}
        {skillGap.learningPath && skillGap.learningPath.length > 0 && (
          <div className="card">
            <div className="flex items-center space-x-2 mb-8">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <h3 className="text-2xl font-bold text-gray-900">Personalized Learning Roadmap</h3>
            </div>

            <div className="space-y-8">
              {skillGap.learningPath.map((item, index) => (
                <LearningPathItem
                  key={item.skill}
                  item={item}
                  index={index}
                  totalItems={skillGap.learningPath.length}
                />
              ))}
            </div>

            {/* Timeline Summary */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg border border-primary-200">
              <h4 className="font-semibold text-primary-900 mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Learning Timeline & Strategy</span>
              </h4>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-primary-800 mb-2">Recommended Approach:</h5>
                  <ul className="text-primary-700 space-y-1 text-sm">
                    <li>• Start with high-priority skills first</li>
                    <li>• Dedicate 2-3 hours daily for consistent progress</li>
                    <li>• Build projects while learning each skill</li>
                    <li>• Join communities for support and networking</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-primary-800 mb-2">Success Tips:</h5>
                  <ul className="text-primary-700 space-y-1 text-sm">
                    <li>• Practice coding daily, even if just 30 minutes</li>
                    <li>• Build a portfolio showcasing your projects</li>
                    <li>• Get feedback from experienced developers</li>
                    <li>• Apply for internships while learning</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white rounded-lg border border-primary-200">
                <p className="text-primary-800 font-medium">
                  🎯 <strong>Goal:</strong> You could be job-ready for {currentCareer.title} in approximately{' '}
                  <span className="text-primary-600 font-bold">{currentCareer.timeToEntry}</span> with consistent daily practice.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              View Dashboard
            </button>
            <button
              onClick={() => navigate('/recommendations')}
              className="btn-secondary"
            >
              Back to Recommendations
            </button>
          </div>
          
          <p className="text-sm text-gray-500">
            Need help with your learning journey? Chat with our AI assistant for personalized guidance.
          </p>
        </div>
      </div>
    </section>
  );
};

// Progress Bar Component
const ProgressBar = ({ label, current, total, color = "bg-blue-500" }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
        <span>{label}</span>
        <span>{current}/{total} ({Math.round(percentage)}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`${color} h-3 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Learning Path Item Component
const LearningPathItem = ({ item, index, totalItems }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-600 rounded-full font-semibold text-sm">
            {index + 1}
          </div>
          <h4 className="text-xl font-semibold text-gray-900">{item.skill}</h4>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(item.priority)}`}>
            {item.priority} Priority
          </span>
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{item.timeEstimate}</span>
          </div>
        </div>
      </div>

      {/* Learning Resources */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {item.resources.map((resource, resourceIndex) => (
          <ResourceCard key={resourceIndex} resource={resource} />
        ))}
      </div>

      {/* Expandable Learning Tips */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary-600 hover:text-primary-800 font-medium text-sm flex items-center space-x-1"
        >
          <span>{isExpanded ? 'Hide' : 'Show'} Learning Tips</span>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {isExpanded && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Learning Strategy:</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Start with fundamentals and build gradually</li>
                  <li>• Practice with hands-on projects</li>
                  <li>• Join online communities for support</li>
                  <li>• Set daily learning goals</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Project Ideas:</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Build a simple application using {item.skill}</li>
                  <li>• Contribute to open-source projects</li>
                  <li>• Create tutorial content to reinforce learning</li>
                  <li>• Solve real-world problems with {item.skill}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Resource Card Component
const ResourceCard = ({ resource }) => {
  return (
    <div className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow bg-white">
      <div className="flex items-start justify-between mb-2">
        <h5 className="font-medium text-gray-900 text-sm leading-tight">{resource.name}</h5>
        <span className={`px-2 py-1 rounded text-xs font-medium ml-2 flex-shrink-0 ${
          resource.type === 'Free' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {resource.type}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm text-gray-600">{resource.rating}</span>
        </div>
        <button className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center space-x-1">
          <span>View</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

// Mock skill gap generator for fallback
const generateMockSkillGap = (career) => {
  const allSkills = career.skills;
  const existingSkills = allSkills.slice(0, Math.floor(allSkills.length * 0.4));
  const missingSkills = allSkills.filter(skill => !existingSkills.includes(skill));

  return {
    existing: existingSkills,
    missing: missingSkills,
    learningPath: missingSkills.map(skill => ({
      skill,
      priority: Math.random() > 0.5 ? 'High' : 'Medium',
      timeEstimate: '2-3 months',
      resources: [
        { name: `Learn ${skill} - Complete Guide`, type: 'Free', rating: 4.5 },
        { name: `${skill} Masterclass`, type: 'Paid', rating: 4.7 },
        { name: `${skill} Practice Projects`, type: 'Free', rating: 4.3 }
      ]
    }))
  };
};

export default SkillGapAnalysis;