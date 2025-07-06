"use client";

import Link from "next/link";
import {
  Mail,
  AlertTriangle,
  PhoneCall,
  Smartphone,
  MailCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
      <div className="max-w-2xl w-full space-y-10">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">🆘 Help Center</h1>
          <p className="text-muted-foreground text-sm">
            Stuck somewhere or have a question? We’re here to help you.
          </p>
        </header>

        {/* Help Options */}
        <section className="grid gap-4 text-left">
          <HelpItem icon={<PhoneCall />} title="Call Us">
            <Link
              href="tel:+919302903537"
              className="text-primary underline underline-offset-2"
            >
              +91 93029 03537
            </Link>{" "}
            — Available 10 AM to 7 PM (IST)
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

          <HelpItem icon={<AlertTriangle />} title="Report a Bug">
            Found something broken? Let us know so we can fix it fast 🚀
          </HelpItem>
        </section>

        {/* Contact Button */}
        {/* Contact Button + Response Note */}
        <div className="flex flex-col items-center gap-1">
          <Link
            href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=csyadav0513@gmail.com&su=Support%20Needed%20for%20My%20Cafe&body=Hi%20Team%20Hungrr%2C%0A%0AI%20need%20assistance%20regarding%20my%20cafe%20on%20the%20Hungrr%20platform.%20Please%20help%20me%20with%20the%20following%20issue%3A%0A%0A%5BBriefly%20describe%20the%20issue%20here%5D%0A%0AThanks%2C%0A%5BYour%20Cafe%20Name%5D"
            target="_blank"
            className="inline-block"
          >
            <Button
              variant="outline"
              className="rounded-full px-6 py-2 text-sm flex items-center gap-2"
            >
              <MailCheck size={16} />
              <span>Contact Support</span>
            </Button>
          </Link>

          <p className="text-xs text-muted-foreground">
            We typically respond within 24 hours ⏳
          </p>
        </div>
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
    <div className="flex gap-4 items-start p-4 border rounded-lg hover:shadow-sm transition text-left">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div className="space-y-0.5">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
