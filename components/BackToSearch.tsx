
"use client";

import { useRouter } from "next/navigation";
import { MoveLeftIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function BackToSearch() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between pt-8">
      <Button
        type="button"
        onClick={() => {
          if (window.history.length > 1) {
            router.back();
          } else {
            router.push("/workers");
          }
        }}
        className="flex items-center gap-2 group"
      >
        <MoveLeftIcon className="h-4 w-4 text-[#B8924A] transition-transform group-hover:-translate-x-1" />

        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B8924A]">
          Back
        </span>
      </Button>

      <span className="text-[10px] uppercase tracking-[0.2em] text-[#807969]">
        Detailed View
      </span>
    </div>
  );
}
