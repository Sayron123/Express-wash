import type { Metadata } from "next";
import { Suspense } from "react";
import SiteBar from "@/components/SiteBar";
import SiteFooter from "@/components/SiteFooter";
import BookForm from "./BookForm";

export const metadata: Metadata = {
  title: "Book a free pickup · Express Wash",
  description: "Book a free laundry pickup anywhere in Novaliches, Quezon City. Choose a day and a three-hour slot.",
};

export default function BookPage() {
  return (
    <>
      <div className="page-body">
        <SiteBar />
        <main className="wrap">
          {/* The form reads ?kg= from the estimator on the home page. */}
          <Suspense fallback={<div className="min-h-[100svh]" />}>
            <BookForm />
          </Suspense>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
