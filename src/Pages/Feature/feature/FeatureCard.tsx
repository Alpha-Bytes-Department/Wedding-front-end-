interface FeatureCardProps {
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ title, description, className = "" }: FeatureCardProps) => {
  return (
    <div className={`flex-1 max-w-lg ${className}`}>
      <div className="bg-white rounded-xl shadow-2xl p-8 lg:p-12 relative">
        <div className="mb-6">
          <div className="w-12 h-12 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-700"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-6 leading-tight">
          {title}
        </h2>
        <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8">
          {description}
        </p>
        <button className="bg-primary group hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
          Book for consult
          <svg
            className="w-4 h-4 group-hover:translate-x-4 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FeatureCard;
