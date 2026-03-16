import { Heart, Users, Shield, Award } from 'lucide-react';

function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About VivahBandhan</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          India's trusted matrimonial platform helping families find perfect life partners through 
          traditional values and modern technology.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-red-50 rounded-2xl p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          At VivahBandhan, we believe that every individual deserves to find a life partner who 
          complements their values, aspirations, and dreams. Our mission is to bridge the gap 
          between tradition and technology, making the sacred journey of finding a life partner 
          simpler, safer, and more meaningful.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="text-center p-6">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Verified Profiles</h3>
          <p className="text-gray-600 text-sm">
            Every profile is manually verified to ensure authenticity and trust.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Million+ Members</h3>
          <p className="text-gray-600 text-sm">
            Join India's largest community of marriage-minded individuals.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">100% Privacy</h3>
          <p className="text-gray-600 text-sm">
            Your data is protected with enterprise-grade security.
          </p>
        </div>
        <div className="text-center p-6">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Success Stories</h3>
          <p className="text-gray-600 text-sm">
            Thousands of happy couples have found their match with us.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-900 rounded-2xl p-8 text-white">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-red-500">2M+</div>
            <div className="text-gray-400">Active Profiles</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-red-500">50K+</div>
            <div className="text-gray-400">Successful Marriages</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-red-500">100+</div>
            <div className="text-gray-400">Communities</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-red-500">15+</div>
            <div className="text-gray-400">Years of Trust</div>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Leadership</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-gray-200 w-24 h-24 rounded-full mx-auto mb-4"></div>
            <h3 className="font-semibold text-gray-900">Rajesh Kumar</h3>
            <p className="text-gray-600 text-sm">Founder & CEO</p>
          </div>
          <div className="text-center">
            <div className="bg-gray-200 w-24 h-24 rounded-full mx-auto mb-4"></div>
            <h3 className="font-semibold text-gray-900">Priya Sharma</h3>
            <p className="text-gray-600 text-sm">Head of Operations</p>
          </div>
          <div className="text-center">
            <div className="bg-gray-200 w-24 h-24 rounded-full mx-auto mb-4"></div>
            <h3 className="font-semibold text-gray-900">Amit Patel</h3>
            <p className="text-gray-600 text-sm">Chief Technology Officer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;