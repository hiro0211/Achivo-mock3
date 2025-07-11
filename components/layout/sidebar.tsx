"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dynamic from "next/dynamic";

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

const LucideIcon = dynamic(
  () =>
    import("lucide-react").then((mod) => {
      const Component = ({ name, ...props }: LucideIconProps) => {
        const Icon = (mod as any)[name];
        return Icon ? <Icon {...props} /> : null;
      };

      Component.displayName = "LucideIcon";
      return Component;
    }),
  { ssr: false }
);

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "border-r bg-card text-card-foreground h-screen flex flex-col transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="p-4 flex items-center justify-between h-14 border-b">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center">
            <span className="font-bold text-xl tracking-tight text-primary">
              Achivo
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("ml-auto", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <div
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href &&
                      "bg-accent text-accent-foreground font-medium",
                    collapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <LucideIcon name={item.icon} className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t mt-auto">
        <div
          className={cn("flex items-center", collapsed ? "justify-center" : "")}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User avatar"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">John Doe</p>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon">
              <Settings size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
