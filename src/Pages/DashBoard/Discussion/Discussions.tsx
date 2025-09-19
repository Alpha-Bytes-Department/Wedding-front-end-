import { useState } from "react";
import { GoFileDirectoryFill } from "react-icons/go";
import { IoAttachOutline } from "react-icons/io5";
import { loadStripe } from "@stripe/stripe-js";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useNavigate } from "react-router-dom";

const officiants = [
  {
    id: 1,
    name: "Alex Rivera",
    ceremony: "Garden Vows-Sunset",
    status: "Available",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    online: true,
  },
  {
    id: 2,
    name: "Alex Rivera",
    ceremony: "Garden Vows-Sunset",
    status: "Offline",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    online: false,
  },
  {
    id: 3,
    name: "Alex Rivera",
    ceremony: "Garden Vows-Sunset",
    status: "Offline",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    online: false,
  },
  {
    id: 3,
    name: "Alex Rivera",
    ceremony: "Garden Vows-Sunset",
    status: "Offline",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    online: false,
  },
];

const initialMessages = [
  { id: 1, sender: "officiant", type: "file", content: "Ceremony.pdf" },
  {
    id: 2,
    sender: "officiant",
    type: "text",
    content: "Hi there! Thanks to share your document here. I'm on it.",
  },
  { id: 3, sender: "me", type: "text", content: "Thank you." },
];

const Discussions = () => {
//   const [tab, setTab] = useState("Ongoing");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(officiants[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const axios = useAxios();


  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), sender: "me", type: "text", content: input },
      ]);
      setInput("");
    }
  };
  const navigate = useNavigate();
  const makePayment = async () => {
    navigate("/payment");
  };

  return (
    <div className=" lg:h-[87vh] bg-white flex flex-col">
      <div className="px-6 pt-6">
        <div className="text-gray-500 text-sm mb-1">Dashboard / Discussion</div>
        <h1 className="text-3xl font-primary font-bold text-gray-900 mb-2">
          Discussion with Officiant
        </h1>
      </div>
      <div className="flex-1 flex flex-col lg:flex-row lg:gap-0 gap-14 bg-white border-t border-gray-200">
        {/* Sidebar */}
        <div className="w-full lg:w-80 border border-gray-200 bg-white flex flex-col">
          {/* <div className="flex mt-4 mx-4 rounded overflow-hidden border border-gray-200">
            <button
              className={`flex-1 py-2 text-lg font-primary font-semibold ${
                tab === "Ongoing"
                  ? "bg-primary/10 text-primary"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setTab("Ongoing")}
            >
              Ongoing
            </button>
            <button
              className={`flex-1 py-2 text-lg font-primary font-semibold ${
                tab === "Past"
                  ? "bg-primary/10 text-primary"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setTab("Past")}
            >
              Past
            </button>
          </div> */}
          <div className="p-4">
            <input
              className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none  focus:border-yellow-600 duration-300"
              placeholder="Search officiants...."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-scroll min-h-40 lg:max-h-[68vh] max-h-60">
            {officiants
              .filter((o) =>
                o.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((o) => (
                <div
                  key={o.id}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-[#f8f2e4] duration-200 cursor-pointer border-b border-gray-100 ${
                    selected.id === o.id ? "bg-[#f8f2e4]" : "bg-transparent"
                  }`}
                  onClick={() => setSelected(o)}
                >
                  <img
                    src={o.avatar}
                    alt={o.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {o.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      Ceremony name:{" "}
                      <span className="text-gray-700">{o.ceremony}</span> •
                      Officiant: <span className="text-gray-700">{o.name}</span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full border ${
                      o.online
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {o.online ? "Available" : "Offline"}
                  </span>
                </div>
              ))}
          </div>
        </div>
        {/* Chat Area */}
        <div className="flex-1 rounded-xl flex flex-col bg-[#f8f2e4]">
          {/* Chat Header */}
          <h1 className=" text-2xl block lg:hidden font-semibold font-primary py-2  text-center border-b border-gray-200 w-full">
            Chat
          </h1>
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
            <img
              src={selected.avatar}
              alt={selected.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">{selected.name}</div>
              <div className="text-xs text-gray-500">
                Ceremony name:{" "}
                <span className="text-gray-700">{selected.ceremony}</span> •
                Officiant:{" "}
                <span className="text-gray-700">{selected.name}</span>
              </div>
            </div>
            <span className="px-3 py-1 text-xs rounded-full border bg-green-50 text-green-700 border-green-200">
              Available
            </span>
          </div>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-scroll min-h-[500px] max-h-[500px] lg:max-h-[63vh] px-6 py-6 flex flex-col gap-4">
            {messages.map((msg) =>
              msg.type === "file" ? (
                <div key={msg.id} className="flex">
                  <div className="bg-primary flex gap-3 text-gray-100 rounded-lg px-4 py-2 font-medium max-w-xs ml-auto">
                   <GoFileDirectoryFill size={24} color="white"/> {msg.content}
                  </div>
                </div>
              ) : msg.sender === "me" ? (
                <div key={msg.id} className="flex justify-end">
                  <div className="bg-primary text-white rounded-lg px-4 py-2 font-medium max-w-xs">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex">
                  <div className="bg-white border border-primary rounded-lg px-4 py-2 text-gray-900 max-w-xs">
                    {msg.content}
                  </div>
                </div>
              )
            )}
          </div>
          {/* Chat Input */}
          <div className="bg-white border-t border-gray-200 px-2 lg:px-6 py-4 flex justify-center items-center gap-1 sm:gap-3">
            <button className="flex items-center md:gap-2 px-2 md:px-4 py-2 rounded-full border border-primary text-primary bg-primary/10 hover:bg-primary/20 font-medium">
              <IoAttachOutline size={24} />
              Attach
            </button>
            <input
              className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-yellow-600"
              placeholder="Type message...."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button
              className="px-6 py-2 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <div>
        <button
          className="m-4 px-6 py-2 rounded-full bg-gradient-to-r flex items-center from-orange-500 to-amber-600 text-white font-medium hover:from-amber-500 hover:to-orange-500 duration-300 transition-all transform hover:scale-105 shadow-lg"
          onClick={makePayment}
        >
          Make Payment
        </button>
      </div>
    </div>
  );
};

export default Discussions;
