import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CeremonyFormData } from "../types";

interface ScheduleStepProps {
  register: UseFormRegister<CeremonyFormData>;
  errors: FieldErrors<CeremonyFormData>;
}

const ScheduleStep = ({ register, errors }: ScheduleStepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Date
          </label>
          <input
            {...register("date", { required: "Date is required" })}
            type="date"
            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none  "
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Time
          </label>
          <input
            {...register("time", { required: "Time is required" })}
            type="time"
            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none  "
          />
          {errors.time && (
            <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
          )}
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Location
          </label>
          <input
            {...register("location", { required: "Location is required" })}
            type="text"
            placeholder="Venue or address"
            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none  "
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Rehearsal
          </label>
          <input
            {...register("rehearsal")}
            type="date"
            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none  "
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleStep;
