import { useNavigate } from "react-router-dom";
import SignupForm from "../../components/Auth/SignupForm";
import { useSignup } from "../../hooks/Auth/AuthHooks";
import type { SignupFormData } from "../../lib/validations/auth.schema";
import { useState } from "react";
import toast from "react-hot-toast";
import OTPModal from "../../components/modals/OtpModal";


const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || fallback;
  }
  return fallback;
};

const SignupPage = () => {

  const [isOtpModalOpen,setOtpModalOpen] = useState(false);
  const [userEmail,setUserEmail] = useState("")
  const navigate = useNavigate();

  const { mutate: signup, isPending } = useSignup();

  const handleSignup = (data: SignupFormData) => {
    signup(data, {
      onSuccess: () => {
        setUserEmail(data.email);
        setOtpModalOpen(true);
        toast.success('Otp sent successfully');
        console.log("Signup successful:", data.email);

       
      },
      onError: (error) => {
                toast.error(getErrorMessage(error, "Signup failed"));

        console.error("Signup failed:", error);
      },
    });
  };

  const handleSwitchToSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          -top-40
          h-96
          w-96
          rounded-full
          bg-blue-100/40
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-40
          h-96
          w-96
          rounded-full
          bg-purple-100/40
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-72
          w-72
          -translate-x-1/2
          rounded-full
          bg-violet-100/20
          blur-3xl
        "
      />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <SignupForm
          onSubmit={handleSignup}
          isLoading={isPending}
          onSwitchToSignIn={handleSwitchToSignIn}
        />
      </div>

      <OTPModal
      email= {userEmail}
      isOpen= {isOtpModalOpen}
      onClose= {() => setOtpModalOpen(false)}
      />
    </div>
  );
};

export default SignupPage;