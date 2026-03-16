import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail } from 'lucide-react';

const faqs = [
  {
    question: 'How do I create a profile on VivahBandhan?',
    answer: 'Click on "Register Free" button and fill in your basic details like name, email, gender, and date of birth. After verification, you can complete your profile with additional information like education, occupation, family details, and partner preferences.',
  },
  {
    question: 'Is my personal information safe?',
    answer: 'Yes, we take privacy very seriously. Your personal information is encrypted and never shared without your consent. You have full control over what information is visible on your profile.',
  },
  {
    question: 'How do I search for potential matches?',
    answer: 'Use our advanced search feature to filter profiles by age, location, education, occupation, religion, caste, and many other criteria. Premium members get access to more search filters.',
  },
  {
    question: 'What is the difference between free and premium membership?',
    answer: 'Free members can create a profile, search for matches, and send limited interests. Premium members can send unlimited interests, view contact details, initiate chats, and access advanced matching features.',
  },
  {
    question: 'How do I send an interest to someone?',
    answer: 'Visit any profile and click the "Send Interest" button. If the person accepts your interest, you can start communicating with them.',
  },
  {
    question: 'Can I block or report a profile?',
    answer: 'Yes, you can block or report any profile that seems suspicious or inappropriate. Click the three dots on the profile and select "Block" or "Report". Our team reviews all reports within 24 hours.',
  },
  {
    question: 'How do I delete my account?',
    answer: 'Go to Settings > Account > Delete Account. Please note that this action is irreversible and all your data will be permanently deleted.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept all major credit/debit cards, UPI, net banking, and popular wallets like Paytm, PhonePe, and Google Pay.',
  },
];

function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-gray-600">Find answers to your questions or get in touch with our support team</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 text-left">{faq.question}</span>
                {openFaqIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openFaqIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-red-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Still need help?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <MessageCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-4">Chat with our support team</p>
            <button className="text-red-600 font-medium hover:underline">Start Chat</button>
          </div>
          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Phone className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm mb-4">Mon-Sat, 9am-6pm IST</p>
            <a href="tel:+911800123456" className="text-red-600 font-medium hover:underline">
              1800-123-456
            </a>
          </div>
          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Mail className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 text-sm mb-4">We reply within 24 hours</p>
            <a href="mailto:support@vivahbandhan.com" className="text-red-600 font-medium hover:underline">
              support@vivahbandhan.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;