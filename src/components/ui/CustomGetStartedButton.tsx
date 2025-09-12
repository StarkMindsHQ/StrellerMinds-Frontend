import React from 'react';

const CustomGetStartedButton = () => {
  return (
    <button 
      className="group relative flex h-11 cursor-pointer items-center overflow-hidden rounded-lg bg-[#5c0f49] px-5 pr-14 text-base font-medium tracking-wide text-[#dfb1cc] shadow-inner shadow-[#dfb1cc]/30 transition-all duration-300 ease-out hover:pr-5 hover:shadow-lg hover:shadow-[#dfb1cc]/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#5c0f49]"
      type="button"
      aria-label="Get started with StrellerMinds courses"
    >
      <span className="relative inline-block transition-all duration-300 ease-out group-hover:mr-10">
        Get started
      </span>
      <span className="absolute right-1 flex h-9 w-9 items-center justify-center rounded-md bg-[#dfb1cc] shadow-md shadow-[#5c0f49]/40 transition-all duration-300 group-hover:w-[calc(100%-0.75rem)]">
        <svg
          className="h-5 w-5 text-[#5c0f49] transition-transform duration-300 group-hover:translate-x-0.5"
          height={24}
          width={24}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  );
};

export default CustomGetStartedButton;