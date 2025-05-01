import { useState, useCallback } from "react";

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [characterAllowed, setCharacterAllowed] = useState(false);
  const [password, setPassword] = useState("");

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (numberAllowed) str += "0123456789";
    if (characterAllowed) str += "!@#$%^&*()_+";

    for (let i = 0; i < length; i++) {
      pass += str.charAt(Math.floor(Math.random() * str.length));
    }

    setPassword(pass);
  }, [length, numberAllowed, characterAllowed]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-3xl font-bold underline text-white text-center mb-4">
        Password Generator
      </h1>

      <div className="w-full max-w-md mx-auto shadow-md rounded-lg px-4 py-6 text-orange-500 bg-gray-700">
        {/* Password Display */}
        <div className="flex shadow rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            value={password}
            className="w-full px-4 py-2 text-white bg-gray-800 outline-none"
            placeholder="Generated password"
            readOnly
          />
          <button
            onClick={() => navigator.clipboard.writeText(password)}
            className="px-4 py-2 bg-orange-500 text-white font-bold"
          >
            Copy
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3">
          {/* Length Selector */}
          <div className="flex justify-between items-center">
            <label className="text-white">Length: {length}</label>
            <input
              type="range"
              min="4"
              max="20"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="cursor-pointer"
            />
          </div>

          {/* Options */}
          <div className="flex justify-between">
            <label className="text-white">
              <input
                type="checkbox"
                checked={numberAllowed}
                onChange={() => setNumberAllowed((prev) => !prev)}
              />{" "}
              Include Numbers
            </label>
            <label className="text-white">
              <input
                type="checkbox"
                checked={characterAllowed}
                onChange={() => setCharacterAllowed((prev) => !prev)}
              />{" "}
              Include Symbols
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={passwordGenerator}
            className="w-full py-2 bg-orange-600 text-white font-bold rounded-lg mt-4"
          >
            Generate Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
