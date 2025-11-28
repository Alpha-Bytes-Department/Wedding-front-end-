import type {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";
import { useState } from "react";
import type { CeremonyFormData } from "../types";

interface ScheduleStepProps {
  register: UseFormRegister<CeremonyFormData>;
  errors: FieldErrors<CeremonyFormData>;
  watch: UseFormWatch<CeremonyFormData>;
}

const ScheduleStep = ({ register, errors, watch }: ScheduleStepProps) => {
  const eventDate = watch("eventDate");
  const [needsRehearsal, setNeedsRehearsal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Event Date
          </label>
          <input
            min={new Date().toISOString().split("T")[0]}
            {...register("eventDate", { required: "Date is required" })}
            // defaultValue={new Date().toISOString().split("T")[0]}
            type="date"
            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none  "
          />
          {errors.eventDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.eventDate.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            Event Time
          </label>
          <input
            {...register("eventTime", { required: "Time is required" })}
            type="time"
            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none  "
          />
          {errors.eventTime && (
            <p className="text-red-500 text-sm mt-1">
              {errors.eventTime.message}
            </p>
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
        <div className="col-span-1 lg:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={needsRehearsal}
              onChange={(e) => setNeedsRehearsal(e.target.checked)}
              className="w-5 h-5 text-primary border-2 border-primary rounded focus:ring-2 focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-lg font-semibold text-gray-900">
              Do you need a rehearsal?
            </span>
          </label>
        </div>
        {needsRehearsal && (
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Rehearsal Date
            </label>
            <input
              min={new Date().toISOString().split("T")[0]}
              max={eventDate || undefined}
              {...register("rehearsalDate")}
              type="date"
              className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none  "
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleStep;
