import { Link } from "react-router-dom";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useEffect, useState } from "react";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import { useForm } from "react-hook-form";
import { GlassSwal } from "../../../utils/glassSwal";

const Note = () => {
 
  interface note{
    id:string;
    title:string;
    from:string;
    date:string;
    content:string;
  }
  type Ceremony = {
    _id: string;
    name: string;
    title: string;
    date: string;
    officiant: string;
    complete: string;
    status: string;
  };
   interface NoteFormData {
     category: string;
     content: string;
   }
  const axios=useAxios()
  const [events,setEvents]=useState([])
  const [notes,setNotes]=useState<note[]>([])
  const {user}=useAuth()
  const { register, handleSubmit, formState: { errors },reset } = useForm();

  //  ============ gathering all events ================
  const getEvents=async()=>{
    try {
      const { data } = await axios.get(
        `/events/by-role/${user?._id}/${user?.role}`
      );
      setEvents(data.events.filter((event: Ceremony) => event.status === 'approved' || event.status === 'completed'))
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  // ============= get all note data ==============
  const getNotes=async()=>{
    try {
      const { data } = await axios.get(
        `/notes/forUser/${user?._id}`
      );
      const formattedNotes = data.map((note: any) => ({
        id: note._id,
        title: note.title,
        from: note.from_userName,
        date: new Date(note.createdAt).toLocaleDateString(),
        content: note.message,
      }));
      setNotes(formattedNotes);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEvents();
    getNotes();
  }, []);
  

  // ============= form handling ==============
 

  const onSubmit = (data: NoteFormData) => {
    // Find the selected event object by its _id
    const selectedEvent: Ceremony | undefined = events.find((event: Ceremony) => event._id === data.category);
    const noteData = {
      title: selectedEvent ? selectedEvent.title : "Untitled",
      message: data.content,
      from_userName: user?.name ?? user?.email,
      from_userId: user?._id,
      to_userId: selectedEvent?.officiantId ,
      related_to: selectedEvent?._id,
    };
    console.log(noteData);
    try {
      const response = axios.post('/notes/create', noteData);
      console.log(response);
      (document.getElementById("my_modal_4") as HTMLDialogElement).close();
      getNotes();
      reset();
      GlassSwal.success("Success", "Note created successfully");
    } catch (error) {
      GlassSwal.error("Error", "Failed to create note");
    }
    };

  // ============= handle delete note ==============
  const handleDelete = async (note: note) => {
    try {
      const result = await GlassSwal.confirm(
        "Are you sure?",
        "You won't be able to revert this!"
      );
      if (result.isConfirmed) {
        try {
          console.log("Deleting note with ID:", note.id);
          const response = await axios.delete(`/notes/delete/${note.id}`);
          console.log(response);
          await getNotes();
          GlassSwal.success("Success", "Note deleted successfully");
        } catch (error) {
          console.error(error);
          GlassSwal.error("Error", "Failed to delete note");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className=" min-h-screen  ">
      <h1 className="text-3xl md:text-4xl pb-5 lg:py-7 lg:text-start pl-8 text-center font-primary font-bold text-gray-900 ">
        Your Notes
      </h1>

      <div className="space-y-8">
        {notes.length>0?notes.map((note, idx) => (
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
              <button onClick={() => handleDelete(note)} className="px-6 py-2 border border-primary text-[#d3a646] rounded-full font-medium hover:bg-primary hover:text-white transition-colors">
                Delete
              </button>
             
            </div>
          </div>
        )):<p className="text-center text-gray-500">No notes available.</p>}
      </div>

      <div className="flex sticky bottom-7 justify-end mt-12 gap-4 max-w-4xl ">
        <Link
          to={"/dashboard/ceremony"}
          className="bg-primary text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
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
        </Link>
        <button
          onClick={() => (document.getElementById("my_modal_4") as HTMLDialogElement).showModal()}
          className="bg-white border border-primary text-[#D4AF37] cursor-pointer px-6 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
        >
          Create a note
        </button>
      </div>
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-center text-lg">Create a note</h3>
            <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a category</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message as string}</p>
              )}
              </div>
              
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Content
              </label>
              <textarea
                {...register("content", { required: "Content is required" })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your note content..."
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content.message as string}</p>
              )}
              </div>
              
              <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              >
              Create Note
              </button>
            </form>
            </div>

       
        </div>
      </dialog>
    </div>
  );
};

export default Note;
