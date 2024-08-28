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
        
        // Import the main worker script
        importScripts("${scriptUrlString}");
        `;
  
        // Determine if the script URL is cross-origin
        const isCrossOrigin = scriptUrlString.includes("://") && !scriptUrlString.startsWith(location.origin);
        
        // If cross-origin, create a Blob containing the custom import logic; otherwise, use the original script URL
        const workerScript = isCrossOrigin 
          ? URL.createObjectURL(new Blob([customImportScript], { type: "text/javascript" }))
          : scriptURL;
        
        // Call the parent SharedWorker constructor with the modified or original script URL
        super(workerScript, options);
      }
    }
  )(SharedWorker);
}