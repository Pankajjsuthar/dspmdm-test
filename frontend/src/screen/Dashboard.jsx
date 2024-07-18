import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import QRCode from "qrcode"; // Import the qrcode library

const BASE_URL = import.meta.env.VITE_BASE_URL

function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return new Date(dateString).toLocaleString("en-US", options);
}

function Dashboard() {
  const navigate = useNavigate();
  const [enterpriseName, setEnterpriseName] = useState("");
  const [enterpriseId, setEnterpriseId] = useState("");
  const [enrolledToken, setEnrolledToken] = useState("");
  const [qrCodePath, setQrCodePath] = useState("");
  const [devices, setDevices] = useState([]);

  const auth = getAuth();
  const db = getFirestore();

  const fetchDetails = async () => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // Fetch user data from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error("User document not found");
      }

      const userData = userDocSnap.data();
      setEnterpriseName(userData.enterpriseName);
      setEnrolledToken(userData.enrolledToken);
      setEnterpriseId(userData.enterpriseId);
      setQrCodePath(userData.QRcode);

      // Fetch devices using the enterpriseId from Firestore
      const devicesResponse = await axios.get(`${BASE_URL}/devices/${userData.enterpriseId}`);
      setDevices(devicesResponse.data);

    } catch (error) {
      console.error("Error fetching details:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const removeDevice = async (id) => {
    const newDevices = await axios.delete(
      `${BASE_URL}/device/${enterpriseId}/${id}`
    );
    console.log(newDevices);
    fetchDetails(); // Refresh the device list after removal
  };

  const downloadQR = async () => {
    try {
      const qrCodeData = qrCodePath;
      const canvas = document.createElement('canvas');
      await QRCode.toCanvas(canvas, JSON.stringify(qrCodeData), { width: 256 });

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrcode.png';

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">DSP - EMM Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl md:text-2xl font-semibold text-gray-800 mb-4">
              Enterprise Details
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              <span className="font-semibold">Name:</span> {enterpriseName}
            </p>
            <p className="text-sm md:text-base text-gray-600">
              <span className="font-semibold">ID:</span> {enterpriseId}
            </p>
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
              Enrollment Information
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-4">
              <span className="font-semibold">Enrollment Token:</span>{" "}
              {enrolledToken}
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={downloadQR}
                className="bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full hover:bg-blue-700 transition duration-300"
              >
                Download QR Code
              </button>
              <button
                onClick={() => {
                  navigate("/update_policy");
                }} // Empty onClick handler for now
                className="bg-green-600 text-white px-3 py-1 md:px-4 md:py-2 text-sm md:text-base rounded-full hover:bg-green-700 transition duration-300"
              >
                Update Policy
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Managed Devices
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Device Id</th>
                  <th className="px-4 py-2 text-left">Brand</th>
                  <th className="px-4 py-2 text-left">Policy Version</th>
                  <th className="px-4 py-2 text-left">Enrolled at</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {devices && devices.map((device) => (
                  <tr key={device.id} className="border-b">
                    <td className="px-4 py-2">
                      {device.name ? device.name.split("/").pop() : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {device.hardwareInfo?.brand +
                        "-" +
                        device.hardwareInfo?.hardware || "N/A"}
                    </td>
                    <td className="px-4 py-2">{device.appliedPolicyVersion}</td>
                    <td className="px-4 py-2">
                      {formatDate(device.enrollmentTime)}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() =>
                          removeDevice(device.name.split("/").pop())
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-300"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
