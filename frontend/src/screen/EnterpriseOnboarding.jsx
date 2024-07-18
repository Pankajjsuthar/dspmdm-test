import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;


const steps = [
  {
    title: "Create an admin account",
    description:
      "Use your work email or personal email, whichever suits you. If choosing a personal email, select the last option 'Sign up with personal email'; otherwise, choose the first option.",
  },
  {
    title: "Click on 'Get Started'",
    description:
      "After selecting your email type, proceed by clicking the 'Get Started' button.",
  },
  {
    title: "Enter business name",
    description:
      "Write the business name carefully. Remember, this will also be your user ID for further processes in the solution.",
  },
  {
    title: "Fill out details",
    description:
      "Provide information for the data protection engineer and EU representative.",
  },
  {
    title: "Review information",
    description:
      "Double-check all the information you've entered for accuracy.",
  },
  {
    title: "Complete registration",
    description: "Submit your registration and wait for confirmation.",
  },
];

function EnterpriseOnboarding() {

  const [registrationUrl, setRegistrationUrl] = useState('');

  useEffect(() => {
    const fetchRegistrationUrl = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/signup-url`);
        setRegistrationUrl(response.data.url);
      } catch (error) {
        console.error('Error fetching registration URL:', error);
        // Handle error (e.g., show an error message to the user)
      }
    };

    fetchRegistrationUrl();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-white ">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">DSP - EMM Solutions</div>
          
          <nav>
            <ul className="flex space-x-6">
              
              <li>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
                >
                  Login
                </button>
              </li>
            </ul>
          </nav>
        </div>
        
      </header>

      <div className="max-w-4xl mx-auto py-12">
        <h2 className="text-3xl font-extrabold text-black-600 text-center mb-8">
          Enterprise Registration Process
        </h2>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Register Your Enterprise
            </h3>
            <p className="text-gray-600 mb-4">
              To begin the registration process, please click the button below.
              This will take you to a Google Cloud page where you can register
              your enterprise.
            </p>
            <a
              href={registrationUrl}
              target="_blank"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
            >
              Start Registration
            </a>
          </div>
        </div>

        {/* <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {index + 1}
              </div>
              <div className="ml-6 flex-grow">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h4>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="h-16 w-0.5 bg-blue-300 mx-auto my-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
 */}

        <div className="mt-16 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Ready to Manage Your Devices?
            </h3>
            <p className="text-gray-600 mb-6">
              On successfully completing the registration process! Your
              enterprise is now set up and ready to go. It's time to take
              control of your device management.
            </p>
            <p className="text-gray-600 mb-8">
              Click the button below to access your dashboard, where you can
              start managing your devices, set up policies, and explore all the
              powerful features our EMM solution has to offer.
            </p>
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="w-full bg-green-600 text-white px-6 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition duration-300 shadow-md"
            >
              Go to Dashboard
            </button>
          </div>
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

export default EnterpriseOnboarding;
