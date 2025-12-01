import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LockIcon from "./assets/lock-icon.svg";
import MailIcon from "./assets/mail-icon.svg";
import OtpInput from "./components/opt-input/opt-input";

function App() {
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleComplete = useCallback((value: string) => {
    if (value === "123456") {
      setIsVerified(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      setOtp(value);
      if (error) {
        setError(false);
      }
    },
    [error]
  );

  const iconContainerVariants = {
    initial: { scale: 1 },
    bounce: {
      scale: [1, 1.2, 0.9, 1.1, 1],
      transition: {
        duration: 0.5,
        ease: "easeInOut" as const,
      },
    },
  };

  const iconVariants = {
    initial: { opacity: 0, scale: 0.5, rotate: -180 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.5, rotate: 180 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1d1d1f] p-5">
      <div className="bg-[#2d2d2f] flex flex-col rounded-2xl border border-[#3d3d3f] max-w-[400px] w-full shadow-[0_4px_24px_rgba(0,0,0,0.3)] p-2">
        <motion.div
          className="flex justify-center mb-6"
          variants={iconContainerVariants}
          initial="initial"
          animate={isVerified ? "bounce" : "initial"}
        >
          <div className="relative w-16 h-16">
            <AnimatePresence mode="wait">
              {isVerified ? (
                <motion.img
                  key="lock"
                  src={LockIcon}
                  alt="Lock"
                  className="w-16 h-16 absolute inset-0"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              ) : (
                <motion.img
                  key="mail"
                  src={MailIcon}
                  alt="Mail"
                  className="w-16 h-16 absolute inset-0"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <h1 className="text-[#f5f5f7] text-2xl font-semibold text-center mb-2">
          {isVerified ? "Verification Successful!" : "We've emailed you a verification code"}
        </h1>
        <p className="text-[#a1a1a6] text-sm text-center mb-8">
          {isVerified ? "Your code has been verified" : "Please enter the code we sent you below"}
        </p>

        <div className="mb-8 flex justify-center">
          <OtpInput
            length={6}
            value={otp}
            onChange={handleChange}
            onComplete={handleComplete}
            error={error}
            disabled={isVerified}
            autoFocus
            aria-describedby="otp-error otp-success"
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              id="otp-error"
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-[#ff3b30] text-sm text-center mb-4"
            >
              Invalid code. Please try again.
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isVerified && (
            <motion.p
              id="otp-success"
              role="status"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-[#30d158] text-sm text-center mb-4"
            >
              Code verified successfully!
            </motion.p>
          )}
        </AnimatePresence>

        <p className="text-[#a1a1a6] text-sm text-center mt-6">
          Didn't receive code?{" "}
          <motion.span
            className="text-[#0071e3] cursor-pointer"
            whileHover={{ textDecoration: "underline" }}
            onClick={() => {
              setOtp("");
              setError(false);
              setIsVerified(false);
            }}
          >
            Resend
          </motion.span>
        </p>
      </div>
    </div>
  );
}

export default App;
