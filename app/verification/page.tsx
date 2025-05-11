"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiMail, FiArrowLeft } from "react-icons/fi";

export default function VerificationPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="flex justify-center items-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FiMail className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">メールを確認してください</h1>
            <p className="text-sm text-gray-500 mt-2">
              {email ? (
                <>
                  <span className="font-medium">{email}</span> 宛に確認メールを送信しました
                </>
              ) : (
                <>登録したメールアドレス宛に確認メールを送信しました</>
              )}
            </p>
          </div>

          <div className="p-4 bg-blue-50 text-blue-800 rounded-md text-sm">
            <p>メールに記載されているリンクをクリックして、アカウントを有効化してください。</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              メールが届かない場合は、迷惑メールフォルダを確認するか、別のメールアドレスで再度お試しください。
            </p>

            <div className="flex justify-center">
              <Link
                href="/login"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <FiArrowLeft className="h-4 w-4" />
                <span>ログインページに戻る</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 