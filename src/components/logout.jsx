import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../utils/app_routes";
import "../styles/logout.css";

export const LogoutComponent = ({ text = true }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setShowModal(false);
    navigate(AppRoutes.login);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <li className="logout-btn" onClick={() => setShowModal(true)}>
        <img
          src="https://cdn-icons-png.flaticon.com/128/10309/10309341.png"
          alt="Logout Icon"
          height={15}
          width={15}
        />
        {text && <span>Logout</span>}
      </li>

      {/* Logout Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="h2">LOGOUT</h2>
            <p className="p">Are you sure you want to logout?</p>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button className="confirm-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ConfirmationDialog = ({
  title = "",
  isOpen = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="h2">QPAY ADMIN</h2>
        <p className="p">{`Are you sure you want to delete this ${title}?`}</p>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>

          <button className="confirm-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
