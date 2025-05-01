import React from "react";

function Button({ name, setColor }) {
  return (
    <button
      onClick={() => setColor(name)}
      className="outline-none px-4 py-2 rounded-full text-white shadow-2xl"
      style={{ backgroundColor: name }}
    >
      {name}
    </button>
  );
}

export default Button;
