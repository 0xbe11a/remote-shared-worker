if (typeof window !== "undefined") {
    window.SharedWorker = ((BaseSharedWorker) => 
      class PatchedSharedWorker extends BaseSharedWorker {
        constructor(scriptURL, options) {
          const urlVariable = String(scriptURL);
          const twistedImport = 
          'const originalImportScripts = importScripts;\n' +
          'importScripts = function(...urls) {\n' +
          '    const resolvedUrls = urls.map(url => new URL(url, "' + urlVariable + '").toString());\n' +
          '    originalImportScripts(...resolvedUrls);\n' +
          '};\n' +
          'importScripts("' + urlVariable + '");';
  
          super(
            url.includes("://") && !url.startsWith(location.origin)
              ? URL.createObjectURL(
                  new Blob([
                    twistedImport
                  ], {
                    type: "text/javascript"
                  })
                )
              : scriptURL,
            options
          );
        }
      }
    )(SharedWorker);
  }