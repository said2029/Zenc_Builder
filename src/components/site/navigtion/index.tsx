import { ModeToggle } from "@/components/global/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  user?: null | User;
};

const Navigtion = (props: Props) => {
  return (
    <div className="p-4 flex items-center justify-between relative">
      <aside className="flex items-center gap-1">
        <Image alt="" width={40} height={40} src={"./assets/plura-logo.svg"} />
        <span className="font-bold text-xl">Zenc.</span>
      </aside>
      <nav className="absolute left-0 right-0 mx-auto hidden md:block">
        <ul className="flex items-center justify-center gap-4">
          <li>
            <Link href={"#"}>Pricing</Link>
          </li>
          <li>
            <Link href={"#"}>About Us</Link>
          </li>
          <li>
            <Link href={"#"}>Ducmantion</Link>
          </li>
          <li>
            <Link href={"#"}>features</Link>
          </li>
        </ul>
      </nav>
      <aside className="cursor-pointer flex gap-1 z-30">
        <Link
          className="bg-primary rounded-lg p-2 px-4 text-white dark:text-gray-900"
          href={"/agency"}
        >
          Login
        </Link>
        <UserButton />
        <ModeToggle/>
      </aside>
    </div>
  );
};
export default Navigtion;
