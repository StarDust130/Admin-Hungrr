import {
  Building,
  ImageIcon,
  Home,
  Landmark,
  CheckCircle,
} from "lucide-react";
import { Step } from "./types";

export  const STEPS: Step[] = [
    {
      id: 1,
      name: "Welcome",
      title: "Let's Get Started",
      description: "First, the basic details for your new cafe.",
      icon: <Building />,
      fields: ["name", "slug", "tagline"],
    },
    {
      id: 2,
      name: "Branding",
      title: "Brand Identity",
      description: "Upload your logo and banner to stand out.",
      icon: <ImageIcon />,
      fields: ["logoUrl", "bannerUrl"],
    },
    {
      id: 3,
      name: "Location & Contact",
      title: "Find & Contact",
      description: "How can customers find and contact you?",
      icon: <Home />,
      fields: ["address", "openingTime", "email", "phone"],
    },
    {
      id: 4,
      name: "Financials",
      title: "Business & Payments",
      description: "Provide info for invoicing and payments.",
      icon: <Landmark />,
      fields: ["gstNo", "gstPercentage", "payment_url"],
    },
    {
      id: 5,
      name: "Review",
      title: "Final Review",
      description: "One last look at everything before we go live.",
      icon: <CheckCircle />,
    },
  ];