import { Metadata } from "next";
import SignupForm from "./components/SignupForm";

export const metadata: Metadata = {
  title: "アカウント作成 | Achivo",
  description: "新しいアカウントを作成してください",
};

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <SignupForm />
      </div>
    </div>
  );
} 