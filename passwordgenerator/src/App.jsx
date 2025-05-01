import { useState, useCallback } from "react";

function App() {
  const [password, setPassword] = useState("");
  const [passwordLength, setPasswordLength] = useState(6);
  const [allowNumbers, setAllowNumbers] = useState(false);
  const [allowSpecialChars, setAllowSpecialChars] = useState(false);

  const generatePassword = useCallback(() => {
    let pass = "";
    let str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (allowNumbers) str += "0123456789";
    if (allowSpecialChars) str += "!@#$%^&*()_+";

    for (let i = 1; i <= passwordLength; i++) {
      let charPosition = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(charPosition);
    }

    setPassword(pass);
  }, [passwordLength, allowNumbers, allowSpecialChars]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="flex flex-col gap-2 justify-center items-center bg-amber-500 p-5 rounded-lg shadow-lg">
        <h1 className="text-3xl text-white font-bold mb-3">
          Password Generator
        </h1>

        {/* Display Field */}
        <div className="border-2 border-amber-300 p-2 flex items-center gap-2">
          <input
            type="text"
            name="display"
            id="display1"
            placeholder="Generated Password"
            value={password}
            readOnly
            className="p-2 border border-gray-300 rounded-l-md focus:outline-none"
          />
          <button
            type="button"
            className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition"
            onClick={() => navigator.clipboard.writeText(password)}
          >
            Copy
          </button>
        </div>

        {/* Controls */}
        <div className="border-2 border-amber-300 p-2 flex gap-2 items-center">
          <input
            type="range"
            min="6"
            max="20"
            value={passwordLength}
            onChange={(e) => setPasswordLength(e.target.value)}
          />
          <label>Password Length: {passwordLength}</label>

          <input
            type="checkbox"
            checked={allowSpecialChars}
            onChange={() => setAllowSpecialChars((prev) => !prev)}
          />
          <label>Special Characters</label>

          <input
            type="checkbox"
            checked={allowNumbers}
            onChange={() => setAllowNumbers((prev) => !prev)}
          />
          <label>Numbers</label>
        </div>

        {/* Generate Button */}
        <button
          className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          onClick={generatePassword}
        >
          Generate Password
        </button>
      </div>
    </div>
  );
}

export default App;
