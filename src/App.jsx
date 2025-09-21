import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import CareerAssessment from './components/CareerAssessment';
import CareerRecommendations from './components/CareerRecommendations';
import SkillGapAnalysis from './components/SkillGapAnalysis';
import Dashboard from './components/Dashboard';
import ChatBot from './components/ChatBot';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import DatabaseTest from './components/DatabaseTest';
import GeminiTest from './components/GeminiTest';
import { UserProvider } from './context/UserContext';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner message="Initializing CareerAI..." />
      </div>
    );
  }

  return (
    <UserProvider>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <Header />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/assessment" element={<CareerAssessment />} />
          <Route path="/recommendations" element={<CareerRecommendations />} />
          <Route path="/skills" element={<SkillGapAnalysis />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/db-test" element={<DatabaseTest />} />
          <Route path="/gemini-test" element={<GeminiTest />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <ChatBot />
        <Footer />
      </div>
    </UserProvider>
  );
}

// Home page component
const HomePage = () => {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
    </>
  );
};

// Features section
const FeaturesSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose CareerAI?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform is specifically designed for the Indian job market, 
            providing accurate and actionable career guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats section
const StatsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials section
const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600">
            See how CareerAI has helped students achieve their career goals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Data
import { Target, TrendingUp, Sparkles, Users, BookOpen, Award } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: "Personalized Recommendations",
    description: "Get 3-5 tailored career paths based on your unique profile and the Indian job market.",
    color: "bg-blue-500"
  },
  {
    icon: TrendingUp,
    title: "Skill Gap Analysis",
    description: "Identify missing skills and get prioritized learning plans with curated resources.",
    color: "bg-green-500"
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description: "Leverage Supabase and AI for accurate career predictions and guidance.",
    color: "bg-purple-500"
  },
  {
    icon: Users,
    title: "Industry Connections",
    description: "Connect with professionals and mentors in your chosen field.",
    color: "bg-orange-500"
  },
  {
    icon: BookOpen,
    title: "Learning Resources",
    description: "Access curated courses, tutorials, and certification programs.",
    color: "bg-indigo-500"
  },
  {
    icon: Award,
    title: "Progress Tracking",
    description: "Monitor your skill development and career advancement journey.",
    color: "bg-pink-500"
  }
];

const stats = [
  { value: "10K+", label: "Students Guided" },
  { value: "95%", label: "Success Rate" },
  { value: "500+", label: "Career Paths" },
  { value: "50+", label: "Partner Companies" }
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer at TCS",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    quote: "CareerAI helped me transition from mechanical engineering to software development. The personalized roadmap was exactly what I needed!"
  },
  {
    name: "Rahul Patel",
    role: "Data Scientist at Flipkart",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    quote: "The skill gap analysis was spot-on. I followed their recommendations and landed my dream job in data science within 8 months."
  },
  {
    name: "Ananya Reddy",
    role: "Product Manager at Swiggy",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    quote: "The AI chatbot provided incredible insights about product management. It's like having a personal career mentor available 24/7."
  }
];

export default App;