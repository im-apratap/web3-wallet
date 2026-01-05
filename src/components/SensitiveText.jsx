import React, { useState } from "react";

/**
 * A component to conditionally show or hide sensitive text.
 * @param {object} props
 * @param {string} props.text The sensitive text to display/hide.
 * @param {string} [props.placeholder] The text to show when the content is hidden (defaults to asterisks).
 */
const SensitiveText = ({
  text,
  placeholder = "*************************************************",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <span className="sensitive-display">
        {isVisible ? text : placeholder}
      </span>
      <button className="btn-toggle" onClick={toggleVisibility}>
        {isVisible ? "Hide" : "Show"}
      </button>
    </>
  );
};

export default SensitiveText;
