
# Remote-Shared-Worker

A handy tool that makes it easy to use `SharedWorker` with scripts from other websites. It’s like giving your worker superpowers to talk to scripts from anywhere—even across different websites—without running into CORS problems!

- **Talk to Workers on Other Websites:** You can now use scripts from other websites without running into problems.
- **No More CORS Issues:** CORS (Cross-Origin Resource Sharing) can be tricky when trying to load scripts from different websites. `RemoteSharedWorker` solves this by wrapping your scripts in a way that avoids CORS issues, so everything just works!
- **Make Sure Everything Loads Right:** It makes sure all the parts of your script load correctly, even if they’re from different places.

## Installing

To get started, you need to install this package. 

```bash
npm install remote-shared-worker
```

## How to Use

Once you’ve installed it, you can start using your new `RemoteSharedWorker` just like you’d use a regular `SharedWorker`. But now, it can load scripts from anywhere!

```javascript
import RemoteSharedWorker from 'remote-shared-worker';

const worker = new RemoteSharedWorker('https://example.com/worker.js');

// Start talking to your worker!
worker.port.start();
worker.port.postMessage('Hi there, remote worker!');
```

### Snippet of how to call

```javascript
import RemoteSharedWorker from 'remote-shared-worker';

const worker = new RemoteSharedWorker('worker.js');

worker.port.onmessage = function(event) {
  console.log('The worker says:', event.data);
};

worker.port.postMessage('Hello, worker!');
```

### Call Worker from another website

```javascript
import RemoteSharedWorker from 'remote-shared-worker';

const worker = new RemoteSharedWorker('https://example.com/worker.js');

worker.port.onmessage = function(event) {
  console.log('Message from the cross-origin worker:', event.data);
};

worker.port.postMessage('Hello from the main thread!');
```
### Dynamic Cookie Syncing
```javascript
import RemoteSharedWorker from 'remote-shared-worker';

const worker = new RemoteSharedWorker('worker.js');

// Update the cookie filter to sync only session-related cookies
worker.updateFilter(['session_', 'auth_']);

worker.port.onmessage = (event) => {
  console.log('Cookies synced with the worker:', event.data);
};

worker.port.postMessage('Requesting cookies from the worker.');
```

### Cookie Lifetime Management
```javascript
import RemoteSharedWorker from 'remote-shared-worker';

const worker = new RemoteSharedWorker('worker.js');

// The worker handles cookie expiry cleanup automatically
worker.port.onmessage = (event) => {
  console.log('Received up-to-date cookies:', event.data);
};

worker.port.postMessage('Check for expired cookies.');

```