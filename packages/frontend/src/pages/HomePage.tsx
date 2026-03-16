import { Link } from 'react-router-dom';
import { Heart, Shield, Users, Star } from 'lucide-react';

function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Find Your Perfect Life Partner
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            India's most trusted matrimonial platform with verified profiles and smart matching
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Create Free Profile
            </Link>
            <Link to="/search" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Search Profiles
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Why Choose VivahBandhan?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">100% Verified Profiles</h3>
              <p className="text-gray-600">Every profile is verified with government ID and phone verification</p>
            </div>
            <div className="text-center p-6">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="text-gray-600">AI-powered compatibility matching based on your preferences</p>
            </div>
            <div className="text-center p-6">
              <Star className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
              <p className="text-gray-600">Control who sees your profile with advanced privacy settings</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Register</h3>
              <p className="text-gray-600 text-sm">Create your profile with basic details</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Verify</h3>
              <p className="text-gray-600 text-sm">Verify your phone, email, and ID</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Search</h3>
              <p className="text-gray-600 text-sm">Find matches based on preferences</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="font-semibold mb-2">Connect</h3>
              <p className="text-gray-600 text-sm">Send interests and start conversations</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;