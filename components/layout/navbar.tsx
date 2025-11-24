"use client";

import Link from "next/link";
import { TrafficCone } from "lucide-react"; // Using generic icon or import custom SVG
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        
        {/* Branding / Logo */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <TrafficCone className="h-6 w-6 text-orange-500" />
            <span className="hidden font-bold sm:inline-block text-foreground">
              Traffic Light
            </span>
          </Link>
        </div>

        {/* Navigation / Actions */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/signin" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {/* Upgrade plain text to a styled component if preferred, or keep as nav link */}
                  Sign In
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            {/* Primary CTA Variant */}
            <NavigationMenuItem className="ml-2">
               <Link href="/signin">
                <Button variant="default" size="sm" className="px-4">
                  Get Started
                </Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
      </div>
    </header>
  );
}