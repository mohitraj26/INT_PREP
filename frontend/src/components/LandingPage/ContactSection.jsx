import { useState } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// 1. Replace this with your Google Form's /formResponse URL (not /viewform)
const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSe5LbrSkxYm9cEHy97PTYyBYe3jbuk8JzrHrJ_nBXkXUBgUpQ/formResponse";

// 2. Replace these with your actual Google Form field entry IDs
const FIELD_NAME = "entry.1234567890";     // <-- Replace with your Name field's entry ID
const FIELD_EMAIL = "entry.2345678901";    // <-- Replace with your Email field's entry ID
const FIELD_MESSAGE = "entry.3456789012";  // <-- Replace with your Message field's entry ID

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for Google Form
    const data = new FormData();
    data.append(FIELD_NAME, formData.name);
    data.append(FIELD_EMAIL, formData.email);
    data.append(FIELD_MESSAGE, formData.message);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        mode: "no-cors",
        body: data,
      });
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 w-full min-h-screen">
      <Toaster />
      <div className="w-full mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Contact & Support</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Have questions? Need help? We're here to support your learning journey.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-white text-xl font-semibold mb-2">Send us a message</h3>
            <p className="text-slate-300 mb-6">We'll get back to you within 24 hours</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 rounded-md transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Email Support</h3>
                  <p className="text-slate-300">support@intprep.com</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Live Chat</h3>
                  <p className="text-slate-300">Available 24/7</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Phone Support</h3>
                  <p className="text-slate-300">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
