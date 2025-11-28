import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import type { CeremonyFormData, CeremonyData } from "./types";
import TabNavigation from "./components/TabNavigation";
import StepIndicator from "./components/StepIndicator";
import TypeStep from "./components/TypeStep";
import GreetingsStep from "./components/GreetingsStep";
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
import {
  CeremonyProvider,
  useCeremonyContext,
} from "./contexts/CeremonyContext";

const Ceremony = () => {
  const location = useLocation();
  const { user, setUser } = useAuth();
  const ceremonyApi = useCeremonyApi();
  const profileComplete =
    user?.name &&
    user?.partner_1 &&
    user?.partner_2 &&
    user?.contact?.partner_1 &&
    user?.contact?.partner_2 &&
    user?.location;
  const { groomName, brideName } = useCeremonyContext();
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
      fetchUserAgreement();
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

  const fetchUserAgreement = async () => {
    if (!user?._id) return;

    try {
      console.log("Fetching user agreement to get officiantId...");
      const response = await axios.get(`/agreements/user/${user._id}`);
      const agreement = response.data.agreement;

      if (agreement?.officiantId) {
        console.log(
          "Setting officiantId from agreement:",
          agreement.officiantId
        );
        setValue("officiantId", agreement.officiantId);
        if (agreement.officiantName) {
          setValue("officiantName", agreement.officiantName);
        }
      } else {
        console.warn("No agreement or officiantId found for user");
      }
    } catch (error: any) {
      console.error("Error fetching agreement:", error);
      // Don't show error to user - agreement might not exist yet
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
      description: "",
      // Greetings step defaults
      groomName: "",
      brideName: "",
      language: "",
      greetingSpeech: "",
      presentationOfBride: "",
      questionForPresentation: "",
      responseToQuestion: "",
      invocation: "",
      // Vows step defaults
      chargeToGroomAndBride: "",
      pledge: "",
      introductionToExchangeOfVows: "",
      vows: "",
      readings: "",
      introductionToExchangeOfRings: "",
      blessingsOfRings: "",
      exchangeOfRingsGroom: "",
      exchangeOfRingsBride: "",
      prayerOnTheNewUnion: "",
      // Rituals defaults
      ritualsSelection: "",
      ritualsOption: "",
      closingStatement: "",
      pronouncing: "",
      kiss: "",
      introductionOfCouple: "",
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
    if (currentStep < 6) {
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
    if (!data.description?.trim()) missingFields.push("Description");
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

      // Get names from form data or context
      const groom = data.groomName || groomName;
      const bride = data.brideName || brideName;

      if (editingCeremony) {
        // Update existing ceremony and change status to completed
        const ceremonyId = editingCeremony._id || editingCeremony.id;
        if (!ceremonyId) {
          throw new Error("No ceremony ID found for update");
        }

        const ceremonyData = {
          ...data,
          title: `${groom} & ${bride} Ceremony`,
          groomName: groom,
          brideName: bride,
          status: "submitted" as const,
        };

        console.log("Updating ceremony with data:", {
          ceremonyId,
          officiantId: ceremonyData.officiantId,
          status: ceremonyData.status,
        });

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

        // Reset AgreementAccepted in user context
        if (user) {
          const updatedUser = { ...user, AgreementAccepted: false };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        await GlassSwal.success(
          "Ceremony Submitted!",
          "Your ceremony has been submitted to the officiant. You'll need to complete a new agreement for future ceremonies."
        );
        setEditingCeremony(null);
      } else {
        // Create new ceremony with submitted status
        const ceremonyData = {
          ...data,
          title: `${groom} & ${bride} Ceremony`,
          groomName: groom,
          brideName: bride,
          status: "submitted" as const,
        };

        console.log("Creating new ceremony with data:", {
          userId: user._id,
          officiantId: ceremonyData.officiantId,
          status: ceremonyData.status,
        });

        const newCeremony = await ceremonyApi.createCeremony(
          ceremonyData,
          user._id
        );

        setCeremonies([...ceremonies, newCeremony]);

        // Reset AgreementAccepted in user context
        if (user) {
          const updatedUser = { ...user, AgreementAccepted: false };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        await GlassSwal.success(
          "Ceremony Submitted!",
          "Your ceremony has been submitted to the officiant. You'll need to complete a new agreement for future ceremonies."
        );
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

    // Get names from form data or context
    const groom = data.groomName || groomName;
    const bride = data.brideName || brideName;

    if (!groom || !bride) {
      await GlassSwal.error(
        "Missing Information",
        "Please provide both groom and bride names before saving a draft."
      );
      return;
    }

    try {
      setLoading(true);

      // Automatically generate title from the names
      const draftTitle = `${groom} & ${bride}'s Wedding Ceremony`;

      if (editingCeremony) {
        // Update existing ceremony
        const ceremonyId = editingCeremony._id || editingCeremony.id;
        if (!ceremonyId) {
          throw new Error("No ceremony ID found for update");
        }

        const draftData = {
          ...data,
          title: draftTitle,
          groomName: groom,
          brideName: bride,
          description: data.description || "Draft in progress",
        };

        const updatedCeremony = await ceremonyApi.updateCeremony(
          ceremonyId,
          draftData
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
          title: draftTitle,
          groomName: groom,
          brideName: bride,
          description: data.description || "Draft in progress",
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
      const result = await GlassSwal.confirm(
        "Are you sure?",
        "This action cannot be undone."
      );

      if (!result?.isConfirmed) {
        return;
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

      const result = await GlassSwal.confirm(
        "Are you sure?",
        "This action cannot be undone."
      );

      if (!result?.isConfirmed) {
        return;
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
    { number: 1, title: "Description", active: currentStep >= 1 },
    { number: 2, title: "Greetings", active: currentStep >= 2 },
    { number: 3, title: "Vows", active: currentStep >= 3 },
    { number: 4, title: "Rituals", active: currentStep >= 4 },
    { number: 5, title: "Schedule", active: currentStep >= 5 },
    { number: 6, title: "Review", active: currentStep >= 6 },
  ];

  if (user?.role !== "user") {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-primary font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <CeremonyProvider>
      <div className=" bg-white  lg:p-8">
        <div className="">
          {/* Tab Navigation */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Loading indicator */}
          {loading && (
            <div className="fixed inset-0 bg-[#2b252586] bg-opacity-50 flex items-center justify-center z-50">
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

                {/* Step 2: Greetings */}
                {currentStep === 2 && (
                  <GreetingsStep
                    register={register}
                    watch={watch}
                    openDropdowns={openDropdowns}
                    onToggleDropdown={toggleDropdown}
                    onSelectDropdown={handleDropdownSelect}
                  />
                )}

                {/* Step 3: Vows */}
                {currentStep === 3 && (
                  <VowsStep
                    register={register}
                    watch={watch}
                    openDropdowns={openDropdowns}
                    onToggleDropdown={toggleDropdown}
                    onSelectDropdown={handleDropdownSelect}
                  />
                )}

                {/* Step 4: Rituals */}
                {currentStep === 4 && (
                  <RitualsStep
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    openDropdowns={openDropdowns}
                    onToggleDropdown={toggleDropdown}
                    onSelectDropdown={handleDropdownSelect}
                  />
                )}

                {/* Step 5: Schedule */}
                {currentStep === 5 && (
                  <ScheduleStep
                    register={register}
                    errors={errors}
                    watch={watch}
                  />
                )}

                {/* Step 6: Review */}
                {currentStep === 6 && (
                  <ReviewStep watch={watch} setValue={setValue} />
                )}

                {/* Navigation Buttons */}
                {!profileComplete ? (
                  <div className="flex items-center gap-5 justify-center text-center py-1">
                    🚨⚠️
                    <p className="italic font-bold">
                      Profile Incomplete!! <br /> Please Complete Your Profile
                      to proceed.
                    </p>
                    🚨⚠️
                  </div>
                ) : !user?.AgreementAccepted ? (
                  <div className="flex items-center gap-5 justify-center text-center py-1">
                    🤝📜
                    <p className="italic font-bold">
                      Agreement Required!! <br /> Please Complete the Agreement
                      to proceed.
                    </p>
                    📜🤝
                  </div>
                ) : (
                  <NavigationButtons
                    currentStep={currentStep}
                    maxStep={6}
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
                )}
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
    </CeremonyProvider>
  );
};

export default Ceremony;
