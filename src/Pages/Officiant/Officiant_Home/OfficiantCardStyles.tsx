/** Shared CSS keyframes & classes for officiant card animations */
const OfficiantCardStyles = () => (
  <style>{`
    @keyframes officiantCardIn {
      from {
        opacity: 0;
        transform: translateY(32px) scale(0.97);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .officiant-card-hidden {
      opacity: 0;
      transform: translateY(32px) scale(0.97);
    }
    .officiant-card-visible {
      animation: officiantCardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .officiant-card-img {
      transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .officiant-card:hover .officiant-card-img {
      transform: scale(1.08);
    }
    @keyframes floatSlow {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-6px) rotate(3deg); }
    }
    .float-icon {
      animation: floatSlow 3s ease-in-out infinite;
    }
  `}</style>
);

export default OfficiantCardStyles;
