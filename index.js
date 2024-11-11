// Check if the code is running in a browser environment (where `window` is defined)
if (typeof window !== "undefined") {
  
  // Extend the native SharedWorker class with custom functionality
  window.SharedWorker = ((BaseSharedWorker) => 
    class PatchedSharedWorker extends BaseSharedWorker {

      constructor(scriptURL, options) {
        // Convert the provided scriptURL to a string
        const scriptUrlString = String(scriptURL);
        
        // Create a script that overrides `importScripts` within the worker
        const customImportScript = 
        `
        // Save the original importScripts function
        const originalImportScripts = importScripts;
        
        // Override importScripts to resolve URLs relative to the script URL
        importScripts = function(...urls) {
          const resolvedUrls = urls.map(url => new URL(url, "${scriptUrlString}").toString());
          originalImportScripts(...resolvedUrls);
        };

        // Initialize a global variable to store cookies inside the worker
        let workerCookies = "";
        let cookieFilter = [];

        // Listen for cookie updates and filter changes from the main thread
        self.onmessage = (event) => {
          if (event.data) {
            if (event.data.type === "setCookies") {
              // Update the stored cookies
              workerCookies = event.data.cookies;
            } else if (event.data.type === "updateFilter") {
              // Update the cookie filter list
              cookieFilter = event.data.filter || [];
            }
          }
        };

        // Utility function to get cookies inside the worker
        const getCookies = () => workerCookies;

        // Utility function to check if a cookie has expired based on its attributes
        const isCookieExpired = (cookie) => {
          const expiryMatch = cookie.match(/expires=([^;]+)/);
          if (expiryMatch) {
            const expiryDate = new Date(expiryMatch[1]);
            return expiryDate < new Date();
          }
          return false;
        };

        // Clean up expired cookies from the stored cookies
        const cleanExpiredCookies = () => {
          const cookiesArray = workerCookies.split("; ");
          const validCookies = cookiesArray.filter(cookie => !isCookieExpired(cookie));
          workerCookies = validCookies.join("; ");
        };

        // Set an interval to automatically clean expired cookies every 30 seconds
        setInterval(cleanExpiredCookies, 30000);
        `;
  
        // Determine if the script URL is cross-origin
        const isCrossOrigin = scriptUrlString.includes("://") && !scriptUrlString.startsWith(location.origin);
        
        // If cross-origin, create a Blob containing the custom import logic; otherwise, use the original script URL
        const workerScript = isCrossOrigin 
          ? URL.createObjectURL(new Blob([customImportScript], { type: "text/javascript" }))
          : scriptURL;
        
        // Call the parent SharedWorker constructor with the modified or original script URL
        super(workerScript, options);

        // Forward cookies to the SharedWorker initially
        this.syncCookies();

        // Set up an interval for automatic cookie syncing (every 5 seconds)
        this.cookieSyncInterval = setInterval(() => {
          this.syncCookies();
        }, 5000);

        // Clean up the interval when the worker is terminated
        this.port.onclose = () => {
          clearInterval(this.cookieSyncInterval);
        };
      }

      // Sync cookies by sending them to the SharedWorker
      syncCookies() {
        const cookies = this.getFilteredCookies();
        this.port.postMessage({ type: "setCookies", cookies });
      }

      // Filter cookies based on dynamic criteria received from the main thread
      getFilteredCookies() {
        const allCookies = document.cookie.split("; ");
        // Use the dynamic filter list from the main thread (defaults to session and auth cookies)
        const filter = this.cookieFilter || ["session_", "auth_"];
        const filteredCookies = allCookies.filter(cookie =>
          filter.some(prefix => cookie.trim().startsWith(prefix))
        );
        return filteredCookies.join("; ");
      }

      // Update the cookie filter list dynamically
      updateFilter(newFilter) {
        this.cookieFilter = newFilter;
        this.port.postMessage({ type: "updateFilter", filter: newFilter });
      }
    }
  )(SharedWorker);
}
