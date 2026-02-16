const ImageCollage = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex-1 relative pb-10 ${className}`}>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-300">
          <img
            src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=300&h=300&fit=crop&crop=center"
            alt="Wedding rings"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-300 mt-8">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=300&h=300&fit=crop&crop=faces"
            alt="Happy wedding couple"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-300 -mt-4">
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=300&fit=crop&crop=center"
            alt="Wedding party celebration"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-square rounded-2xl overflow-hidden shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-300 mt-4">
          <img
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=300&fit=crop&crop=center"
            alt="Elegant table setting"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageCollage;
