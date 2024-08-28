if (typeof window !== "undefined") {
    window.SharedWorker = ((BaseSharedWorker) => 
      class PatchedSharedWorker extends BaseSharedWorker {
        constructor(scriptURL, options) {
          const url = String(scriptURL);
  
          super(
            url.includes("://") && !url.startsWith(location.origin)
              ? URL.createObjectURL(
                  new Blob([
                    `importScripts=((i)=>(...a)=>i(...a.map((u)=>''+new URL(u,"${url}"))))(importScripts);importScripts("${url}")`
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