import { lazy } from "react";
import type { ComponentType } from "react";

/**
 * A wrapper around React.lazy() that retries failed dynamic imports.
 *
 * When a new build is deployed, old chunk filenames no longer exist on the server.
 * Users with stale HTML will fail to load the new chunks. This wrapper:
 * 1. Catches the import error
 * 2. Forces a full page reload (once) to fetch fresh HTML with correct chunk URLs
 *
 * A sessionStorage key prevents infinite reload loops.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  chunkName?: string,
) {
  return lazy(() =>
    importFn().catch((error: Error) => {
      const storageKey = `chunk-reload-${chunkName || "general"}`;
      const hasReloaded = sessionStorage.getItem(storageKey);

      if (!hasReloaded) {
        // Mark that we're about to reload so we don't loop forever
        sessionStorage.setItem(storageKey, "true");
        console.warn(
          `[lazyWithRetry] Chunk load failed for "${chunkName || "unknown"}". Reloading page to fetch latest assets...`,
          error,
        );
        window.location.reload();
        // Return a never-resolving promise to prevent React from rendering while reloading
        return new Promise<{ default: T }>(() => {});
      }

      // Already reloaded once — clear the flag and let the error propagate
      sessionStorage.removeItem(storageKey);
      throw error;
    }),
  );
}
