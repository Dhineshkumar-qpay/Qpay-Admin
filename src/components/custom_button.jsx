import React from "react";
import "../styles/header.css";
function CustomButton({
  text = "Submit",
  isResetBtn = false,
  onClick,
  disabled = false,
}) {
  return (
    <button
      className={`custom-btn ${isResetBtn ? "reset-btn" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default CustomButton;
