function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-2">Profile Views</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-2">Interests Received</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-lg mb-2">Matches</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;