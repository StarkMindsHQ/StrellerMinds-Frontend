import React from "react";
import Image from 'next/image';



const Contact = () => {
  return (
    <div>
      <section className="firstsec" style={{ width: "100%" }}>
        <Image src="/public/contacthead.svg" alt="aboutlandImage" />
      </section>
      <section className="bg-white text-gray-900 px-4 py-12">

      {/* Intro Text */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="rounded-xl bg-[#FFF8E7] color-[#6B4226] mb-10 w-1/4 mx-auto font-ubuntu">Contact</div>
        <h2 className="text-2xl md:text-3xl font-ubuntu text-amber-900 mb-3 color-[#6B4226]">We’d love to hear from you</h2>
        <p className="text-gray-600 text-base px-2 color-[#333333] font-EB-Garamond">
          We are here to help provide information on any query regarding our courses.
          We take pride in providing solutions and look forward to hearing from you.
        </p>
        <div className="my-6">
        <Image src="/public/contactLine.svg" alt="aboutlandImage" />
        </div>
      </div>

      {/* Form Section */}
      <div className="flex justify-center">
        <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-center text-amber-900 mb-6">Send us a message</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="tel"
              placeholder="+234 Phone Number"
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Company Name"
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Subject"
              className="md:col-span-2 border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <textarea
              placeholder="Message"
              rows="5"
              className="md:col-span-2 border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-red-500"
            ></textarea>

            <p className="md:col-span-2 text-sm text-gray-500">
              Your details will be safe and your personal data is stored as described in our{' '}
              <a className="text-red-600 underline" href="#">Privacy Policy</a>. You can opt out at any time.
            </p>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
              >
                Submit Message →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center border-t pt-10 max-w-5xl mx-auto">
        <div className="flex gap-4 items-center">
            <div>
            <Image src="/public/map-location-svgrepo-com 1.svg" alt="maplocatio" />
            </div>
        <div>
          <p className="font-semibold text-red-600">Location</p>
          <p className="text-sm text-gray-700 mt-2 text-left">
            1, Education Close, 2 & 3 Sewer Estate,<br />
            Off Anthony Ikorodu, Ikosi, Lagos, Nigeria
          </p>
        </div>
        </div>
        <div className="flex gap-4 items-center">
            <div>
            <Image src="/public/contactemail.svg" alt="mail" />
            </div>
        <div>
          <p className="font-semibold text-red-600">Email</p>
          <p className="text-sm text-gray-700 mt-2 text-left">
          <p className="text-sm text-gray-700 mt-2">info@seamsafrica.com</p>
          </p>
        </div>
        </div>
        <div className="flex gap-4 items-center">
            <div>
            <Image src="/public/phone-contact.svg" alt="num" />
            </div>
        <div>
          <p className="font-semibold text-red-600">Phone</p>
          <p className="text-sm text-gray-700 mt-2 text-left">
          <p className="text-sm text-gray-700 mt-2">
            +234 907-765-0334 (NG)<br />
            1-866-905-5355 (USA)
          </p>
          </p>
        </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default Contact;
