import { useState } from "react";
import LockIcon from "./assets/lock-icon.svg";
import MailIcon from "./assets/mail-icon.svg";

function App() {
  const [isVerified] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1d1d1f] p-5">
      <div className="bg-[#2d2d2f] rounded-2xl border border-[#3d3d3f] py-12 px-10 max-w-[400px] w-full shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <div className="flex justify-center mb-6">
          <img
            src={isVerified ? LockIcon : MailIcon}
            alt={isVerified ? "Lock" : "Mail"}
            className="w-16 h-16"
          />
        </div>
        <h1 className="text-[#f5f5f7] text-2xl font-semibold text-center mb-2">
          We've emailed you a verification code
        </h1>
        <p className="text-[#a1a1a6] text-sm text-center mb-8">
          Please enter the code we sent you below
        </p>
        <div className="flex gap-3 justify-center mb-8">
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              placeholder="0"
              className="w-12 h-14 rounded-xl border border-[#3d3d3f] bg-[#1d1d1f] text-[#f5f5f7] text-2xl text-center outline-none focus:border-[#0071e3] transition-colors placeholder:text-[#3d3d3f]"
            />
          ))}
        </div>
        <button className="w-full py-3.5 rounded-xl border-none bg-[#0071e3] text-white text-base font-medium cursor-pointer hover:bg-[#0077ed] transition-colors">
          Verify
        </button>
        <p className="text-[#a1a1a6] text-sm text-center mt-6">
          Didn't receive code?{" "}
          <span className="text-[#0071e3] cursor-pointer hover:underline">Resend</span>
        </p>
      </div>
    </div>
  );
}

export default App;
