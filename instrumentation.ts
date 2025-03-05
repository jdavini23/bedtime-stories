// Instrumentation file - Sentry and OpenTelemetry removed
export async function register() {
  // Instrumentation is disabled
  console.log('Instrumentation disabled');
}

export const onRequestError = (error: Error) => {
  console.error('Request error:', error);
};
