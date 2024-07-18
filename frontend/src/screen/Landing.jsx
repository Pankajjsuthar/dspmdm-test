import React from "react";
import Dashboard_Image from "../images/dashboard.png";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">DSP - EMM Solutions</div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <button
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 transition duration-300 py-2"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  href="#how-it-works"
                  className="text-gray-600 hover:text-blue-600 transition duration-300 py-2"
                >
                  How It Works
                </button>
              </li>
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

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Simplify Your <span className="text-blue-600">Device Management</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Secure, efficient, and scalable Enterprise Mobility Management for
          modern businesses
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 inline-block"
        >
          Register Here
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Device Enrollment",
                desc: "Seamless onboarding with QR code support",
                icon: "📱",
              },
              {
                title: "Policy Management",
                desc: "Create and deploy custom policies effortlessly",
                icon: "🛡️",
              },
              {
                title: "App Control",
                desc: "Manage app installations and usage across devices",
                icon: "📦",
              },
              {
                title: "Remote Management",
                desc: "Control devices from anywhere, anytime",
                icon: "🌐",
              },
              {
                title: "Security Compliance",
                desc: "Ensure devices meet your security standards",
                icon: "🔒",
              },
              {
                title: "Reporting & Analytics",
                desc: "Gain insights with comprehensive reports",
                icon: "📊",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-blue-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            {[
              {
                title: "Enterprise Onboarding",
                desc: "Register your enterprise and get your unique ID",
              },
              {
                title: "Device Provisioning",
                desc: "Use our QR code to easily enroll devices",
              },
              {
                title: "Policy Creation",
                desc: "Set up custom policies tailored to your needs",
              },
              {
                title: "Device Management",
                desc: "Monitor and control your devices from the dashboard",
              },
            ].map((step, index) => (
              <div key={index} className="flex items-center mb-12">
                <div className="mr-8">
                  <div className="bg-white text-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-blue-100">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Your EMM Dashboard
          </h2>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
            <div className="bg-gray-200 rounded-xl h-80 mb-8 flex items-center justify-center">
              <img
                src={Dashboard_Image}
                alt="Dashboard Screenshot"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Device Overview",
                  desc: "Quick glance at all managed devices and their status",
                },
                {
                  title: "Policy Management",
                  desc: "Create and apply policies with a few clicks",
                },
                {
                  title: "App Control",
                  desc: "Manage app installations and deployments",
                },
                {
                  title: "Reporting and Analytics",
                  desc: "Access detailed insights and reports",
                },
              ].map((feature, index) => (
                <div key={index} className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section
        id="contact"
        className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Simplify Your Device Management?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Get in touch today and see how our EMM solution can transform your
            business
          </p>
          <form className="max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 mb-4 rounded-full text-gray-800"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-100 transition duration-300"
            >
              Request Demo
            </button>
          </form>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; Golden Sparrow LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
