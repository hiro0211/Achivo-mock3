/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { NAV_ITEMS } from "@/constants/navigation";
import { Button } from "@/components/ui/button";
import { useAuth, useLogout } from "@/lib/hooks/use-auth";
import { Loader2 } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();
  const { logout, loading: logoutLoading } = useLogout();

  // Get the current page title based on the pathname
  const getPageTitle = () => {
    const currentItem = NAV_ITEMS.find((item) => item.href === pathname);
    return currentItem ? currentItem.title : "Dashboard";
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center">
      <div className="container flex justify-between items-center h-full">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {userLoading ? (
            <Button variant="ghost" disabled>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              読み込み中...
            </Button>
          ) : user ? (
            <Button variant="ghost" onClick={logout} disabled={logoutLoading}>
              {logoutLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ログアウト中...
                </>
              ) : (
                "ログアウト"
              )}
            </Button>
          ) : (
            <Button variant="ghost" onClick={handleLogin}>
              ログイン
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
