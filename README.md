# CareerAI - Personalized Career & Skills Advisor

An AI-powered career advisor designed specifically for Indian students, built with React and integrated with Supabase for backend services and AI capabilities. This application provides personalized career path recommendations, skill gap analysis, and actionable learning roadmaps.

## 🚀 Features

### Core Functionality
- **Comprehensive Career Assessment**: Multi-step questionnaire covering personal info, technical skills, interests, and experience
- **AI-Powered Recommendations**: 5 personalized career paths with detailed match scores and explanations
- **Skill Gap Analysis**: Identify missing skills and get prioritized learning plans with curated resources
- **Interactive AI Chatbot**: 24/7 career guidance, resume tips, and course recommendations
- **Personal Dashboard**: Track progress, view recommendations, and manage your career journey

### Key Highlights
- **Indian Job Market Focus**: Recommendations tailored specifically for the Indian tech ecosystem
- **Privacy-First Design**: Secure local storage with optional cloud sync
- **Mobile Responsive**: Optimized for all devices and screen sizes
- **Real-time AI Processing**: Powered by Supabase Edge Functions and AI
- **Comprehensive Learning Resources**: Curated free and paid courses, tutorials, and certifications

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful, customizable icons

### AI & Backend Integration
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **Supabase Edge Functions** - Serverless functions for AI processing
- **Supabase Auth** - User authentication and authorization
- **Supabase Storage** - File storage and management

### State Management
- **React Context** - Global state management
- **Local Storage** - Client-side data persistence
- **Custom Hooks** - Reusable state logic

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for production features)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd genAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Environment Configuration

Create a `.env` file based on `.env.example`:

```env
# Required for production features
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application settings
VITE_APP_NAME=CareerAI
VITE_ENABLE_ANALYTICS=true
```

## 🏗️ Project Structure

```
genAI/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Header.jsx      # Navigation header
│   │   ├── Hero.jsx        # Landing page hero
│   │   ├── CareerAssessment.jsx    # Multi-step assessment
│   │   ├── CareerRecommendations.jsx # AI recommendations
│   │   ├── SkillGapAnalysis.jsx    # Skills analysis
│   │   ├── Dashboard.jsx   # User dashboard
│   │   ├── ChatBot.jsx     # AI assistant
│   │   └── Footer.jsx      # Site footer
│   ├── context/           # React Context providers
│   │   └── UserContext.jsx # Global state management
│   ├── services/          # API and external services
│   │   ├── aiService.js   # AI service integration
│   │   └── supabaseClient.js # Supabase client and helpers
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles and Tailwind
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md             # This file
```

## 🎯 Usage Guide

### 1. Career Assessment
Students complete a comprehensive 4-step assessment:
- **Personal Information**: Basic details and education level
- **Technical Skills**: Programming languages, frameworks, tools
- **Career Interests**: Preferred work areas and environment
- **Experience**: Projects, internships, and achievements

### 2. AI-Powered Recommendations
The system analyzes assessment data and provides:
- 5 personalized career paths with match scores (70-95%)
- Detailed job descriptions and requirements
- Salary ranges specific to Indian market
- Top hiring companies and growth potential
- Realistic timelines to job readiness

### 3. Skill Gap Analysis
For each recommended career:
- Identify existing vs. missing skills
- Get prioritized learning roadmap
- Access curated learning resources (free & paid)
- Estimated learning timelines
- Project ideas and practice suggestions

### 4. AI Career Assistant
24/7 chatbot support for:
- Resume writing and optimization tips
- Interview preparation strategies
- Course and certification recommendations
- Career transition guidance
- Industry-specific insights

### 5. Personal Dashboard
Track your progress with:
- Assessment completion status
- Career recommendation overview
- Skill development progress
- Learning resource bookmarks
- Achievement milestones

## 🔧 Google Cloud Integration

### Setting up Vertex AI

1. **Create Google Cloud Project**
   ```bash
   gcloud projects create your-project-id
   gcloud config set project your-project-id
   ```

2. **Enable required APIs**
   ```bash
   gcloud services enable aiplatform.googleapis.com
   gcloud services enable firestore.googleapis.com
   ```

3. **Set up authentication**
   ```bash
   gcloud auth application-default login
   ```

4. **Configure service account** (for production)
   ```bash
   gcloud iam service-accounts create careerai-service
   gcloud projects add-iam-policy-binding your-project-id \
     --member="serviceAccount:careerai-service@your-project-id.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"
   ```

### Firestore Setup (Optional)

1. **Initialize Firestore**
   ```bash
   gcloud firestore databases create --region=asia-south1
   ```

2. **Set up security rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

## 🚀 Deployment

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Google Cloud Run Deployment

1. **Build and deploy**
   ```bash
   npm run build
   gcloud run deploy careerai \
     --source . \
     --platform managed \
     --region asia-south1 \
     --allow-unauthenticated \
     --set-env-vars="VITE_GOOGLE_CLOUD_PROJECT_ID=your-project-id"
   ```

2. **Set up custom domain** (optional)
   ```bash
   gcloud run domain-mappings create \
     --service careerai \
     --domain your-domain.com \
     --region asia-south1
   ```

### Docker Deployment

```bash
# Build Docker image
docker build -t careerai .

# Run locally
docker run -p 8080:8080 careerai

# Deploy to Google Cloud Run
gcloud run deploy careerai \
  --image gcr.io/your-project-id/careerai \
  --platform managed \
  --region asia-south1
```

## 🧪 Testing

### Running Tests
```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

### Manual Testing Checklist
- [ ] Complete career assessment flow
- [ ] Generate and view recommendations
- [ ] Analyze skill gaps for different careers
- [ ] Chat with AI assistant
- [ ] Navigate dashboard sections
- [ ] Test responsive design on mobile
- [ ] Verify data persistence

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Follow React best practices and hooks patterns
- Use TypeScript for new components (migration in progress)
- Maintain responsive design principles
- Add proper error handling and loading states
- Include comprehensive comments for complex logic
- Test on multiple devices and browsers

## 📊 Performance & Analytics

### Performance Optimizations
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Lazy loading and WebP format
- **Caching**: Service worker for offline functionality
- **Bundle Analysis**: Regular bundle size monitoring

### Analytics Integration
- Google Analytics 4 for user behavior tracking
- Custom events for career assessment completion
- Performance monitoring with Core Web Vitals
- Error tracking and reporting

## 🔒 Security & Privacy

### Data Protection
- **Local-first approach**: Data stored locally by default
- **Encryption**: Sensitive data encrypted in transit and at rest
- **GDPR Compliance**: User consent and data deletion options
- **No PII in logs**: Personal information excluded from logging

### Security Measures
- **Input validation**: All user inputs sanitized
- **XSS protection**: Content Security Policy implemented
- **HTTPS only**: Secure connections enforced
- **Regular updates**: Dependencies updated for security patches

## 📈 Roadmap

### Phase 1 (Current)
- [x] Core assessment and recommendation engine
- [x] AI chatbot integration
- [x] Responsive web application
- [x] Basic dashboard functionality

### Phase 2 (Next 3 months)
- [ ] Advanced skill tracking and progress monitoring
- [ ] Integration with job portals (Naukri, LinkedIn)
- [ ] Video interview preparation with AI feedback
- [ ] Mobile app development (React Native)

### Phase 3 (6 months)
- [ ] Mentor matching and networking features
- [ ] Company-specific preparation modules
- [ ] Advanced analytics and insights
- [ ] Multi-language support (Hindi, regional languages)

### Phase 4 (12 months)
- [ ] Enterprise solutions for educational institutions
- [ ] API for third-party integrations
- [ ] Advanced AI features (voice interaction, AR/VR)
- [ ] Global expansion beyond India

## 📞 Support & Community

### Getting Help
- **Documentation**: Comprehensive guides and API docs
- **GitHub Issues**: Bug reports and feature requests
- **Discord Community**: Real-time chat and support
- **Email Support**: support@careerai.com

### Community Resources
- **Blog**: Career tips and industry insights
- **YouTube Channel**: Tutorial videos and webinars
- **LinkedIn Group**: Professional networking
- **Twitter**: Latest updates and announcements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Technology Partners
- **Google Cloud** for AI and infrastructure services
- **Vercel** for hosting and deployment
- **Tailwind CSS** for the design system
- **React Team** for the amazing framework

### Data Sources
- Indian job market data from various industry reports
- Salary information from Glassdoor, Naukri, and PayScale
- Course recommendations from top educational platforms
- Industry insights from tech leaders and recruiters

### Special Thanks
- Indian student community for feedback and testing
- Career counselors and educators for domain expertise
- Open source contributors and maintainers
- Beta testers and early adopters

---

**Built with ❤️ for Indian students pursuing their dream careers.**

For more information, visit our [website](https://careerai.app) or follow us on [Twitter](https://twitter.com/careerai).