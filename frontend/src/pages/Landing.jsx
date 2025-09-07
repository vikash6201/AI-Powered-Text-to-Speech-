import {
  Volume2,
  Mic,
  Sparkles,
  Play,
  ArrowRight,
  Menu,
  X,
  Info,
  Zap,
  UserPlus,
  LogIn,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    alert("Register clicked - this would navigate to /register in your app");
  };

  const handleAboutClick = () => {
    alert("About Us clicked - this would navigate to /about in your app");
  };

  const handleAIFeaturesClick = () => {
    alert(
      "AI Features clicked - this would navigate to /ai-features in your app"
    );
  };

  const handleDemoClick = () => {
    alert("Demo clicked - this would show a demo of the TTS functionality");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 w-full p-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold text-white">VoiceGen</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={handleAboutClick}
              className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
            >
              <Info className="w-4 h-4 transition-transform group-hover:rotate-12" />
              <span>About Us</span>
            </button>

            <button
              onClick={handleAIFeaturesClick}
              className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
            >
              <Zap className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>AI Features</span>
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLoginClick}
                className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-2 group"
              >
                <LogIn className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <span>Login</span>
              </button>

              <button
                onClick={handleRegisterClick}
                className="group px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
              >
                <UserPlus className="w-4 h-4 transition-transform group-hover:rotate-12" />
                <span>Register</span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-white hover:text-purple-400 transition-colors duration-300"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-sm border-b border-white/10 transition-all duration-300 ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="px-6 py-4 space-y-4">
            <button
              onClick={handleAboutClick}
              className="w-full text-left text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-3 py-3 border-b border-white/10"
            >
              <Info className="w-5 h-5" />
              <span>About Us</span>
            </button>

            <button
              onClick={handleAIFeaturesClick}
              className="w-full text-left text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-3 py-3 border-b border-white/10"
            >
              <Zap className="w-5 h-5" />
              <span>AI Features</span>
            </button>

            <button
              onClick={handleLoginClick}
              className="w-full text-left text-gray-300 hover:text-white transition-colors duration-300 flex items-center space-x-3 py-3 border-b border-white/10"
            >
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </button>

            <button
              onClick={handleRegisterClick}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Register</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 -mt-16">
        {/* Hero section */}
        <div className="text-center max-w-5xl mx-auto">
          {/* Floating icons */}
          <div className="relative mb-12">
            <div className="absolute -top-6 -left-6 animate-bounce animation-delay-1000">
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="absolute -top-4 -right-10 animate-bounce animation-delay-2000">
              <Mic className="w-10 h-10 text-blue-400" />
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce animation-delay-3000">
              <Play className="w-8 h-8 text-green-400" />
            </div>
            <div className="absolute top-4 right-1/4 animate-bounce animation-delay-4000">
              <Volume2 className="w-6 h-6 text-purple-400" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-200 mb-8 animate-fade-in leading-tight">
            Transform Text Into
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mt-2">
              Beautiful Voice
            </span>
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-500">
            Experience the future of text-to-speech technology. Create natural,
            expressive voices that bring your words to life with cutting-edge
            AI.
          </p>

          {/* Enhanced stats section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16 animate-fade-in animation-delay-700">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                50+
              </div>
              <div className="text-gray-400">Voice Models</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">
                99.9%
              </div>
              <div className="text-gray-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                24/7
              </div>
              <div className="text-gray-400">Available</div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-16 animate-fade-in animation-delay-900">
            <div className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-300">
                  <Volume2 className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Crystal Clear Audio
              </h3>
              <p className="text-gray-400 leading-relaxed">
                High-quality voice synthesis with natural intonation and emotion
                that rivals human speech.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-pink-500/50 transition-all duration-500 transform hover:scale-105 hover:bg-white/10 hover:shadow-2xl hover:shadow-pink-500/20">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                AI-Powered
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Advanced neural networks create human-like speech patterns with
                emotional intelligence.
              </p>
            </div>

            <div className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-500 transform hover:scale-105 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-300">
                  <Mic className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Multiple Voices
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Choose from various voice styles and languages for any project
                or creative need.
              </p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in animation-delay-1100">
            <button
              onClick={handleRegisterClick}
              className="group px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/30 flex items-center space-x-3"
            >
              <span>Start Creating</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={handleDemoClick}
              className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-full border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
            >
              <Play className="w-5 h-5" />
              <span>Try Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
          opacity: 0;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
