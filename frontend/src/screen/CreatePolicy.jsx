import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL

function PolicyCreator() {
  const [enterpriseId, setEnterpriseId] = useState("");
  const [allowedApps, setAllowedApps] = useState([]);
  const [policyName, setPolicyName] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const availableApps = new Map([
    ["Amazon Flex", "com.amazon.flex.rabbit"],
    ["ADP Mobile Solutions", "com.adpmobile.android"],
    ["Mentor DSP by eDriving", "com.edriving.mentor.amazon"],
    ["Google Maps", "com.google.android.apps.maps"],
    ["Waze Navigation & Live Traffic", "com.waze"],
  ]);

  //
  // com.google.android.apps.maps
  // com.adpmobile.android
  // com.waze
  // com.edriving.mentor.amazon

  //   useEffect(() => {
  //     setAvailableApps(['App1', 'App2', 'App3', 'App4', 'App5']); // Example list
  //   }, []);

  const handleAppToggle = (app) => {
    setAllowedApps((prevApps) =>
      prevApps.includes(app)
        ? prevApps.filter((a) => a !== app)
        : [...prevApps, app]
    );
  };

  const handleSubmit = async (e) => {
    console.log(allowedApps);
    e.preventDefault();
    try {
      
      const policyResponse = axios.post(`${BASE_URL}/policy`, {
        enterpriseId,
        allowedApps,
      });
      const appliedPolicyResponse = await axios.post(`${BASE_URL}/apply-policy-all`, {
        enterpriseId,
        policyName: "masterpolicy",
      });

      console.log(policyResponse);
      console.log(appliedPolicyResponse);
      setMessage("Policy created and applied to all devices successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating or applying policy:", error);
      setMessage("Error creating or applying policy. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
        Update Policy
      </h2>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="enterpriseId"
            >
              Enterprise ID
            </label>
            <input
              className="w-full px-4 py-3 rounded-full text-gray-800 border border-gray-300 focus:outline-none focus:border-blue-600"
              id="enterpriseId"
              type="text"
              value={enterpriseId}
              onChange={(e) => setEnterpriseId(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="policyName"
            >
              Policy Name
            </label>
            <input
              className="w-full px-4 py-3 rounded-full text-gray-800 border border-gray-300 focus:outline-none focus:border-blue-600"
              id="policyName"
              type="text"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <h3 className="block text-gray-700 text-sm font-bold mb-2">
              Allowed Apps
            </h3>
            <div className="flex flex-col gap-4">
              {Array.from(availableApps.entries()).map(([appName, appId]) => (
                <label key={appId} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600"
                    checked={allowedApps.includes(appId)}
                    onChange={() => handleAppToggle(appId)}
                  />
                  <span className="ml-2 text-gray-700">{appName}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
              type="submit"
            >
              Create and Apply Policy
            </button>
          </div>
        </form>
        {message && (
          <p className="mt-6 text-center text-lg font-semibold text-green-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default PolicyCreator;
