"use client";

import Link from "next/link";
import { Button } from "./Button";
import { signIn, signOut, useSession } from "next-auth/react";

export function NavBar() {
  const { data } = useSession();

  return (
    <div>
      <nav className="border-b border-gray-200 bg-transparent shadow-md">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
          <Link href="/">
            <span className="text-2xl font-semibold bg-gradient-to-b from-blue-300 to-purple-600 bg-clip-text text-transparent">
              Stream Bits
            </span>
          </Link>
          <div className="hidden w-full md:block md:w-auto">
            {data?.user ? (
              <div className="flex">
                <div>
                  <Link href="/upload">
                    <Button>Upload</Button>
                  </Link>
                  <Button handleClick={async () => await signOut()}>
                    Sign Out
                  </Button>
                </div>
                <div className="m-3">
                  <p className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shadow-md dark:text-white text-black">
                    {data.user.email![0].toUpperCase()}
                  </p>
                </div>
              </div>
            ) : (
              <Button handleClick={async () => await signIn()}>SignIn</Button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
