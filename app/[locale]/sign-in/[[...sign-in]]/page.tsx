import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card border-border",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton:
                "bg-secondary border-border text-foreground hover:bg-secondary/80",
              formButtonPrimary: "bg-primary hover:bg-primary/90",
              footerActionLink: "text-primary hover:text-primary/90",
              formFieldInput: "bg-secondary border-border text-foreground",
              formFieldLabel: "text-muted-foreground",
              identityPreviewText: "text-muted-foreground",
              formResendCodeLink: "text-primary hover:text-primary/90",
            },
          }}
        />
      </div>
    </div>
  );
}
