"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { Github } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("signUp");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signUp.email({
        email,
        password,
        name,
      });
      toast.success(t("signUpSuccess"));
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error(t("signUpError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignUp = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("GitHub sign up error:", error);
      toast.error(t("signUpError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Button
              variant="outline"
              onClick={handleGitHubSignUp}
              disabled={isLoading}
              className="w-full"
            >
              <Github className="mr-2 h-4 w-4" />
              {t("signInWithGithub")}
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("orContinueWith")}
              </span>
            </div>
          </div>
          <form onSubmit={handleSignUp} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("nameLabel")}</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t("passwordLabel")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("signingUp") : t("signUpButton")}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            {t("alreadyHaveAccount")}{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              {t("signInLink")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
