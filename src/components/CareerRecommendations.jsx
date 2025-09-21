import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, TrendingUp, DollarSign, MapPin, Clock, ArrowRight, Star, Users, BookOpen } from 'lucide-react';
import { useUser } from '../context/UserContext';
import LoadingSpinner, { PulseSpinner } from './LoadingSpinner';
import aiService from '../services/aiService';

const CareerRecommendations = () => {
  const navigate = useNavigate();
  const { assessmentData, recommendations, setRecommendations, setLoading, isLoading } = useUser();
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false);

  useEffect(() => {
    if (!assessmentData) {
      navigate('/assessment');
      return;
    }

    if (!recommendations) {
      generateRecommendations();
    }
  }, [assessmentData, recommendations, navigate]);

  const generateRecommendations = async () => {
    setGeneratingRecommendations(true);
    setLoading(true);
    
    try {
      const generatedRecommendations = await aiService.generateCareerRecommendations(assessmentData);
      setRecommendations(generatedRecommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setGeneratingRecommendations(false);
      setLoading(false);
    }
  };

  const handleViewSkillAnalysis = (career) => {
    setSelectedCareer(career);
    navigate('/skills', { state: { selectedCareer: career } });
  };

  if (!assessmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment Required</h2>
          <p className="text-gray-600 mb-6">Please complete the career assessment first.</p>
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

  if (generatingRecommendations || isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-6xl mx-auto text-center">
          <div className="card">
            <PulseSpinner message="Analyzing your profile with AI..." />
            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Generating Your Career Recommendations</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI is processing your assessment data to create personalized career paths 
                tailored specifically for you and the Indian job market.
              </p>
              <div className="flex justify-center space-x-8 mt-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Analyzing skills & interests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Matching career paths</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Calculating compatibility</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Recommendations Available</h2>
          <p className="text-gray-600 mb-6">Unable to generate recommendations. Please try again.</p>
          <button
            onClick={generateRecommendations}
            className="btn-primary"
          >
            Regenerate Recommendations
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Personalized Career Recommendations
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on your skills, interests, and background, here are the top career paths 
            tailored specifically for you and the Indian job market.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {recommendations.length}
            </div>
            <div className="text-gray-600">Career Paths Found</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Math.round(recommendations.reduce((sum, rec) => sum + rec.match, 0) / recommendations.length)}%
            </div>
            <div className="text-gray-600">Average Match Score</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {recommendations[0]?.match || 0}%
            </div>
            <div className="text-gray-600">Best Match Score</div>
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="space-y-8">
          {recommendations.map((career, index) => (
            <CareerCard
              key={career.id}
              career={career}
              index={index}
              onViewSkillAnalysis={handleViewSkillAnalysis}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12 space-y-4">
          <button
            onClick={() => navigate('/skills')}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <span>Analyze Skill Gaps</span>
            <ArrowRight className="h-5 w-5" />
          </button>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={generateRecommendations}
              className="btn-secondary"
            >
              Regenerate Recommendations
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Career Card Component
const CareerCard = ({ career, index, onViewSkillAnalysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getMatchColor = (match) => {
    if (match >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (match >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (match >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRankBadge = (index) => {
    const badges = [
      { label: '🥇 Best Match', color: 'bg-yellow-100 text-yellow-800' },
      { label: '🥈 Great Fit', color: 'bg-gray-100 text-gray-800' },
      { label: '🥉 Good Option', color: 'bg-orange-100 text-orange-800' }
    ];
    
    return badges[index] || { label: `#${index + 1} Match`, color: 'bg-blue-100 text-blue-800' };
  };

  const rankBadge = getRankBadge(index);

  return (
    <div className="card hover:shadow-2xl transition-all duration-300 border-l-4 border-primary-500">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="bg-primary-100 p-3 rounded-xl">
            <Briefcase className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{career.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${rankBadge.color}`}>
                {rankBadge.label}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getMatchColor(career.match)}`}>
                {career.match}% Match
              </div>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(career.match / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-6 text-lg leading-relaxed">{career.description}</p>
      
      {/* Why This Fits */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
          <Star className="h-4 w-4" />
          <span>Why this career fits you:</span>
        </h4>
        <p className="text-blue-800">{career.reasoning}</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={DollarSign}
          label="Salary Range"
          value={career.salaryRange}
          color="text-green-600"
        />
        <MetricCard
          icon={TrendingUp}
          label="Growth Potential"
          value={career.growth}
          color="text-blue-600"
        />
        <MetricCard
          icon={Clock}
          label="Time to Entry"
          value={career.timeToEntry}
          color="text-purple-600"
        />
        <MetricCard
          icon={Users}
          label="Job Openings"
          value={career.jobOpenings || "High"}
          color="text-orange-600"
        />
      </div>

      {/* Skills Required */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <BookOpen className="h-4 w-4" />
          <span>Key Skills Required:</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {career.skills.map(skill => (
            <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Top Companies */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          <span>Top Hiring Companies:</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {career.companies.map(company => (
            <span key={company} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium border border-primary-200">
              {company}
            </span>
          ))}
        </div>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="border-t border-gray-200 pt-6 mt-6 space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Career Path:</h4>
            <p className="text-gray-700">{career.careerPath || "Entry Level → Mid Level → Senior Level → Leadership"}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Day-to-Day Responsibilities:</h4>
            <ul className="text-gray-700 space-y-1">
              {(career.responsibilities || [
                "Collaborate with cross-functional teams",
                "Develop and implement solutions",
                "Analyze requirements and provide recommendations",
                "Stay updated with industry trends"
              ]).map((responsibility, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-primary-600 mt-1">•</span>
                  <span>{responsibility}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Industry Outlook:</h4>
            <p className="text-gray-700">
              {career.industryOutlook || "Strong growth expected in the Indian market with increasing demand for skilled professionals."}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => onViewSkillAnalysis(career)}
          className="btn-primary flex-1 flex items-center justify-center space-x-2"
        >
          <span>Analyze Skills Gap</span>
          <ArrowRight className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn-secondary flex-1"
        >
          {isExpanded ? 'Show Less' : 'Learn More'}
        </button>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
    <Icon className={`h-5 w-5 ${color}`} />
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default CareerRecommendations;