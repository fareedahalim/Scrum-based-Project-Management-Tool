import { useState, useEffect, useRef } from "react";
import {
    Mail,
    ShieldCheck,
    ArrowLeft,
    Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useResendOtp, useVerifyOtp, useVerifyResetOtp } from "../../hooks/Auth/AuthHooks";
import toast from "react-hot-toast";
import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../utils/errorHandler";
import { resendOtp } from "../../services/Auth/authService";

interface OTPModalProps {
    email: string;
    isOpen: boolean;
    onClose: () => void;
    purpose?: "signup" | "forgotPassword"
}

const OTPModal = ({
    email,
    isOpen,
    onClose,
    purpose = 'signup' 
}: OTPModalProps) => {
    const [otp, setOtp] = useState([
        "",
        "",
        "",
        ""
    ]);

    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const inputRefs = useRef<
        (HTMLInputElement | null)[]
    >([]);

    const { mutate: verifySignupOtp, isPending: isVerifySignup } = useVerifyOtp();
    const {mutate: verifyResetOtp, isPending: isVerifyingReset} = useVerifyResetOtp();
    const { mutate: resendOtp, isPending: isResend } = useResendOtp();

    const isVerifying = purpose === "signup" ? isVerifySignup : isVerifyingReset;
    const navigate = useNavigate();

    

    // Reset OTP when modal opens
    useEffect(() => {
        if (!isOpen) return;

        setOtp(["", "", "", ""]);
        setTimer(30);
        setCanResend(false);

        const timeout = setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 100);

        return () => clearTimeout(timeout);
    }, [isOpen]);

    // OTP timer
    useEffect(() => {
        if (!isOpen || timer <= 0) {
            if (timer === 0) {
                setCanResend(true);
            }

            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen, timer]);

   const handleVerify = () => {
  const otpValue = otp.join("");

  if (otpValue.length !== 4) return;

  const verifyFn =
    purpose === "signup"
      ? verifySignupOtp
      : verifyResetOtp;

  const successRoute =
    purpose === "signup"
      ? FRONTEND_ROUTES.LOGIN
      : FRONTEND_ROUTES.RESET_PASSWORD;

  verifyFn(
    {
      email,
      otp: otpValue,
    },
    {
      onSuccess: () => {
        toast.success("Verification successful!");

        navigate(successRoute, {
          state: {
            email,
            otp: otpValue,
          },
        });
      },

      onError: (error) => {
        toast.error(
          getErrorMessage(
            error,
            "Verification failed"
          )
        );
      },
    }
  );
};

    // UI-only resend
    const handleResend = () => {
        if (!canResend) return;
        resendOtp(
            {email}, {
                onSuccess: () => {
                    setTimer(30);
                    setCanResend(false);
                    toast.success("OTP resend successfully")
                },
                onError: (error) => {
                    toast.error(getErrorMessage(error, 'Failed to resend OTP'))
                }
            }
        )

        
    };

    // Handle OTP input
    const handleChange = (
        index: number,
        value: string
    ) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];

        newOtp[index] = value.slice(-1);

        setOtp(newOtp);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            e.key === "Backspace" &&
            !otp[index] &&
            index > 0
        ) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
    const handlePaste = (
        e: React.ClipboardEvent<HTMLInputElement>
    ) => {
        e.preventDefault();

        const pastedData = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 4);

        if (!pastedData) return;

        const newOtp = [...otp];

        pastedData.split("").forEach(
            (char, index) => {
                if (index < 4) {
                    newOtp[index] = char;
                }
            }
        );

        setOtp(newOtp);

        const nextIndex = Math.min(
            pastedData.length,
            3
        );

        inputRefs.current[nextIndex]?.focus();
    };

    if (!isOpen) return null;

    return (
        <div
            className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-slate-900/40
        backdrop-blur-sm
        p-4
        animate-in
        fade-in
        duration-300
      "
        >
            {/* MODAL CARD */}

            <div
                className="
          relative
          w-full
          max-w-[500px]
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-[0_20px_60px_rgba(37,99,235,0.15)]
          animate-in
          zoom-in-95
          duration-300
        "
            >
                {/* Blue → Purple top line */}

                <div
                    className="
            absolute
            left-0
            right-0
            top-0
            h-1
            bg-gradient-to-r
            from-blue-600
            via-violet-500
            to-purple-500
          "
                />

                {/* CONTENT */}

                <div className="px-8 pb-8 pt-8 sm:px-10 sm:pb-10">

                    {/* LOGO */}

                    <div className="flex justify-center">
                        <img
                            src="/logo.png"
                            alt="Nexora Logo"
                            className="h-14 w-auto object-contain"
                        />
                    </div>

                    {/* TITLE */}

                    <div className="mt-5 text-center">
                        <h2
                            className="
                text-2xl
                font-bold
                tracking-tight
                text-slate-900
              "
                        >
                            Verify OTP
                        </h2>

                        <p
                            className="
                mt-1.5
                text-sm
                text-slate-500
              "
                        >
                            We sent a 6-digit verification code
                            to your email
                        </p>
                    </div>

                    {/* EMAIL */}

                    <div
                        className="
              mx-auto
              mt-4
              flex
              w-fit
              items-center
              gap-2
              rounded-lg
              bg-blue-50
              px-3
              py-2
              text-xs
              font-semibold
              text-blue-600
            "
                    >
                        <Mail className="h-3.5 w-3.5" />

                        <span>{email}</span>
                    </div>

                    {/* OTP INPUTS */}

                    <div
                        className="
              mt-8
              flex
              justify-center
              gap-2
              sm:gap-3
            "
                    >
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                    handleChange(
                                        index,
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) =>
                                    handleKeyDown(index, e)
                                }
                                onPaste={handlePaste}
                                className="
                  h-12
                  w-10
                  rounded-lg
                  border
                  border-slate-200
                  bg-slate-50
                  text-center
                  text-xl
                  font-bold
                  text-slate-900
                  outline-none
                  transition-all
                  duration-200
                  focus:border-blue-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-blue-500/10
                  sm:h-14
                  sm:w-12
                  sm:text-2xl
                "
                            />
                        ))}
                    </div>

                    {/* VERIFY BUTTON */}

                    <Button
                        type="button"
                        onClick={handleVerify}
                        disabled={
                            isVerifySignup  ||
                            otp.join("").length !== 4
                        }
                        className="
              mt-8
              h-11
              w-full
              rounded-lg
              bg-blue-600
              font-semibold
              shadow-lg
              shadow-blue-600/20
              hover:bg-blue-700
              hover:shadow-blue-600/30
            "
                    >
                        {isVerifySignup  ? (
                            <div className="flex items-center gap-2">
                                <Loader2
                                    className="
                    h-4
                    w-4
                    animate-spin
                  "
                                />

                                <span>
                                    Verifying...
                                </span>
                            </div>
                        ) : (
                            "Verify OTP"
                        )}
                    </Button>

                    {/* RESEND */}

                    <div
                        className="
              mt-5
              text-center
              text-sm
            "
                    >
                        {canResend ? (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isResending}
                                className="
                  font-semibold
                  text-blue-600
                  transition-colors
                  hover:text-blue-700
                "
                            >
                                {isResending
                                    ? "Sending..."
                                    : "Resend OTP"}
                            </button>
                        ) : (
                            <span className="text-slate-500">
                                Resend OTP in{" "}
                                <span
                                    className="
                    ml-1
                    font-semibold
                    text-blue-600
                  "
                                >
                                    {timer}s
                                </span>
                            </span>
                        )}
                    </div>

                    {/* BACK TO LOGIN */}

                    <div className="mt-8 border-t border-slate-100 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="
                mx-auto
                flex
                items-center
                gap-2
                text-xs
                font-semibold
                uppercase
                tracking-widest
                text-slate-400
                transition-all
                hover:text-blue-600
              "
                        >
                            <ArrowLeft
                                className="
                  h-3.5
                  w-3.5
                  transition-transform
                  group-hover:-translate-x-1
                "
                            />

                            Back to Login
                        </button>
                    </div>

                    {/* SECURITY */}

                    <div
                        className="
              mt-6
              flex
              items-center
              justify-center
              gap-2
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-slate-400
            "
                    >
                        <ShieldCheck className="h-3.5 w-3.5" />

                        <span>
                            Your connection is secure and encrypted
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPModal;