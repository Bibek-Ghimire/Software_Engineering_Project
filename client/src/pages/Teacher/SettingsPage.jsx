import { useState } from "react";
import { Settings } from "lucide-react";

const SettingsPage = () => {
  const [name, setName] = useState("Bibek Ghimire");
  const [email, setEmail] = useState("bibek@example.com");

  const handleSave = () => {
    // TODO: Connect to backend API
    alert("Settings saved!");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Settings className="w-6 h-6 mr-2 text-orange-500" /> Settings
      </h2>
      <div className="bg-white rounded-xl shadow p-6 max-w-md space-y-4">
        <div>
          <label className="block text-gray-500 mb-1">Name</label>
          <input
            type="text"
            className="w-full border border-stone-200 rounded-xl p-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-500 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-stone-200 rounded-xl p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          onClick={handleSave}
          className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
