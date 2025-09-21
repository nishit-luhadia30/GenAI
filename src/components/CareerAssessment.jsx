import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, User, BookOpen, Heart, MapPin, Save } from 'lucide-react';
import { useUser } from '../context/UserContext';
import LoadingSpinner from './LoadingSpinner';

const CareerAssessment = () => {
  const navigate = useNavigate();
  const { assessmentData, setAssessmentData, setLoading, isLoading } = useUser();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(assessmentData || {});
  const [validationErrors, setValidationErrors] = useState({});

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (Object.keys(answers).length > 0) {
        localStorage.setItem('careerAI_tempAssessment', JSON.stringify(answers));
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [answers]);

  // Load temp data on mount
  useEffect(() => {
    const tempData = localStorage.getItem('careerAI_tempAssessment');
    if (tempData && !assessmentData) {
      try {
        const parsedData = JSON.parse(tempData);
        setAnswers(parsedData);
      } catch (error) {
        console.error('Error loading temp data:', error);
      }
    }
  }, [assessmentData]);

  const questions = [
    {
      id: 'personal',
      title: 'Personal Information',
      icon: User,
      description: 'Tell us about yourself to get personalized recommendations',
      fields: [
        { 
          name: 'name', 
          label: 'Full Name', 
          type: 'text', 
          required: true,
          placeholder: 'Enter your full name'
        },
        { 
          name: 'age', 
          label: 'Age', 
          type: 'number', 
          required: true,
          min: 16,
          max: 35,
          placeholder: 'Enter your age'
        },
        { 
          name: 'education', 
          label: 'Current Education Level', 
          type: 'select', 
          options: [
            '12th Grade (Science)',
            '12th Grade (Commerce)', 
            '12th Grade (Arts)',
            'Diploma',
            'Undergraduate (1st Year)',
            'Undergraduate (2nd Year)', 
            'Undergraduate (3rd Year)',
            'Undergraduate (Final Year)',
            'Graduate',
            'Postgraduate',
            'PhD'
          ], 
          required: true 
        },
        { 
          name: 'location', 
          label: 'Location (City, State)', 
          type: 'text', 
          required: true,
          placeholder: 'e.g., Bangalore, Karnataka'
        },
        {
          name: 'fieldOfStudy',
          label: 'Field of Study',
          type: 'select',
          options: [
            'Computer Science/IT',
            'Electronics & Communication',
            'Mechanical Engineering',
            'Civil Engineering',
            'Electrical Engineering',
            'Chemical Engineering',
            'Biotechnology',
            'Mathematics',
            'Physics',
            'Chemistry',
            'Commerce/Business',
            'Economics',
            'Arts/Humanities',
            'Other'
          ],
          required: true
        }
      ]
    },
    {
      id: 'skills',
      title: 'Technical Skills & Experience',
      icon: BookOpen,
      description: 'Help us understand your current technical capabilities',
      fields: [
        { 
          name: 'programmingLanguages', 
          label: 'Programming Languages', 
          type: 'multiselect',
          options: [
            'Python', 'Java', 'JavaScript', 'C++', 'C#', 'C', 'Go', 'Rust', 
            'PHP', 'Swift', 'Kotlin', 'R', 'MATLAB', 'Scala', 'Ruby', 'None'
          ],
          description: 'Select all programming languages you know'
        },
        { 
          name: 'frameworks', 
          label: 'Frameworks & Libraries', 
          type: 'multiselect',
          options: [
            'React', 'Angular', 'Vue.js', 'Node.js', 'Django', 'Flask', 
            'Spring Boot', 'Express.js', 'Laravel', 'ASP.NET', 'Flutter', 
            'React Native', 'TensorFlow', 'PyTorch', 'None'
          ],
          description: 'Select frameworks and libraries you have experience with'
        },
        { 
          name: 'databases', 
          label: 'Database Experience', 
          type: 'multiselect',
          options: [
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 
            'Oracle', 'SQL Server', 'Cassandra', 'Firebase', 'None'
          ]
        },
        { 
          name: 'cloudPlatforms', 
          label: 'Cloud Platforms', 
          type: 'multiselect',
          options: [
            'AWS', 'Supabase', 'Microsoft Azure', 'Firebase', 
            'Heroku', 'DigitalOcean', 'Vercel', 'Netlify', 'None'
          ]
        },
        {
          name: 'toolsAndTech',
          label: 'Tools & Technologies',
          type: 'multiselect',
          options: [
            'Git/GitHub', 'Docker', 'Kubernetes', 'Jenkins', 'Figma', 
            'Adobe Creative Suite', 'Tableau', 'Power BI', 'Excel', 
            'Jira', 'Slack', 'VS Code', 'IntelliJ', 'None'
          ]
        }
      ]
    },
    {
      id: 'interests',
      title: 'Career Interests & Preferences',
      icon: Heart,
      description: 'What type of work excites you the most?',
      fields: [
        { 
          name: 'careerInterests', 
          label: 'Career Areas of Interest', 
          type: 'multiselect',
          options: [
            'Software Development', 'Web Development', 'Mobile App Development',
            'Data Science & Analytics', 'Artificial Intelligence/Machine Learning',
            'Cybersecurity', 'Cloud Computing', 'DevOps',
            'Product Management', 'Project Management', 'Business Analysis',
            'Digital Marketing', 'Content Creation', 'Social Media Marketing',
            'UI/UX Design', 'Graphic Design', 'Game Development',
            'Quality Assurance/Testing', 'Technical Writing', 'Consulting',
            'Sales & Business Development', 'Human Resources', 'Finance'
          ],
          required: true,
          description: 'Select at least 3 areas that interest you'
        },
        { 
          name: 'workEnvironment', 
          label: 'Preferred Work Environment', 
          type: 'select',
          options: [
            'Early-stage Startup (High risk, high reward)',
            'Growth-stage Startup (Scaling phase)',
            'Large Corporation (Established processes)',
            'Government/Public Sector',
            'Freelance/Consulting',
            'Remote Work',
            'Hybrid Work',
            'No Preference'
          ],
          required: true
        },
        { 
          name: 'workStyle', 
          label: 'Preferred Work Style', 
          type: 'select',
          options: [
            'Individual contributor (Working independently)',
            'Team collaboration (Working closely with others)',
            'Leadership role (Managing teams)',
            'Client-facing (Direct customer interaction)',
            'Behind-the-scenes (Focus on technical work)',
            'Mixed approach'
          ],
          required: true
        },
        { 
          name: 'careerGoals', 
          label: 'Short-term Career Goals (1-2 years)', 
          type: 'textarea',
          placeholder: 'Describe what you want to achieve in your career in the next 1-2 years...',
          required: true
        }
      ]
    },
    {
      id: 'experience',
      title: 'Experience & Background',
      icon: MapPin,
      description: 'Share your experience and achievements',
      fields: [
        { 
          name: 'internships', 
          label: 'Internship & Work Experience', 
          type: 'textarea', 
          placeholder: 'Describe any internships, part-time jobs, or work experience you have...'
        },
        { 
          name: 'projects', 
          label: 'Personal/Academic Projects', 
          type: 'textarea',
          placeholder: 'Describe your key projects, including technologies used and outcomes...',
          required: true
        },
        { 
          name: 'certifications', 
          label: 'Certifications & Courses', 
          type: 'textarea',
          placeholder: 'List any relevant certifications, online courses, or training programs...'
        },
        { 
          name: 'achievements', 
          label: 'Achievements & Awards', 
          type: 'textarea',
          placeholder: 'Mention any academic achievements, competition wins, or recognition...'
        },
        { 
          name: 'strengths', 
          label: 'Key Strengths', 
          type: 'multiselect',
          options: [
            'Problem Solving', 'Analytical Thinking', 'Creative Thinking',
            'Leadership', 'Team Collaboration', 'Communication',
            'Time Management', 'Adaptability', 'Learning Agility',
            'Technical Writing', 'Presentation Skills', 'Attention to Detail',
            'Project Management', 'Customer Service', 'Innovation'
          ],
          required: true,
          description: 'Select your top 5 strengths'
        },
        {
          name: 'languages',
          label: 'Languages Known',
          type: 'multiselect',
          options: [
            'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
            'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Urdu', 'Odia',
            'French', 'German', 'Spanish', 'Japanese', 'Mandarin'
          ],
          required: true
        }
      ]
    }
  ];

  const handleInputChange = (fieldName, value) => {
    setAnswers(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  const validateCurrentStep = () => {
    const currentQuestionData = questions[currentQuestion];
    const errors = {};

    currentQuestionData.fields.forEach(field => {
      if (field.required) {
        const value = answers[field.name];
        
        if (!value || (Array.isArray(value) && value.length === 0)) {
          errors[field.name] = `${field.label} is required`;
        } else if (field.type === 'multiselect' && field.name === 'careerInterests' && value.length < 3) {
          errors[field.name] = 'Please select at least 3 career interests';
        } else if (field.type === 'multiselect' && field.name === 'strengths' && value.length > 5) {
          errors[field.name] = 'Please select maximum 5 strengths';
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setLoading(true);
    
    try {
      // Add completion timestamp
      const completedAssessment = {
        ...answers,
        completedAt: new Date().toISOString(),
        id: Date.now().toString()
      };

      // Save to context
      setAssessmentData(completedAssessment);
      
      // Clear temp data
      localStorage.removeItem('careerAI_tempAssessment');
      
      // Navigate to recommendations
      navigate('/recommendations');
    } catch (error) {
      console.error('Error completing assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const value = answers[field.name] || (field.type === 'multiselect' ? [] : '');
    const hasError = validationErrors[field.name];

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div>
            <input
              type={field.type}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`input-field ${hasError ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              required={field.required}
            />
            {hasError && <p className="text-red-500 text-sm mt-1">{hasError}</p>}
          </div>
        );
      
      case 'select':
        return (
          <div>
            <select
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`input-field ${hasError ? 'border-red-500 focus:ring-red-500' : ''}`}
              required={field.required}
            >
              <option value="">Select an option</option>
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {hasError && <p className="text-red-500 text-sm mt-1">{hasError}</p>}
          </div>
        );
      
      case 'multiselect':
        return (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {field.options.map(option => (
                <label key={option} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(value || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = value || [];
                      if (e.target.checked) {
                        handleInputChange(field.name, [...currentValues, option]);
                      } else {
                        handleInputChange(field.name, currentValues.filter(v => v !== option));
                      }
                    }}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            {field.description && (
              <p className="text-sm text-gray-500 mt-2">{field.description}</p>
            )}
            {hasError && <p className="text-red-500 text-sm mt-1">{hasError}</p>}
          </div>
        );
      
      case 'textarea':
        return (
          <div>
            <textarea
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              rows={4}
              className={`input-field resize-none ${hasError ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder={field.placeholder}
              required={field.required}
            />
            {hasError && <p className="text-red-500 text-sm mt-1">{hasError}</p>}
          </div>
        );
      
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Processing your assessment..." />
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const Icon = currentQuestionData.icon;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <Icon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{currentQuestionData.title}</h2>
                <p className="text-gray-600">{currentQuestionData.description}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>Step {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {currentQuestionData.fields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-3">
              {/* Auto-save indicator */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Save className="h-4 w-4" />
                <span>Auto-saved</span>
              </div>

              <button
                onClick={handleNext}
                className="btn-primary flex items-center space-x-2"
              >
                <span>
                  {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerAssessment;