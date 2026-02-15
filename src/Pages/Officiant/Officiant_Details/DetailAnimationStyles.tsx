const DetailAnimationStyles = () => (
  <style>{`
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(28px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeSlideLeft {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes floatSlow {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-6px) rotate(3deg); }
    }
    .anim-fade-up { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
    .anim-fade-left { animation: fadeSlideLeft 0.7s cubic-bezier(0.22,1,0.36,1) both; }
    .anim-scale-in { animation: scaleIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .anim-delay-1 { animation-delay: 0.1s; }
    .anim-delay-2 { animation-delay: 0.2s; }
    .anim-delay-3 { animation-delay: 0.35s; }
    .anim-delay-4 { animation-delay: 0.5s; }
    .anim-delay-5 { animation-delay: 0.65s; }
    .float-icon { animation: floatSlow 3s ease-in-out infinite; }
    .detail-profile-img { transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
    .detail-profile-img:hover { transform: scale(1.05); }
  `}</style>
);

export default DetailAnimationStyles;
