"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { useState } from "react";
import { completeOnboarding } from "./_actions";

export default function Onboarding() {
  const { user } = useUser();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    const res = await completeOnboarding(formData);
    if (res?.message) {
      await user?.reload();
      router.push("/dashboard");
    }
    if (res?.error) setError(res.error);
  };

  return (
    <form action={handleSubmit}>
      <input
        type="text"
        name="applicationName"
        required
        placeholder="App Name"
      />
      <input
        type="text"
        name="applicationType"
        required
        placeholder="App Type"
      />
      <button type="submit">Submit</button>
      {error && <p>{error}</p>}
    </form>
  );
}
