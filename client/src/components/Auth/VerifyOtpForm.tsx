// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "react-hot-toast";
// import { useLocation, useNavigate } from "react-router-dom";

// import { Input } from "../ui/Input";
// import { Button } from "../ui/Button";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";

// // import {
// //   verifyResetOtpSchema,
// //   type VerifyResetOtpFormData,
// // } from "../../lib/validations/verifyResetOtp.schema";

// import { useVerifyResetOtp } from "../../hooks/Auth/AuthHooks";
// import { FRONTEND_ROUTES } from "../../constants/frontendRoutes";
// import { verifyResetOtpSchema, type VerifyResetOtpFormData } from "../../lib/validations/auth.verifyResetOtpSchema";

// const VerifyResetOtpForm = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const email = new URLSearchParams(
//     location.search
//   ).get("email");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<VerifyResetOtpFormData>({
//     resolver: zodResolver(verifyResetOtpSchema),
//     defaultValues: {
//       otp: "",
//     },
//     mode: "onTouched",
//   });

//   const {
//     mutate: verifyOtp,
//     isPending,
//   } = useVerifyResetOtp();

//   const onSubmit = (data: VerifyResetOtpFormData) => {
//     if (!email) {
//       toast.error("Email address is missing");
//       navigate(FRONTEND_ROUTES.FORGOT_PASSWORD);
//       return;
//     }

//     verifyOtp(
//       {
//         email,
//         otp: data.otp,
//       },
//       {
//         onSuccess: (response) => {
//           toast.success(
//             response?.message ||
//               "OTP verified successfully"
//           );

//           navigate(
//             `${FRONTEND_ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(
//               email
//             )}&otp=${encodeURIComponent(data.otp)}`,
//             {
//               replace: true,
//             }
//           );
//         },

//         onError: (error: any) => {
//           toast.error(
//             error?.response?.data?.message ||
//               "Invalid or expired OTP"
//           );
//         },
//       }
//     );
//   };

//   return (
//     <Card className="w-full max-w-[500px] rounded-2xl border border-slate-200 bg-white shadow-lg">
//       <CardHeader className="px-8 pb-4 pt-8 text-center">
//         <CardTitle className="flex justify-center">
//           <img
//             src="/logo.png"
//             alt="Nexora Logo"
//             className="h-14 w-auto object-contain"
//           />
//         </CardTitle>

//         <div className="mt-3">
//           <h1 className="text-2xl font-bold text-slate-900">
//             Verify OTP
//           </h1>

//           <p className="mt-2 text-sm text-slate-500">
//             Enter the 6-digit OTP sent to your email.
//           </p>
//         </div>
//       </CardHeader>

//       <CardContent className="px-8 pb-8">
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="space-y-5"
//         >
//           <div>
//             <label className="mb-1.5 block text-sm font-medium text-slate-700">
//               OTP
//             </label>

//             <Input
//               type="text"
//               inputMode="numeric"
//               maxLength={6}
//               placeholder="Enter 6-digit OTP"
//               {...register("otp")}
//             />

//             {errors.otp && (
//               <p className="mt-1 text-xs text-red-500">
//                 {errors.otp.message}
//               </p>
//             )}
//           </div>

//           <Button
//             type="submit"
//             isLoading={isPending}
//             className="h-11 rounded-lg bg-blue-600 hover:bg-blue-700"
//           >
//             {isPending
//               ? "Verifying..."
//               : "Verify OTP"}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default VerifyResetOtpForm;