import React from "react";

function CustomLoadingindicator() {
  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "5px solid #06433e",
          borderRadius: "50%",
          borderTopColor: "#14b8a6",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default CustomLoadingindicator;
