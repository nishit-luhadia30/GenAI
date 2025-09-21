import { Brain, Github, Linkedin, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-bold">CareerAI</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering Indian students with AI-driven career guidance and personalized learning roadmaps. 
              Your journey to the perfect career starts here.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <SocialLink href="#" icon={Github} label="GitHub" />
              <SocialLink href="#" icon={Linkedin} label="LinkedIn" />
              <SocialLink href="#" icon={Mail} label="Email" />
            </div>

            {/* Powered by */}
            <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded"></div>
                <span className="text-sm font-medium">Powered by Google Cloud</span>
              </div>
              <p className="text-xs text-gray-400">
                Using Supabase and AI for intelligent career recommendations and analysis
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink href="/" text="Home" />
              <FooterLink href="/assessment" text="Career Assessment" />
              <FooterLink href="/recommendations" text="Career Paths" />
              <FooterLink href="/skills" text="Skill Analysis" />
              <FooterLink href="/dashboard" text="Dashboard" />
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <FooterLink href="#" text="Learning Paths" external />
              <FooterLink href="#" text="Resume Templates" external />
              <FooterLink href="#" text="Interview Prep" external />
              <FooterLink href="#" text="Job Market Insights" external />
              <FooterLink href="#" text="Salary Guide" external />
              <FooterLink href="#" text="Career Blog" external />
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <StatItem number="10,000+" label="Students Guided" />
            <StatItem number="95%" label="Success Rate" />
            <StatItem number="500+" label="Career Paths" />
            <StatItem number="50+" label="Partner Companies" />
          </div>
        </div>

        {/* Additional Info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-3">Contact Information</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@careerai.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Bangalore, Karnataka, India</span>
                </div>
              </div>
            </div>

            {/* For Students */}
            <div>
              <h4 className="font-semibold mb-3">For Students</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Free career assessment</li>
                <li>• Personalized recommendations</li>
                <li>• Skill development roadmaps</li>
                <li>• Industry insights</li>
                <li>• 24/7 AI assistant support</li>
              </ul>
            </div>

            {/* For Educators */}
            <div>
              <h4 className="font-semibold mb-3">For Educators</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Institutional partnerships</li>
                <li>• Bulk assessment tools</li>
                <li>• Career counseling resources</li>
                <li>• Student progress tracking</li>
                <li>• Custom career programs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>© {currentYear} CareerAI. All rights reserved.</span>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for Indian students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        <div className="relative">
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>
      </div>
    </footer>
  );
};

// Social Link Component
const SocialLink = ({ href, icon: Icon, label }) => (
  <a
    href={href}
    className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
    aria-label={label}
  >
    <Icon className="h-5 w-5" />
  </a>
);

// Footer Link Component
const FooterLink = ({ href, text, external = false }) => (
  <li>
    <a
      href={href}
      className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      <span>{text}</span>
      {external && <ExternalLink className="h-3 w-3" />}
    </a>
  </li>
);

// Stat Item Component
const StatItem = ({ number, label }) => (
  <div className="text-center">
    <div className="text-2xl font-bold text-primary-400 mb-1">{number}</div>
    <div className="text-sm text-gray-400">{label}</div>
  </div>
);

export default Footer;