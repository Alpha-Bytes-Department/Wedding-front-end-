import type { UseFormReturn } from "react-hook-form";
import { HiPencil } from "react-icons/hi";

interface SecurityFormProps {
  isEditingSecurity: boolean;
  setIsEditingSecurity: (value: boolean) => void;
  securityForm: UseFormReturn<any>;
  onSecuritySubmit: (data: any) => void;
  generateStrongPassword: () => void;
}

const SecurityForm = ({
  isEditingSecurity,
  setIsEditingSecurity,
  securityForm,
  onSecuritySubmit,
  generateStrongPassword,
}: SecurityFormProps) => {
  const togglePasswordVisibility = (inputId: string, e: React.MouseEvent) => {
    const btn = e.currentTarget as HTMLButtonElement;
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    if (!input) return;

    if (input.type === "password") {
      input.type = "text";
      btn.setAttribute("aria-pressed", "true");
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2l20 20" /><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-7 1.02-2.06 2.63-3.8 4.6-4.92" /><path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" /></svg>`;
    } else {
      input.type = "password";
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1.05 12a11 11 0 0 1 21.9 0 11 11 0 0 1-21.9 0z"/><circle cx="12" cy="12" r="3"/></svg>`;
    }
  };

  const eyeIconHtml = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1.05 12a11 11 0 0 1 21.9 0 11 11 0 0 1-21.9 0z"/><circle cx="12" cy="12" r="3"/></svg>`;

  const passwordInputClass = `w-full pr-12 px-4 py-3 border border-primary rounded-lg focus:outline-none ${
    !isEditingSecurity ? "bg-gray-50 cursor-not-allowed" : ""
  }`;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-primary p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-primary font-bold text-gray-900">
          Security
        </h2>
        <button
          type="button"
          onClick={() => setIsEditingSecurity(!isEditingSecurity)}
          className="p-2 text-gray-500 hover:text-primary transition-colors"
          title={isEditingSecurity ? "Cancel editing" : "Edit security"}
        >
          <HiPencil className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Old Password
          </label>
          <input
            id="oldPassword"
            {...securityForm.register("oldPassword")}
            type="password"
            disabled={!isEditingSecurity}
            className={passwordInputClass}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              {...securityForm.register("newPassword")}
              type="password"
              disabled={!isEditingSecurity}
              className={passwordInputClass}
            />
            {isEditingSecurity && (
              <button
                type="button"
                aria-label="Toggle new password visibility"
                className="absolute right-3 top-[38px] text-gray-500 hover:text-primary"
                onClick={(e) => togglePasswordVisibility("newPassword", e)}
                dangerouslySetInnerHTML={{ __html: eyeIconHtml }}
              />
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              {...securityForm.register("confirmPassword")}
              type="password"
              disabled={!isEditingSecurity}
              className={passwordInputClass}
            />
            {isEditingSecurity && (
              <button
                type="button"
                aria-label="Toggle confirm password visibility"
                className="absolute right-3 top-[38px] text-gray-500 hover:text-primary"
                onClick={(e) => togglePasswordVisibility("confirmPassword", e)}
                dangerouslySetInnerHTML={{ __html: eyeIconHtml }}
              />
            )}
          </div>
        </div>
        {isEditingSecurity && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              type="button"
              onClick={generateStrongPassword}
              className="px-6 py-2 border border-primary text-[#d38b47] rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Generate Strong Password
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Update Password
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SecurityForm;
