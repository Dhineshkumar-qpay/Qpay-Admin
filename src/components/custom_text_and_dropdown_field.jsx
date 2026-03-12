import React from "react";
import "../styles/fields.css";

export function CustomTextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  maxLength,
  error = "",
}) {
  return (
    <div className="custom-text-field">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export function CustomDropdownField({
  label,
  options,
  value,
  onChange,
  error = "",
}) {
  return (
    <div className="custom-dropdown-field">
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        <option value="" defaultValue={"Select an option"}>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

export const CustomSearchField = ({ title, value, onChange }) => {
  return (
    <div className="custom-search-field">
      <label>{title}</label>
      <input
        type="text"
        placeholder="Search here ...."
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export function ToggleSwitch({ checked, onChange, label }) {
  return (
    <div className="toggle-wrapper">
      {label && <span className="toggle-label">{label}</span>}

      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
}
