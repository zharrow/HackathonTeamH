import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-gray-900 border-gray-800",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton:
                "bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
              formButtonPrimary: "bg-[#6c47ff] hover:bg-[#5a3ae6]",
              footerActionLink: "text-[#6c47ff] hover:text-[#5a3ae6]",
              formFieldInput: "bg-gray-800 border-gray-700 text-white",
              formFieldLabel: "text-gray-300",
              identityPreviewText: "text-gray-300",
              formResendCodeLink: "text-[#6c47ff] hover:text-[#5a3ae6]",
            },
          }}
        />
      </div>
    </div>
  );
}
