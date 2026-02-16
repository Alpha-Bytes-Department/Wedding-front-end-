interface DangerZoneProps {
  onDeleteAccount: () => void;
}

const DangerZone = ({ onDeleteAccount }: DangerZoneProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full border border-red-300 p-6">
      <h2 className="text-2xl font-primary font-bold text-gray-900 mb-6">
        Danger Zone
      </h2>
      <p className="text-gray-600 mb-6">
        Delete your account and all associated data. This action cannot be
        undone.
      </p>
      <button
        onClick={onDeleteAccount}
        className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
      >
        Delete Account
      </button>
    </div>
  );
};

export default DangerZone;
