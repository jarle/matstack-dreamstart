import { createReadableStreamFromReadable } from "@react-router/node";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { Route } from "./+types/root.js";

export const streamTimeout = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter
        context={routerContext}
        url={request.url}
      />,
      {
        onShellReady() {
          responseHeaders.set("Content-Type", "text/html");

          const body = new PassThrough();
          const stream =
            createReadableStreamFromReadable(body);

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
      }
    );
  });
}

export async function handleError(
  error: unknown,
  {
    request,
    params,
    context,
  }: Route.LoaderArgs | Route.ActionArgs
) {
  if (!request.signal.aborted) {
    if (error instanceof Error) {
      const service = await context.make('error_log')
      service.logError(error as Error, context.http)
      context.http.logger.error(error)
    } else {
      console.log("Unsure")
    }
  }
}