import type {
  UseFormRegister,
  SubmitHandler,
  UseFormHandleSubmit,
  FieldErrors,
} from "react-hook-form";

export interface OfficiantFormData {
  name: string;
  contactNo: string;
  email: string;
  language: string;
  address: string;
  experience: string;
  speciality: string;
  profilePicture: FileList;
  portfolio: FileList;
}

interface OfficiantEnroleFormProps {
  register: UseFormRegister<OfficiantFormData>;
  handleSubmit: UseFormHandleSubmit<OfficiantFormData>;
  isSubmitting: boolean;
  errors: FieldErrors<OfficiantFormData>;
  onsubmit: SubmitHandler<OfficiantFormData>;
  reset: () => void;
}

const OfficiantEnroleForm = ({
  register,
  handleSubmit,
  isSubmitting,
  errors,
  onsubmit,
}: OfficiantEnroleFormProps) => {
  return (
    <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
      <h3 className="font-primary text-2xl font-bold text-center mb-6">
        Join Our Officiant Team
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            placeholder="Full Name"
            className="input input-bordered border-primary w-full focus:outline-primary"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">
              {errors.name.message as string}
            </span>
          )}
        </div>

        <div className="form-control">
          <input
            type="tel"
            {...register("contactNo", {
              required: "Contact number is required",
            })}
            placeholder="Contact Number"
            className="input input-bordered border-primary w-full focus:outline-primary"
          />
          {errors.contactNo && (
            <span className="text-red-500 text-sm">
              {errors.contactNo.message as string}
            </span>
          )}
        </div>

        <div className="form-control">
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Email Address"
            className="input input-bordered border-primary w-full focus:outline-primary"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">
              {errors.email.message as string}
            </span>
          )}
        </div>

        <div className="form-control">
          <input
            type="text"
            {...register("language", { required: "Languages are required" })}
            placeholder="Languages (comma separated)"
            className="input input-bordered border-primary w-full focus:outline-primary"
          />
          {errors.language && (
            <span className="text-red-500 text-sm">
              {errors.language.message as string}
            </span>
          )}
        </div>
      </div>

      <div className="form-control">
        <textarea
          {...register("address", { required: "Address is required" })}
          placeholder="Full Address"
          className="textarea textarea-bordered border-primary w-full focus:outline-primary h-20"
        />
        {errors.address && (
          <span className="text-red-500 text-sm">
            {errors.address.message as string}
          </span>
        )}
      </div>

      <div className="form-control">
        <textarea
          {...register("experience", {
            required: "Experience details are required",
          })}
          placeholder="Tell us about your experience"
          className="textarea textarea-bordered border-primary w-full focus:outline-primary h-32"
        />
        {errors.experience && (
          <span className="text-red-500 text-sm">
            {errors.experience.message as string}
          </span>
        )}
      </div>

      <div className="form-control">
        <textarea
          {...register("speciality", { required: "Speciality is required" })}
          placeholder="Your Specialities"
          className="textarea textarea-bordered border-primary w-full focus:outline-primary h-20"
        />
        {errors.speciality && (
          <span className="text-red-500 text-sm">
            {errors.speciality.message as string}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Profile Picture</span>
          </label>
          <input
            type="file"
            {...register("profilePicture", {
              required: "Profile picture is required",
            })}
            accept="image/*"
            className="file-input file-input-bordered border-primary w-full"
          />
          {errors.profilePicture && (
            <span className="text-red-500 text-sm">
              {errors.profilePicture.message as string}
            </span>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Portfolio PDF</span>
          </label>
          <input
            type="file"
            {...register("portfolio", { required: "Portfolio is required" })}
            accept=".pdf"
            className="file-input file-input-bordered border-primary w-full"
          />
          {errors.portfolio && (
            <span className="text-red-500 text-sm">
              {errors.portfolio.message as string}
            </span>
          )}
        </div>
      </div>

      <div className="modal-action">
        <button
          type="submit"
          className="btn bg-primary text-white hover:bg-primary/90 w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </form>
  );
};

export default OfficiantEnroleForm;
