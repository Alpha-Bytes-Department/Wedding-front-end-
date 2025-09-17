import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { CeremonyFormData, CeremonyData } from "./types";
import TabNavigation from "./components/TabNavigation";
import StepIndicator from "./components/StepIndicator";
import TypeStep from "./components/TypeStep";
import VowsStep from "./components/VowsStep";
import RitualsStep from "./components/RitualsStep";
import ScheduleStep from "./components/ScheduleStep";
import ReviewStep from "./components/ReviewStep";
import NavigationButtons from "./components/NavigationButtons";
import DraftTab from "./components/DraftTab";
import MyCeremonyTab from "./components/MyCeremonyTab";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import { useCeremonyApi } from "./hooks/useCeremonyApi";
import { GlassSwal } from "../../../utils/glassSwal";

const Ceremony = () => {
  const location = useLocation();
  const { user } = useAuth();
  const ceremonyApi = useCeremonyApi();

  const [activeTab, setActiveTab] = useState<"new" | "draft" | "my">("new");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tab = location.state?.tab;
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.state]);

  const [currentStep, setCurrentStep] = useState(1);
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({});

  // State for ceremonies and drafts - will be populated from API
  const [ceremonies, setCeremonies] = useState<CeremonyData[]>([]);
  const [drafts, setDrafts] = useState<CeremonyData[]>([]);

  // State to track if we're editing an existing ceremony
  const [editingCeremony, setEditingCeremony] = useState<CeremonyData | null>(
    null
  );

  // Fetch ceremonies when component mounts or user changes
  useEffect(() => {
    if (user?._id) {
      fetchUserCeremonies();
    }
  }, [user?._id]);

  const fetchUserCeremonies = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const userCeremonies = await ceremonyApi.getUserCeremonies(
        user._id,
        user.role
      );

      // Separate completed ceremonies from drafts (planned status)
      const completedCeremonies = userCeremonies.filter(
        (ceremony: CeremonyData) => ceremony.status !== "planned"
      );
      const draftCeremonies = userCeremonies.filter(
        (ceremony: CeremonyData) => ceremony.status === "planned"
      );

      setCeremonies(completedCeremonies);
      setDrafts(draftCeremonies);
    } catch (error: any) {
      console.error("Error fetching ceremonies:", error);
      await GlassSwal.error(
        "Error",
        error.message || "Failed to fetch ceremonies"
      );
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CeremonyFormData>({
    defaultValues: {
      title: "",
      ceremonyType: "Classic",
      description: "",
      vowsType: "Custom Vows",
      language: "English",
      rituals: "Unity candle",
      musicCues: "",
      vowDescription: "",
      ritualsDescription: "",
      eventDate: "",
      eventTime: "",
      location: "",
      rehearsalDate: "",
      officiantId: "",
      officiantName: "",
    },
  });

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDropdownSelect = (name: string, value: string) => {
    setValue(name as keyof CeremonyFormData, value);
    setOpenDropdowns((prev) => ({ ...prev, [name]: false }));
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Helper functions to format dates for form inputs
  const formatDateForInput = (date: string | Date | undefined): string => {
    if (!date) return "";

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const formatTimeForInput = (time: string | Date | undefined): string => {
    if (!time) return "";

    try {
      const timeObj = typeof time === "string" ? new Date(time) : time;
      return timeObj.toTimeString().split(" ")[0].slice(0, 5); // Returns HH:MM format
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  const startNewCeremony = () => {
    // Clear editing state
    setEditingCeremony(null);

    // Reset form to defaults
    setValue("title", "");
    setValue("description", "");
    setValue("ceremonyType", "Classic");
    setValue("vowsType", "Custom Vows");
    setValue("language", "English");
    setValue("vowDescription", "");
    setValue("rituals", "Unity candle");
    setValue("musicCues", "");
    setValue("ritualsDescription", "");
    setValue("eventDate", "");
    setValue("eventTime", "");
    setValue("location", "");
    setValue("rehearsalDate", "");
    setValue("officiantId", "");
    setValue("officiantName", "");

    // Reset to first step
    setCurrentStep(1);
    setActiveTab("new");
  };

  // Helper function to get current form values
  const getCurrentFormValues = (): CeremonyFormData => {
    return {
      title: watch("title"),
      description: watch("description"),
      ceremonyType: watch("ceremonyType"),
      vowsType: watch("vowsType"),
      language: watch("language"),
      vowDescription: watch("vowDescription"),
      rituals: watch("rituals"),
      musicCues: watch("musicCues"),
      ritualsDescription: watch("ritualsDescription"),
      eventDate: watch("eventDate"),
      eventTime: watch("eventTime"),
      location: watch("location"),
      rehearsalDate: watch("rehearsalDate"),
      officiantId: watch("officiantId"),
      officiantName: watch("officiantName"),
    };
  };

  // Validation function to check if all required fields are filled
  const validateFormForSubmission = (data: CeremonyFormData): string[] => {
    const missingFields: string[] = [];

    // Required fields for submission
    if (!data.title?.trim()) missingFields.push("Title");
    if (!data.description?.trim()) missingFields.push("Description");
    if (!data.ceremonyType?.trim()) missingFields.push("Ceremony Type");
    if (!data.vowsType?.trim()) missingFields.push("Vows Type");
    if (!data.language?.trim()) missingFields.push("Language");
    if (!data.eventDate?.trim()) missingFields.push("Event Date");
    if (!data.eventTime?.trim()) missingFields.push("Event Time");
    if (!data.location?.trim()) missingFields.push("Location");
   

    return missingFields;
  };

  const onSubmit = async (data: CeremonyFormData) => {
    if (!user?._id) {
      await GlassSwal.error("Error", "User not authenticated");
      return;
    }

    // Validate all required fields before submission
    const missingFields = validateFormForSubmission(data);
    if (missingFields.length > 0) {
      const fieldsList = missingFields.join(", ");
      await GlassSwal.error(
        "Incomplete Form",
        `Please fill in the following required fields: ${fieldsList}`
      );
      return;
    }

    try {
      setLoading(true);

      if (editingCeremony) {
        // Update existing ceremony and change status to completed
        const ceremonyId = editingCeremony._id || editingCeremony.id;
        if (!ceremonyId) {
          throw new Error("No ceremony ID found for update");
        }

        const ceremonyData = {
          ...data,
          status: "submitted" as const,
        };

        const updatedCeremony = await ceremonyApi.updateCeremony(
          ceremonyId,
          ceremonyData
        );

        // Remove from drafts and add to ceremonies
        setDrafts(
          drafts.filter(
            (draft) => draft._id !== ceremonyId && draft.id !== ceremonyId
          )
        );
        setCeremonies([...ceremonies, updatedCeremony]);

        await GlassSwal.success("Success", "Ceremony completed successfully!");
        setEditingCeremony(null);
      } else {
        // Create new ceremony with completed status
        const ceremonyData = {
          ...data,
          status: "completed" as const,
        };

        const newCeremony = await ceremonyApi.createCeremony(
          ceremonyData,
          user._id
        );

        setCeremonies([...ceremonies, newCeremony]);
        await GlassSwal.success("Success", "Ceremony created successfully!");
      }

      setActiveTab("my");
      setCurrentStep(1);
    } catch (error: any) {
      console.error("Error submitting ceremony:", error);
      await GlassSwal.error(
        "Error",
        error.message || "Failed to submit ceremony"
      );
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (data: CeremonyFormData) => {
    if (!user?._id) {
      await GlassSwal.error("Error", "User not authenticated");
      return;
    }

    try {
      setLoading(true);

      if (editingCeremony) {
        // Update existing ceremony
        const ceremonyId = editingCeremony._id || editingCeremony.id;
        if (!ceremonyId) {
          throw new Error("No ceremony ID found for update");
        }

        const updatedCeremony = await ceremonyApi.updateCeremony(
          ceremonyId,
          data
        );

        // Update the drafts list
        setDrafts(
          drafts.map((draft) =>
            draft._id === ceremonyId || draft.id === ceremonyId
              ? updatedCeremony
              : draft
          )
        );

        await GlassSwal.success("Success", "Draft updated successfully!");
      } else {
        // Create new ceremony with planned status (draft)
        const draftData = {
          ...data,
          status: "planned" as const,
        };

        const draftCeremony = await ceremonyApi.createCeremony(
          draftData,
          user._id
        );

        setDrafts([...drafts, draftCeremony]);
        await GlassSwal.success("Success", "Draft saved successfully!");
      }

      setActiveTab("draft");
    } catch (error: any) {
      console.error("Error saving draft:", error);
      await GlassSwal.error("Error", error.message || "Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (id: string) => {
    try {
      setLoading(true);

      const ceremonyId = id.startsWith("6")
        ? id
        : drafts.find((d) => d.id === id)?._id;
      if (!ceremonyId) {
        throw new Error("Draft not found");
      }

      await ceremonyApi.deleteCeremony(ceremonyId);

      setDrafts(drafts.filter((draft) => draft.id !== id && draft._id !== id));
      await GlassSwal.success("Success", "Draft deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting draft:", error);
      await GlassSwal.error("Error", error.message || "Failed to delete draft");
    } finally {
      setLoading(false);
    }
  };

  const continueDraft = (draft: CeremonyData) => {
    // Set the editing state
    setEditingCeremony(draft);

    // Populate form with draft data, formatting dates properly
    const formData: CeremonyFormData = {
      title: draft.title || "",
      description: draft.description || "",
      ceremonyType: draft.ceremonyType || "Classic",
      vowsType: draft.vowsType || "Custom Vows",
      language: draft.language || "English",
      vowDescription: draft.vowDescription || "",
      rituals: draft.rituals || "",
      musicCues: draft.musicCues || "",
      ritualsDescription: draft.ritualsDescription || "",
      eventDate: formatDateForInput(draft.eventDate),
      eventTime: formatTimeForInput(draft.eventTime),
      location: draft.location || "",
      rehearsalDate: formatDateForInput(draft.rehearsalDate),
      officiantId: draft.officiantId || "",
      officiantName: draft.officiantName || "",
    };

    Object.entries(formData).forEach(([key, value]) => {
      setValue(key as keyof CeremonyFormData, value);
    });

    setActiveTab("new");
    setCurrentStep(1);
  };

  const deleteCeremony = async (id: string) => {
    try {
      setLoading(true);

      const ceremonyId = id.startsWith("6")
        ? id
        : ceremonies.find((c) => c.id === id)?._id;
      if (!ceremonyId) {
        throw new Error("Ceremony not found");
      }

      await ceremonyApi.deleteCeremony(ceremonyId);

      setCeremonies(
        ceremonies.filter(
          (ceremony) => ceremony.id !== id && ceremony._id !== id
        )
      );
      await GlassSwal.success("Success", "Ceremony deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting ceremony:", error);
      await GlassSwal.error(
        "Error",
        error.message || "Failed to delete ceremony"
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Type", active: currentStep >= 1 },
    { number: 2, title: "Vows", active: currentStep >= 2 },
    { number: 3, title: "Rituals", active: currentStep >= 3 },
    { number: 4, title: "Schedule", active: currentStep >= 4 },
    { number: 5, title: "Review", active: currentStep >= 5 },
  ];

  return (
    <div className=" bg-white  lg:p-8">
      <div className="">
        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Loading indicator */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-center">Processing...</p>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "new" && (
          <div className="bg-white rounded-2xl shadow-lg border border-primary p-3 sm:p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
              <h1 className="text-3xl font-primary font-bold text-gray-900">
                {editingCeremony ? "Edit Ceremony" : "Ceremony Builder"}
              </h1>
              {editingCeremony && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  Editing: {editingCeremony.title || "Untitled"}
                </span>
              )}
            </div>

            <StepIndicator steps={steps} />

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Type */}
              {currentStep === 1 && (
                <TypeStep
                  register={register}
                  errors={errors}
                  watch={watch}
                  openDropdowns={openDropdowns}
                  onToggleDropdown={toggleDropdown}
                  onSelectDropdown={handleDropdownSelect}
                />
              )}

              {/* Step 2: Vows */}
              {currentStep === 2 && (
                <VowsStep
                  register={register}
                  watch={watch}
                  openDropdowns={openDropdowns}
                  onToggleDropdown={toggleDropdown}
                  onSelectDropdown={handleDropdownSelect}
                />
              )}

              {/* Step 3: Rituals */}
              {currentStep === 3 && (
                <RitualsStep
                  register={register}
                  watch={watch}
                  openDropdowns={openDropdowns}
                  onToggleDropdown={toggleDropdown}
                  onSelectDropdown={handleDropdownSelect}
                />
              )}

              {/* Step 4: Schedule */}
              {currentStep === 4 && (
                <ScheduleStep register={register} errors={errors} />
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && <ReviewStep watch={watch} />}

              {/* Navigation Buttons */}
              <NavigationButtons
                currentStep={currentStep}
                maxStep={5}
                onPrevStep={handlePrevStep}
                onNextStep={handleNextStep}
                onSaveDraft={() => handleSubmit(saveDraft)()}
                onSubmit={() => handleSubmit(onSubmit)()}
                isLoading={loading}
                isEditing={!!editingCeremony}
                validateForSubmission={() =>
                  validateFormForSubmission(getCurrentFormValues())
                }
              />
            </form>
          </div>
        )}

        {/* Draft Tab */}
        {activeTab === "draft" && (
          <DraftTab
            drafts={drafts}
            onContinueDraft={continueDraft}
            onDeleteDraft={deleteDraft}
            onCreateNew={startNewCeremony}
            loading={loading}
          />
        )}

        {/* My Ceremony Tab */}
        {activeTab === "my" && (
          <MyCeremonyTab
            ceremonies={ceremonies}
            onDeleteCeremony={deleteCeremony}
            onCreateNew={startNewCeremony}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default Ceremony;
