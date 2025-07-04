"use client";

import Link from "next/link";
import {
  MessageCircleQuestion,
  Mail,
  LifeBuoy,
  AlertTriangle,
  PhoneCall,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HelpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">🆘 Help Center</h1>
          <p className="text-muted-foreground text-sm">
            Need help? You’re in the right place!
          </p>
        </header>

        {/* Support Options */}
        <section className="grid gap-4 text-left">
          <HelpItem icon={<PhoneCall />} title="Call Us">
            <Link
              href="tel:+919406604745"
              className="text-primary underline underline-offset-2"
            >
              +91 9302903537
            </Link>{" "}
            — 10 AM to 7 PM (IST)
          </HelpItem>

          <HelpItem icon={<Smartphone />} title="WhatsApp Support">
            <Link
              href="https://wa.me/919406604745"
              target="_blank"
              className="text-primary underline underline-offset-2"
            >
              Chat with us on WhatsApp 💬
            </Link>
          </HelpItem>

          <HelpItem icon={<Mail />} title="Email Us">
            <Link
              href="mailto:csyadav0513@gmail.com"
              className="text-primary underline underline-offset-2"
            >
              csyadav0513@gmail.com
            </Link>
          </HelpItem>

          <HelpItem icon={<AlertTriangle />} title="Report a Problem">
            Found a bug or glitch? Help us improve by reporting it!
          </HelpItem>
        </section>

        {/* Contact Button */}
        <Link href="mailto:csyadav0513@gmail.com" target="_blank">
          <Button variant="outline" className="rounded-full px-6 py-2 text-sm">
            ✉️ Contact Support
          </Button>
        </Link>

        <p className="text-xs text-muted-foreground mt-3">
          You’ll usually hear from us within  hours ⏳
        </p>
      </div>
    </div>
  );
}

function HelpItem({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 items-start p-4 border rounded-lg hover:shadow transition text-left">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
