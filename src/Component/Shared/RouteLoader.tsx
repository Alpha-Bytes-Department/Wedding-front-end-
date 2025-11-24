// Loading fallback component for lazy-loaded routes
const RouteLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Animated spinner */}
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-gray-700 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default RouteLoader;
