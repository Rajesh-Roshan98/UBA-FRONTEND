// Global navigation handler for use outside React components
let navigate;
let pendingRedirect = null; // 🔥 Queue for redirects called before navigator is ready

export const setNavigator = (nav) => {
  navigate = nav;
  // 🔥 If there was a pending redirect, execute it now
  if (pendingRedirect) {
    navigate(pendingRedirect);
    pendingRedirect = null;
  }
};

export const redirect = (path) => {
  // 🔥 If navigator isn't ready yet, queue the redirect instead of falling back to hard reload
  if (!navigate) {
    pendingRedirect = path;
    return;
  }
  if (navigate) {
    navigate(path);
  } else {
    // Fallback in case navigate is not yet set (should not happen)
    window.location.assign(path);
  }
};