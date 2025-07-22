"use client";

import React from 'react';

const ContactPage = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#7CA982] mb-4">Contact Us</h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We'd love to hear from you. Please fill out the form below or contact us via the information provided.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Our Office</h3>
              <p className="text-gray-700">Egypt</p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-2">Email</h3>
              <p className="text-gray-700 break-all">codix810@gmail.com</p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-2">Phone</h3>
              <p className="text-gray-700">+20 1010721434</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <form className="space-y-6">
              <div>
                <label className="block mb-1 font-semibold">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CA982]"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CA982]"
                  placeholder="Your Email"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Message</label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7CA982]"
                  placeholder="Your Message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-[#7CA982] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6b8f75] transition w-full sm:w-auto"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactPage;
