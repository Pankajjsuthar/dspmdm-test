import React, { useState,useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL; 

function Signup() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [businessName, setBusinessName] = useState("");
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [registrationUrl, setRegistrationUrl] = useState("");
  // const [signupURL, setSignupURL] = useState("");
  // const navigate = useNavigate();

  // const allowedApps = [
  //   "com.amazon.flex.rabbit",
  //   "com.adpmobile.android",
  //   "com.edriving.mentor.amazon",
  //   "com.google.android.apps.maps",
  //   "com.waze",
  // ];

  // useEffect(() => {
  //   const fetchRegistrationUrl = async () => {
  //     try {
  //       const response = await axios.post(`${BASE_URL}/signup-url`);
  //       setRegistrationUrl(response.data.url);
  //       setSignupURL(response.data.name);
  //     } catch (error) {
  //       console.error("Error fetching registration URL:", error);
  //     }
  //   };
  
  //   fetchRegistrationUrl();
  // }, []);

  // const handleSignup = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {

      // const response = await axios.get("http://localhost:3000/enterprises");

      // console.log(response);
      // const matchingEnterprise = response.data.enterprises.find(
      //   (enterprise) =>
      //     enterprise.enterpriseDisplayName.toLowerCase() ===
      //     businessName.toLowerCase()
      // );

      // const enterpriseId = matchingEnterprise.name.split("/")[1];

      // Create default policy
      // await axios.post("http://localhost:3000/policy", {
      //   enterpriseId,
      //   allowedApps,
      // });

      // const enrolledToken = await axios.post(
      //   "http://localhost:3000/enrollment-token",
      //   { 
      //     enterpriseId,
      //     policyName : "masterPolicy"
      //    }
      // );

  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     const user = userCredential.user;
      
     
  //     console.log(enrolledToken);

  //     setDoc(doc(db, "users", user.uid), {
  //       email: user.email,
  //       enterpriseName: businessName,
  //       // enterpriseId: enterpriseId,
  //       // enrolledToken: enrolledToken.data.enrollmentToken.value,
  //       // QRcode: enrolledToken.data.enrollmentToken.qrCode,
  //       createdAt: new Date(),
  //     });

  //     navigate("/login");
  //   } catch (error) {
  //     console.log(error);
  //     setError("Error while Sign-Up");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registrationUrl, setRegistrationUrl] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user details in Firestore
      
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        enterpriseName: businessName,
        enterpriseID : "",
        createdAt: new Date(),
      });

      // Generate signup URL
      const response = await axios.post(`${BASE_URL}/signup-url`);
      const signupUrl = response.data.url;
      setRegistrationUrl(signupUrl);
      const signupName = response.data.name;

      // Update user document with signup URL
      await setDoc(doc(db, "users", user.uid), { signupName }, { merge: true });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setError("Error while Sign-Up");
      setLoading(false);
    }
  };

  if (registrationUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Complete Your Registration</h2>
          <p className="mb-6">Please click the link below to complete your registration:</p>
          <a
            href={registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 inline-block"
          >
            Complete Registration
          </a>
        </div>
      </div>
    );
  }


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
            Create your Enterprise Account
          </h2>
          <form onSubmit={handleSignup}>
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
            <div className="mb-4">
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
            <div className="mb-6">
              <label
                htmlFor="businessName"
                className="block text-gray-700 mb-2"
              >
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter your business name"
              />
            </div>
          
            {/* <div className="mb-6">
              <h3 className="block text-gray-700 mb-2">
                Allowed Apps for Default Policy
              </h3>
              <div className="space-y-2">
                {Array.from(availableApps.entries()).map(([appName, appId]) => (
                  <label key={appId} className="flex items-center">
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
            </div> */}
              {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
              disabled={loading}
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Login here
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
export default Signup;