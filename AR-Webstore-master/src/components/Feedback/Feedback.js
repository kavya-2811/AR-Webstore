import React, { useState } from "react";
import "./Feedback.css";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    liked: "",
    improve: "",
    features: "",
    comments: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Feedback Data:", formData);

    // DEMO SUCCESS (no email sending)
    setStatus("success");

    // Reset form
    setFormData({
      name: "",
      email: "",
      liked: "",
      improve: "",
      features: "",
      comments: "",
    });
  };

  return (
    <div className="feedback-container">
      <h1>Feedback 💬</h1>
      <p>Help us improve your experience</p>

      <form onSubmit={handleSubmit} className="feedback-form">

        <input
          type="text"
          id="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          id="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          id="liked"
          placeholder="What did you like?"
          value={formData.liked}
          onChange={handleChange}
        />

        <input
          type="text"
          id="improve"
          placeholder="Will AR improve your experience?"
          value={formData.improve}
          onChange={handleChange}
        />

        <input
          type="text"
          id="features"
          placeholder="Features you'd like"
          value={formData.features}
          onChange={handleChange}
        />

        <textarea
          id="comments"
          placeholder="Additional comments..."
          value={formData.comments}
          onChange={handleChange}
        />

        <button type="submit">Submit Feedback</button>

        {status === "success" && (
          <p className="success-msg">
            ✅ Feedback submitted successfully!
          </p>
        )}

      </form>
    </div>
  );
};

export default Feedback;