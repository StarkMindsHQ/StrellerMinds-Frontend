import React from 'react';
import styled from 'styled-components';

const SignInButton = () => {
  return (
    <StyledWrapper>
      <button 
        className="button"
        type="button"
        aria-label="Sign in to your account"
      >
        <div className="text">Sign In</div> {/* Changed text from PRESS IN */}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Using Navbar colors */
  --navbar-bg: #5c0f49;
  --navbar-border: #dfb1cc;
  --navbar-text: #ffffff; /* Using white for better contrast on dark bg */
  --button-hover-bg: #4a0c3a; /* Slightly darker shade for hover */
  --button-active-bg: #38092b; /* Even darker for active */

  .button {
    background: transparent; /* Make background transparent initially */
    border-radius: 0.375rem; /* Tailwind's rounded-md */
    box-shadow: none; /* Remove initial complex shadow */
    border: 1px solid var(--navbar-border); /* Use navbar border color */
    cursor: pointer;
    font-size: 0.875rem; /* Tailwind's text-sm */
    padding: 0.5rem 1rem; /* Tailwind's px-4 py-2 equivalent */
    outline: none;
    transition: all 0.2s ease-in-out; /* Simplified transition */
    user-select: none;
  }

  .button:hover {
    background: var(--navbar-border); /* Use border color for hover background */
    box-shadow: none;
    .text {
       color: var(--navbar-bg); /* Change text color on hover */
    }
  }

  .button:active {
     background: var(--button-active-bg); /* Darker background on active */
     border-color: var(--button-active-bg);
     box-shadow: none;
     .text {
        transform: scale(0.95); /* Slight scale effect on active */
     }
  }

  .text {
    color: var(--navbar-border); /* Use navbar border color for text */
    font-weight: 500; /* Tailwind's font-medium */
    margin: auto;
    transition: all 0.2s ease-in-out;
    width: fit-content;
  }
`;

export default SignInButton;