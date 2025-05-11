import { Metadata } from "next";
import LoginForm from "./components/LoginForm";

export const metadata: Metadata = {
  title: "ログイン | Achivo",
  description: "アカウントにログインしてください",
};

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <LoginForm />
      </div>
    </div>
  );
} 