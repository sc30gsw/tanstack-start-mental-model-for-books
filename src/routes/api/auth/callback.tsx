import { createFileRoute } from "@tanstack/react-router";
import { handleCallbackRoute } from "@workos/authkit-tanstack-react-start";
import { getDb } from "~/db";
import { users } from "~/db/schema";

export const Route = createFileRoute("/api/auth/callback")({
  server: {
    handlers: {
      GET: handleCallbackRoute({
        onSuccess: async ({ user, organizationId }) => {
          const db = getDb();

          await db
            .insert(users)
            .values({
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              emailVerified: user.emailVerified,
              profilePictureUrl: user.profilePictureUrl,
              organizationId: organizationId,
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: users.id,
              set: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerified: user.emailVerified,
                profilePictureUrl: user.profilePictureUrl,
                organizationId: organizationId,
                updatedAt: new Date(),
              },
            });

          console.log("User authenticated and saved:", user.email);
        },
        onError: ({ error }) => {
          console.error("Authentication failed:", error);

          return new Response(
            JSON.stringify({
              error: "認証に失敗しました",
              message: "もう一度お試しください",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        },
      }),
    },
  },
});
