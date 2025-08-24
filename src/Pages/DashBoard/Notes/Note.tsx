const Note = () => {
  const notes = [
    {
      title: "Garden Vows-Sunset",
      from: "Dr. Steve",
      date: "Aug 12,2024",
      content:
        "Dear couple, as you prepare for your wedding ceremony, remember that this day is a celebration of your unique journey together. The vows you exchange will be a reflection of your love, commitment, and shared dreams. Take a moment to cherish the presence of your loved ones and the promises you make to each other. May your ceremony be filled with joy, meaning, and memories that last a lifetime.",
    },
    {
      title: "Beachside Bliss",
      from: "Officiant Jane",
      date: "Aug 10,2024",
      content:
        "As you stand on the sandy shores, ready to exchange your vows, remember that this moment is a testament to your love and commitment. The ocean's waves symbolize the ebb and flow of life, reminding you to navigate challenges together with grace and resilience. May your ceremony be a reflection of your unique bond, filled with laughter, tears of joy, and the unwavering support of those who cherish you.",
    },
    {
      title: "Mountain Retreat",
      from: "Officiant Mark",
      date: "Aug 15,2024",
      content:
        "As you stand amidst the majestic mountains, ready to exchange your vows, remember that this moment is a testament to your love and commitment. The mountains symbolize the strength and stability of your relationship, reminding you to navigate challenges together with grace and resilience. May your ceremony be a reflection of your unique bond, filled with laughter, tears of joy, and the unwavering support of those who cherish you.",
    },
  ];
  return (
    <div className="  ">
      <h1 className="text-3xl md:text-4xl pb-5 lg:py-7 lg:text-start pl-8 text-center font-primary font-bold text-gray-900 ">
        Your Notes
      </h1>

      <div className="space-y-8">
        {notes.map((note, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-primary p-4 md:p-6 shadow-xl w-full flex flex-col"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                <span className="text-primary font-primary font-medium text-base md:text-lg">
                  Title :{" "}
                  <span className="font-medium text-black">{note.title}</span>
                </span>
                <span className="text-primary font-primary font-medium text-base md:text-lg">
                  From :{" "}
                  <span className="font-medium text-black">{note.from}</span>
                </span>
              </div>
              <span className="text-xs text-primary font-secondary mt-2 md:mt-0">
                {note.date}
              </span>
            </div>
            <div className="text-gray-700 text-sm md:text-base mb-4">
              {note.content}
            </div>
            <hr className="border-t border-primary mb-4" />
            <div className="flex justify-end gap-4">
              <button className="px-6 py-2 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-colors">
                Delete
              </button>
              <button className="px-6 py-2 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-colors">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-12 gap-4 max-w-4xl ">
        <button className="bg-primary text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors">
          Start A New Ceremony
          <svg
            className="w-4 h-4"
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
        <button className="bg-white border border-primary text-primary px-6 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition-colors">
          Continue Editing
        </button>
      </div>
    </div>
  );
};

export default Note;
