"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export const completeOnboarding = async (formData: FormData) => {
  const { userId } = await auth();
  if (!userId) return { message: "Not Logged In" };

  try {
    const client = await clerkClient();
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
        applicationName: formData.get("applicationName"),
        applicationType: formData.get("applicationType"),
      },
    });
      
    return { message: res.publicMetadata };
  } catch {
    return { error: "Error updating metadata" };
  }
};
