/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { NAV_ITEMS } from "@/constants/navigation";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Get the current page title based on the pathname
  const getPageTitle = () => {
    const currentItem = NAV_ITEMS.find((item) => item.href === pathname);
    return currentItem ? currentItem.title : "Dashboard";
  };

  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center">
      <div className="container flex justify-between items-center h-full">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {isLoggedIn ? (
            <Button variant="ghost" onClick={handleLogout}>
              ログアウト
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => router.push("/login")}>
              ログイン
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
