import { useState, useCallback } from "react";
import healthApi from "../services/healthApi"; 

export const useServerWake = () => {
  const [isWakingUp, setIsWakingUp] = useState(false);

  const ensureBackendAwake = useCallback(async (abortSignal, onSleepDetected) => {
    let attempts = 0;
    while (attempts < 24) {
      try {
        await healthApi.get("/api/v1/auth/health", {
          signal: abortSignal,
        });
        return true; 
      } catch (err) {
        if (abortSignal?.aborted) {
          const abortError = new DOMException("Polling aborted", "AbortError");
          throw abortError;
        }

        const isSleepError =
          !err.response ||
          err.code === "ECONNABORTED" ||
          err.code === "ERR_NETWORK";

        if (!isSleepError) {
          throw err;
        }

        if (attempts === 0) {
          setIsWakingUp(true);
          if (onSleepDetected) onSleepDetected();
        }

        await new Promise((resolve, reject) => {
          const abortHandler = () => {
            clearTimeout(timeout);
            abortSignal?.removeEventListener("abort", abortHandler);
            reject(new DOMException("Polling aborted", "AbortError"));
          };

          const timeout = setTimeout(() => {
            abortSignal?.removeEventListener("abort", abortHandler);
            resolve();
          }, 5000);

          abortSignal?.addEventListener("abort", abortHandler);
        });
        attempts++;
      }
    }
    return false;
  }, []);

  return { isWakingUp, setIsWakingUp, ensureBackendAwake };
};