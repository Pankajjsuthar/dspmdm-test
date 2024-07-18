import React, { useState } from "react";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();
  const db = getFirestore();

  // const enterpriseResponse = await axios.post(
  //     "http://localhost:3000/enterprise-details",
  //     {
  //       enterprise_token,
  //       signupUrlName,
  //     }
  //   );

  // Extract enterpriseToken from URL

  // useEffect(() => {
  //   if (enterpriseToken) {
  //     setEnterpriseRegistered(true);
  //   }
  // }, [enterpriseToken]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Authenticate user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get enterpriseToken from URL
      const urlParams = new URLSearchParams(window.location.search);
      const enterpriseToken = urlParams.get("enterpriseToken");

      // Fetch user data
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        console.log("User data:", userData);

        // Update enterpriseToken if present in URL
        if (enterpriseToken) {
          await setDoc(userDocRef, { enterpriseToken }, { merge: true });
          userData.enterpriseToken = enterpriseToken;
        }

        // Check if enterpriseId exists
        if (userData.enterpriseId) {
          // Navigate to dashboard if enterpriseId exists
          navigate("/dashboard");
        } else if (userData.signupName && userData.enterpriseToken) {
          // If enterpriseId is blank, use signupUrl and enterpriseToken
          try {
            const enterpriseResponse = await axios.post(
              `${BASE_URL}/enterprise-details`,
              {
                enterprise_token: userData.enterpriseToken,
                signupUrlName: userData.signupName,
              }
            );
            const enterpriseId = enterpriseResponse.name.split("/")[1];
            // Update user document with enterprise details
            await setDoc(userDocRef, {
              enterpriseId: enterpriseId,
              // Add any other relevant data from the response
            }, { merge: true });

            // Navigate to dashboard after updating enterprise details
            navigate("/dashboard");
          } catch (error) {
            console.error("Error fetching enterprise details:", error);
            setError("Failed to fetch enterprise details. Please try again.");
          }
        } else {
          setError("Enterprise registration incomplete. Please contact support.");
        }
      } else {
        console.log("No user data found");
        setError("User data not found. Please sign up.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            DSP - EMM Solutions
          </div>
          <button
            onClick={() => {
              navigate("/");
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
          >
            Home
          </button>
        </div>
      </header>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Login to your Enterprise Dashboard
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter your password"
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {loading ? "Processing..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
      <footer className="w-full bg-gray-800 text-white py-8 fixed bottom-0">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; Golden Sparrow LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Login;
