import { Shield, AlertTriangle, Lock, Eye, UserCheck, Flag, Phone, MessageCircle } from 'lucide-react';

function SafetyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Safety Matters</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          At VivahBandhan, your safety is our top priority. We employ multiple measures to ensure 
          you have a secure and trustworthy experience.
        </p>
      </div>

      {/* Safety Tips */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <UserCheck className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Profile Verification</h3>
          <p className="text-gray-600 text-sm">
            All profiles undergo verification checks including email, phone, and ID verification 
            to ensure authenticity.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Data Encryption</h3>
          <p className="text-gray-600 text-sm">
            Your personal data is encrypted using industry-standard protocols and stored securely 
            on protected servers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Eye className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Privacy Controls</h3>
          <p className="text-gray-600 text-sm">
            Control who sees your profile, photos, and contact information with granular 
            privacy settings.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Flag className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Report & Block</h3>
          <p className="text-gray-600 text-sm">
            Easily report suspicious profiles or behavior. Our team reviews all reports 
            within 24 hours.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Fraud Detection</h3>
          <p className="text-gray-600 text-sm">
            Our AI-powered system detects and prevents fraudulent activities, fake profiles, 
            and scams.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Safe Messaging</h3>
          <p className="text-gray-600 text-sm">
            Our messaging system monitors for inappropriate content and protects your 
            conversations.
          </p>
        </div>
      </div>

      {/* Warning Signs */}
      <div className="bg-yellow-50 rounded-2xl p-8 mb-16">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-8 h-8 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-900">Warning Signs to Watch For</h2>
        </div>
        <ul className="grid md:grid-cols-2 gap-4">
          <li className="flex items-start gap-3">
            <span className="text-yellow-600 mt-1">•</span>
            <span className="text-gray-700">Requests for money or financial help</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-yellow-600 mt-1">•</span>
            <span className="text-gray-700">Refusal to video call or meet in person</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-yellow-600 mt-1">•</span>
            <span className="text-gray-700">Inconsistent information in their profile</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-yellow-600 mt-1">•</span>
            <span className="text-gray-700">Pressuring you to share personal details quickly</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-yellow-600 mt-1">•</span>
            <span className="text-gray-700">Claims of being overseas or traveling frequently</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-yellow-600 mt-1">•</span>
            <span className="text-gray-700">Asking for your bank or financial information</span>
          </li>
        </ul>
      </div>

      {/* Safety Guidelines */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Safety Guidelines</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">When Communicating</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Keep conversations on our platform initially</li>
              <li>• Don't share personal contact details too early</li>
              <li>• Be cautious about sharing financial information</li>
              <li>• Trust your instincts if something feels wrong</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">When Meeting</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Meet in public places with good lighting</li>
              <li>• Inform family/friends about your meeting</li>
              <li>• Arrange your own transportation</li>
              <li>• Keep your phone charged and accessible</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-600 text-white rounded-2xl p-8 text-center">
        <Phone className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Need Immediate Help?</h2>
        <p className="mb-4">Our safety team is available 24/7 for emergencies</p>
        <a href="tel:1800-123-456" className="inline-block bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors">
          Call 1800-123-456
        </a>
      </div>
    </div>
  );
}

export default SafetyPage;