import { useState } from "react";
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

const Ceremony = () => {
  const [activeTab, setActiveTab] = useState<"new" | "draft" | "my">("new");
  const [currentStep, setCurrentStep] = useState(1);
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean;
  }>({});

  // Mock data for demonstrations
  const [ceremonies, setCeremonies] = useState<CeremonyData[]>([
    {
      id: "1",
      title: "Garden Vows-Sunset",
      type: "Classic",
      description: "A beautiful sunset ceremony in the garden",
      vowsType: "Custom Vows",
      language: "English",
      rituals: "Unity candle",
      musicCue: "A Thousand Years - Piano",
      notes: "Notes about the ceremony",
      date: "2024-08-12",
      time: "18:00",
      location: "Garden Venue",
      rehearsal: "2024-08-11",
      status: "completed",
      createdAt: "Aug 12, 2024",
      updatedAt: "Aug 12, 2024",
    },
  ]);

  const [drafts, setDrafts] = useState<CeremonyData[]>([
    {
      id: "2",
      title: "Beach Wedding",
      type: "Modern",
      description: "Incomplete beach ceremony",
      vowsType: "Prepared Script",
      language: "English",
      rituals: "Sand ceremony",
      musicCue: "",
      notes: "",
      date: "",
      time: "",
      location: "Beach Resort",
      rehearsal: "",
      status: "draft",
      createdAt: "Aug 20, 2024",
      updatedAt: "Aug 22, 2024",
    },
  ]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CeremonyFormData>({
    defaultValues: {
      title: "",
      type: "Classic",
      description: "",
      vowsType: "Custom Vows",
      language: "English",
      rituals: "Unity candle",
      musicCue: "",
      notes: "",
      date: "",
      time: "",
      location: "",
      rehearsal: "",
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

  const onSubmit = (data: CeremonyFormData) => {
    const newCeremony: CeremonyData = {
      ...data,
      id: Date.now().toString(),
      status: "completed",
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
    };
    console.log("Finalized Ceremony Data:", newCeremony);
    setCeremonies([...ceremonies, newCeremony]);
    setActiveTab("my");
    // Reset form
    setCurrentStep(1);
  };

  const saveDraft = (data: CeremonyFormData) => {
    const draftCeremony: CeremonyData = {
      ...data,
      id: Date.now().toString(),
      status: "draft",
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
    };
    setDrafts([...drafts, draftCeremony]);
    setActiveTab("draft");
  };

  const deleteDraft = (id: string) => {
    setDrafts(drafts.filter((draft) => draft.id !== id));
  };

  const continueDraft = (draft: CeremonyData) => {
    // Populate form with draft data
    Object.keys(draft).forEach((key) => {
      if (
        key !== "id" &&
        key !== "status" &&
        key !== "createdAt" &&
        key !== "updatedAt"
      ) {
        setValue(
          key as keyof CeremonyFormData,
          draft[key as keyof CeremonyFormData]
        );
      }
    });
    setActiveTab("new");
    setCurrentStep(1);
  };

  const deleteCeremony = (id: string) => {
    setCeremonies(ceremonies.filter((ceremony) => ceremony.id !== id));
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

        {/* Tab Content */}
        {activeTab === "new" && (
          <div className="bg-white rounded-2xl shadow-lg border border-primary p-3 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-primary font-bold text-gray-900 mb-8">
              Ceremony Builder
            </h1>

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
                onSaveDraft={handleSubmit(saveDraft)}
                onSubmit={handleSubmit(onSubmit)}
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
            onCreateNew={() => setActiveTab("new")}
          />
        )}

        {/* My Ceremony Tab */}
        {activeTab === "my" && (
          <MyCeremonyTab
            ceremonies={ceremonies}
            onDeleteCeremony={deleteCeremony}
            onCreateNew={() => setActiveTab("new")}
          />
        )}
      </div>
    </div>
  );
};

export default Ceremony;
