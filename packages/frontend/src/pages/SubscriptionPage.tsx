function SubscriptionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold mb-8">Premium Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-2">Basic</h3>
          <p className="text-3xl font-bold text-primary-600 mb-4">Free</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>20 searches per day</li>
            <li>5 interests per day</li>
            <li>Limited messaging</li>
          </ul>
        </div>
        <div className="card p-6 border-2 border-primary-500">
          <h3 className="font-semibold text-lg mb-2">Premium</h3>
          <p className="text-3xl font-bold text-primary-600 mb-4">₹999/mo</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Unlimited searches</li>
            <li>Unlimited messaging</li>
            <li>View phone numbers</li>
            <li>Advanced filters</li>
          </ul>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-2">Premium Plus</h3>
          <p className="text-3xl font-bold text-primary-600 mb-4">₹1,999/mo</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>All Premium features</li>
            <li>Profile boost</li>
            <li>Featured listing</li>
            <li>Priority support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;