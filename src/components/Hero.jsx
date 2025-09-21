import { ArrowRight, Sparkles, Target, TrendingUp, Play, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Hero = () => {
  const { assessmentData, recommendations } = useUser();

  return (
    <section id="home" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-purple-50 opacity-50"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-fade-in">
            Your AI-Powered
            <span className="text-gradient block mt-2">
              Career Guide
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto animate-slide-up">
            Discover personalized career paths tailored for Indian students. Get AI-driven recommendations, 
            skill gap analysis, and actionable learning roadmaps to accelerate your professional journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {!assessmentData ? (
              <>
                <Link
                  to="/assessment"
                  className="btn-primary flex items-center justify-center space-x-2 shadow-glow"
                >
                  <span>Start Career Assessment</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                
                <button className="btn-secondary flex items-center justify-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Watch Demo</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <span>View Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                
                {!recommendations && (
                  <Link
                    to="/recommendations"
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <span>Get Recommendations</span>
                    <Sparkles className="h-5 w-5" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-16 text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Powered by Google Cloud AI</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>10,000+ Students Guided</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>95% Success Rate</span>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <FeatureCard
              icon={Target}
              title="Personalized Recommendations"
              description="Get 3-5 tailored career paths based on your skills, interests, and background"
              color="bg-primary-500"
              delay="0s"
            />

            <FeatureCard
              icon={TrendingUp}
              title="Skill Gap Analysis"
              description="Identify missing skills and get prioritized learning plans with resources"
              color="bg-purple-500"
              delay="0.1s"
            />

            <FeatureCard
              icon={Sparkles}
              title="AI Assistant"
              description="Chat with our AI for resume tips, course suggestions, and career guidance"
              color="bg-green-500"
              delay="0.2s"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color, delay }) => {
  return (
    <div 
      className="card animate-fade-in hover:scale-105 transition-transform duration-300"
      style={{ animationDelay: delay }}
    >
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default Hero;