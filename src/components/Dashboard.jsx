import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Target, TrendingUp, BookOpen, Calendar, Award, 
  ExternalLink, RefreshCw, Download, Share2, Edit3,
  BarChart3, PieChart, Clock, CheckCircle2
} from 'lucide-react';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { assessmentData, recommendations, skillAnalysis, resetUserData } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  if (!assessmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h2>
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'recommendations', label: 'Career Paths', icon: Target },
    { id: 'skills', label: 'Skills', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: TrendingUp }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {assessmentData.name}!
            </h1>
            <p className="text-gray-600">
              Track your career journey and continue building your skills.
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={() => navigate('/assessment')}
              className="btn-secondary flex items-center space-x-2"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={resetUserData}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Start Over</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={CheckCircle2}
            title="Assessment"
            value="Complete"
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            icon={Target}
            title="Career Paths"
            value={recommendations?.length || 0}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            icon={TrendingUp}
            title="Best Match"
            value={recommendations?.[0]?.match ? `${recommendations[0].match}%` : 'N/A'}
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
          <StatCard
            icon={Clock}
            title="Time to Goal"
            value={recommendations?.[0]?.timeToEntry || 'N/A'}
            color="text-orange-600"
            bgColor="bg-orange-100"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'profile' && <ProfileTab assessmentData={assessmentData} />}
            {activeTab === 'recommendations' && <RecommendationsTab recommendations={recommendations} />}
            {activeTab === 'skills' && <SkillsTab assessmentData={assessmentData} skillAnalysis={skillAnalysis} />}
            {activeTab === 'progress' && <ProgressTab assessmentData={assessmentData} recommendations={recommendations} />}
          </div>
        </div>
      </div>
    </section>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
  <div className="card">
    <div className="flex items-center">
      <div className={`${bgColor} p-3 rounded-lg`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

// Overview Tab
const OverviewTab = () => {
  const { assessmentData, recommendations } = useUser();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-lg border border-primary-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Your Journey</h3>
          <div className="space-y-3">
            <ProgressStep completed={true} title="Career Assessment" description="Profile completed" />
            <ProgressStep 
              completed={!!recommendations} 
              title="Career Recommendations" 
              description={recommendations ? `${recommendations.length} paths found` : 'Get personalized recommendations'}
              action={!recommendations ? () => navigate('/recommendations') : undefined}
            />
            <ProgressStep 
              completed={false} 
              title="Skill Development" 
              description="Start learning new skills"
              action={() => navigate('/skills')}
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <ActionButton
              icon={Target}
              title="View Career Paths"
              description="Explore your recommendations"
              onClick={() => navigate('/recommendations')}
              disabled={!recommendations}
            />
            <ActionButton
              icon={BookOpen}
              title="Analyze Skills"
              description="See what skills to learn"
              onClick={() => navigate('/skills')}
              disabled={!recommendations}
            />
            <ActionButton
              icon={Download}
              title="Export Report"
              description="Download your career report"
              onClick={() => alert('Feature coming soon!')}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <ActivityItem
            icon={CheckCircle2}
            title="Assessment Completed"
            time={new Date(assessmentData.completedAt).toLocaleDateString()}
            color="text-green-600"
          />
          {recommendations && (
            <ActivityItem
              icon={Target}
              title="Career Recommendations Generated"
              time="Today"
              color="text-blue-600"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Profile Tab
const ProfileTab = ({ assessmentData }) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6">
      <InfoSection title="Personal Information">
        <InfoItem label="Name" value={assessmentData.name} />
        <InfoItem label="Age" value={assessmentData.age} />
        <InfoItem label="Education" value={assessmentData.education} />
        <InfoItem label="Field of Study" value={assessmentData.fieldOfStudy} />
        <InfoItem label="Location" value={assessmentData.location} />
      </InfoSection>

      <InfoSection title="Career Preferences">
        <InfoItem label="Work Environment" value={assessmentData.workEnvironment} />
        <InfoItem label="Work Style" value={assessmentData.workStyle} />
        <InfoItem 
          label="Career Interests" 
          value={(assessmentData.careerInterests || []).join(', ')} 
        />
      </InfoSection>
    </div>

    <InfoSection title="Technical Skills">
      <SkillsList 
        title="Programming Languages" 
        skills={assessmentData.programmingLanguages || []} 
      />
      <SkillsList 
        title="Frameworks & Libraries" 
        skills={assessmentData.frameworks || []} 
      />
      <SkillsList 
        title="Databases" 
        skills={assessmentData.databases || []} 
      />
      <SkillsList 
        title="Cloud Platforms" 
        skills={assessmentData.cloudPlatforms || []} 
      />
    </InfoSection>

    <InfoSection title="Experience & Background">
      <InfoItem label="Projects" value={assessmentData.projects} multiline />
      <InfoItem label="Internships" value={assessmentData.internships} multiline />
      <InfoItem label="Certifications" value={assessmentData.certifications} multiline />
      <InfoItem label="Achievements" value={assessmentData.achievements} multiline />
    </InfoSection>
  </div>
);

// Recommendations Tab
const RecommendationsTab = ({ recommendations }) => {
  const navigate = useNavigate();

  if (!recommendations) {
    return (
      <div className="text-center py-12">
        <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
        <p className="text-gray-600 mb-6">Get personalized career recommendations based on your profile.</p>
        <button
          onClick={() => navigate('/recommendations')}
          className="btn-primary"
        >
          Get Recommendations
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {recommendations.map((career, index) => (
        <div key={career.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{career.title}</h3>
              <div className="flex items-center space-x-4">
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {career.match}% Match
                </span>
                <span className="text-gray-600">{career.salaryRange}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">#{index + 1}</div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{career.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {career.skills.slice(0, 5).map(skill => (
              <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>

          <button
            onClick={() => navigate('/skills', { state: { selectedCareer: career } })}
            className="text-primary-600 hover:text-primary-800 font-medium flex items-center space-x-1"
          >
            <span>Analyze Skills Gap</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// Skills Tab
const SkillsTab = ({ assessmentData, skillAnalysis }) => {
  const allSkills = [
    ...(assessmentData.programmingLanguages || []),
    ...(assessmentData.frameworks || []),
    ...(assessmentData.databases || []),
    ...(assessmentData.cloudPlatforms || []),
    ...(assessmentData.toolsAndTech || [])
  ].filter(skill => skill !== 'None');

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>Your Current Skills</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {allSkills.map(skill => (
              <span key={skill} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-4 text-sm text-green-700">
            Total: {allSkills.length} skills
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Strengths</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {(assessmentData.strengths || []).map(strength => (
              <span key={strength} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {strength}
              </span>
            ))}
          </div>
        </div>
      </div>

      {skillAnalysis && (
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">Skill Development Recommendations</h3>
          <p className="text-yellow-800 mb-4">
            Based on your career goals, here are the key areas to focus on:
          </p>
          <div className="space-y-2">
            {skillAnalysis.learningPath?.slice(0, 3).map(item => (
              <div key={item.skill} className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="font-medium">{item.skill}</span>
                <span className="text-sm text-gray-600">{item.timeEstimate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Progress Tab
const ProgressTab = ({ assessmentData, recommendations }) => {
  const completionDate = new Date(assessmentData.completedAt);
  const daysSinceAssessment = Math.floor((new Date() - completionDate) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-primary-50 rounded-lg border border-primary-200">
          <div className="text-3xl font-bold text-primary-600 mb-2">{daysSinceAssessment}</div>
          <div className="text-primary-800">Days Since Assessment</div>
        </div>
        
        <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {recommendations ? recommendations.length : 0}
          </div>
          <div className="text-green-800">Career Paths Explored</div>
        </div>
        
        <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {recommendations?.[0]?.match || 0}%
          </div>
          <div className="text-purple-800">Best Career Match</div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
        <div className="space-y-4">
          <NextStep
            completed={!!recommendations}
            title="Get Career Recommendations"
            description="Discover personalized career paths"
          />
          <NextStep
            completed={false}
            title="Start Skill Development"
            description="Begin learning required skills"
          />
          <NextStep
            completed={false}
            title="Build Portfolio Projects"
            description="Create projects to showcase skills"
          />
          <NextStep
            completed={false}
            title="Apply for Opportunities"
            description="Start applying for jobs or internships"
          />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ProgressStep = ({ completed, title, description, action }) => (
  <div className="flex items-center space-x-3">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
      completed ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
    }`}>
      {completed ? <CheckCircle2 className="h-4 w-4" /> : <div className="w-2 h-2 bg-current rounded-full" />}
    </div>
    <div className="flex-1">
      <div className="font-medium text-gray-900">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
    {action && (
      <button onClick={action} className="text-primary-600 hover:text-primary-800 text-sm font-medium">
        Start
      </button>
    )}
  </div>
);

const ActionButton = ({ icon: Icon, title, description, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full text-left p-3 rounded-lg border transition-colors ${
      disabled 
        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
        : 'border-green-200 bg-white hover:bg-green-50 text-gray-900'
    }`}
  >
    <div className="flex items-center space-x-3">
      <Icon className="h-5 w-5" />
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  </button>
);

const ActivityItem = ({ icon: Icon, title, time, color }) => (
  <div className="flex items-center space-x-3">
    <Icon className={`h-5 w-5 ${color}`} />
    <div className="flex-1">
      <div className="font-medium text-gray-900">{title}</div>
      <div className="text-sm text-gray-600">{time}</div>
    </div>
  </div>
);

const InfoSection = ({ title, children }) => (
  <div className="bg-gray-50 p-6 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const InfoItem = ({ label, value, multiline }) => (
  <div>
    <div className="text-sm font-medium text-gray-600">{label}</div>
    <div className={`text-gray-900 ${multiline ? 'whitespace-pre-wrap' : ''}`}>
      {value || 'Not provided'}
    </div>
  </div>
);

const SkillsList = ({ title, skills }) => (
  <div>
    <div className="text-sm font-medium text-gray-600 mb-2">{title}</div>
    <div className="flex flex-wrap gap-2">
      {skills.filter(skill => skill !== 'None').map(skill => (
        <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
          {skill}
        </span>
      ))}
      {skills.filter(skill => skill !== 'None').length === 0 && (
        <span className="text-gray-500 text-sm">None specified</span>
      )}
    </div>
  </div>
);

const NextStep = ({ completed, title, description }) => (
  <div className="flex items-center space-x-3">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
      completed ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
    }`}>
      {completed ? <CheckCircle2 className="h-4 w-4" /> : <div className="w-2 h-2 bg-current rounded-full" />}
    </div>
    <div>
      <div className="font-medium text-gray-900">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  </div>
);

export default Dashboard;