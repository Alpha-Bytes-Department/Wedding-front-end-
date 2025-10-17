import { useEffect, useState } from "react";
import { useAuth } from "../../../../Component/Providers/AuthProvider";
import { useAxios } from "../../../../Component/Providers/useAxios";
import { FaStar } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import GlassSwal from "../../../../utils/glassSwal";

interface reviewProps {
  status: string;
  eventid?: string;
  officiantid?: string;
  eventName?: string;
}

interface Review {
  userId?: string;
  userImageUrl?: string;
  userName?: string;
  rating?: number;
  eventId?: string;
  ratingDescription?: string;
  officiantId?: string;
  eventName?: string;
  createdAt?: string;
  isVisible?: boolean;
}

const AddReview = ({
  status,
  eventid,
  officiantid,
  eventName,
}: reviewProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  //   console.log("user", user);
  const axios = useAxios();
  const [reviews, setReviews] = useState<Review>({});
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const fetchData = async () => {
    try {
      const response = await axios.get(`/reviews/public`);
      console.log("all data", response.data);
      const filteredReviews = response.data.reviews.filter(
        (review: Review) => review.eventId === eventid
      );
      setReviews(filteredReviews[0]);
      console.log("filtered data", filteredReviews[0]);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [axios, eventid, officiantid]);

  const formSubmit = async (data: any) => {
    setLoading(true);
    try {
      const reviewData = {
        userId: user?._id,
        userImageUrl: user?.profilePicture,
        userName: user?.name? user?.name : user?.partner_1,
        rating: data.rating,
        eventId: eventid,
        officiantId: officiantid || "not found",
        eventName: eventName,
        ratingDescription: data.ratingDescription,
      };
      console.log("review data", reviewData);
      const response = await axios.post("/reviews/create", reviewData);
      console.log("response", response);
      if (response.status === 201 || response.status === 200) {
        GlassSwal.fire({
          icon: "success",
          title: "Review Submitted",
        });
        (document.getElementById("addReview") as HTMLDialogElement).close();
      }

      reset();
      fetchData();
      setLoading(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      setLoading(false);
    }
  };

  return (
    <div className={` ${status === "completed" ? "block" : "hidden"}`}>
      {!reviews?.rating ? (
        <button
          onClick={() =>
            (
              document.getElementById("addReview") as HTMLDialogElement
            ).showModal()
          }
          disabled={loading}
          className="px-2 md:px-6 py-2 border border-primary text-[#e0b94c] rounded-full font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Add a feedback"}
        </button>
      ) : (
        <div className="px-2 md:px-6 py-2 border border-primary text-[#e0b94c] rounded-full font-medium hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="flex items-center gap-2"></div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`w-4 h-4 ${
                  star <= (reviews?.rating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <dialog id="addReview" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg text-center py-2 text-white rounded-full bg-amber-400">
            Add Your Review
          </h3>
          <form onSubmit={handleSubmit(formSubmit)} className="py-4">
            <h2 className="text-lg font-semibold text-center mb-2">
              Rate the Service
            </h2>
            <hr className=" border-t-2 mx-auto w-2/3 my-4 border-gray-500" />
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="cursor-pointer">
                  <input
                    type="radio"
                    value={star}
                    {...register("rating", { required: "Rating is required" })}
                    className="hidden"
                  />
                  <FaStar
                    className={`w-6 h-6 ${
                      star <= (watch("rating") || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </label>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <textarea
                {...register("ratingDescription", {
                  required: "Review description is required",
                })}
                className="textarea textarea-bordered w-full rounded-xl focus:outline-none"
                placeholder="Write your feedback..."
              />
              {(errors.ratingDescription || errors.rating) && (
                <span className="text-red-500">
                  {(errors.ratingDescription?.message as string) ||
                    (errors.rating?.message as string) ||
                    ""}
                </span>
              )}
            </div>
            <div className="modal-action">
              <button
                type="submit"
                className="btn rounded-full hover:bg-amber-400 hover:text-white text-black"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default AddReview;
