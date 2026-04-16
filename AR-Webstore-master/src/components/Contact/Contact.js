import React from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="err-container">
      <h1>Let's Connect and Revolutionize E-commerce 👩‍💻</h1>
      <h2>
        Reach out to Kavya 👩 at{" "}
        <Link
          to="https://www.linkedin.com/in/kavya-dev-profile"
          target="_blank"
        >
          LinkedIn
        </Link>{" "}
        and{" "}
        <Link to="mailto:kavya.dev@example.com" target="_blank">
          kavya.dev@example.com
        </Link>
      </h2>
    </div>
  );
};

export default Contact;