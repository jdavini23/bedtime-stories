import { NextAuthError } from "next-auth/errors";

export function handleNextAuthError(error: NextAuthError) {
  console.error("NextAuth Error:", {
    name: error.name,
    message: error.message,
    code: error.code,
    cause: error.cause,
    stack: error.stack,
  });

  // Custom error handling logic
  switch (error.code) {
    case "CLIENT_FETCH_ERROR":
      console.error(
        "There was an issue fetching authentication data. Check your API routes and network configuration."
      );
      break;
    default:
      console.error("An unexpected authentication error occurred.");
  }
}

// Optional: Global error handler for NextAuth
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason instanceof Error &&
      event.reason.name === "NextAuthError"
    ) {
      handleNextAuthError(event.reason);
    }
  });
}
