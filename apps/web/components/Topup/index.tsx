"use client";
import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { DollarSign } from "lucide-react";
import Link from "next/link";

export default function TopupDialog() {
  return (
    <Link href="/topup">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center rounded-[4px]"
      >
        <DollarSign className="w-4 h-4 mr-2" />
        Top Up
      </Button>
    </Link>
  );
}
