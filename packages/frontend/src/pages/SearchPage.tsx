function SearchPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-bold mb-8">Search Profiles</h1>
      <div className="card p-6 mb-8">
        <p className="text-gray-600">Search filters coming soon...</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <p className="text-gray-500 col-span-3 text-center py-12">No profiles found. Try adjusting your search criteria.</p>
      </div>
    </div>
  );
}

export default SearchPage;