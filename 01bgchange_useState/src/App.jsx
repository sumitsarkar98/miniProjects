import { useState } from "react";
import Button from "./components/Button";

function App() {
  const [color, setColor] = useState("olive");

  return (
    <div
      className="w-full h-screen duration-200"
      style={{ backgroundColor: color }}
    >
      <div className="fixed flex flex-wrap justify-center bottom-12 inset-x-0 px-2">
        <div className="flex flex-wrap justify-center gap-3 shadow-lg bg-white px-3 py-2 rounded-2xl">
          <Button name="red" setColor={setColor} />
          <Button name="blue" setColor={setColor} />
          <Button name="green" setColor={setColor} />
          <Button name="yellow" setColor={setColor} />
          <Button name="purple" setColor={setColor} />
          <Button name="black" setColor={setColor} />
          <Button name="orange" setColor={setColor} />
          <Button name="pink" setColor={setColor} />
          <Button name="gray" setColor={setColor} />
          <Button name="brown" setColor={setColor} />
        </div>
      </div>
    </div>
  );
}

export default App;
