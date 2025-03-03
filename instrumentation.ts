import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { NodeSDK } = await import('@opentelemetry/sdk-node');
      const { Resource } = await import('@opentelemetry/resources');
      const { SemanticResourceAttributes } = await import('@opentelemetry/semantic-conventions');
      const { ConsoleSpanExporter } = await import('@opentelemetry/sdk-trace-base');

      const sdk = new NodeSDK({
        resource: new Resource({
          [SemanticResourceAttributes.SERVICE_NAME]: 'bedtime-stories',
        }),
        traceExporter: new ConsoleSpanExporter(),
      });

      await sdk.start();
    } catch (error) {
      console.error('Failed to initialize OpenTelemetry:', error);
    }
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
