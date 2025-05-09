import type UserFacingException from "#exceptions/user_facing_exception";
import { data } from "react-router";

export const errorResponse = (status: number, message: string) => {
  return data({ message }, { status })
}

export const withErrorHandling = <T>(
  fn: () => Promise<T>
): Promise<T> => {
  return (async (): Promise<T> => {
    try {
      return await fn();
    } catch (error: unknown) {
      if (error instanceof Error) {
        const typedError = error as { type?: 'UserFacing', message: string };
        if (typedError.type === 'UserFacing') {
          const userFacingException = typedError as UserFacingException
          throw errorResponse(
            userFacingException.status,
            typedError.message
          );
        }
      }

      throw errorResponse(500, "An unexpected error occurred");
    }
  })();
};
