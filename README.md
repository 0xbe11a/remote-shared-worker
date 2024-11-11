
# 🚀 Remote-Shared-Worker

A powerful tool that extends the native `SharedWorker` functionality, making it easy to load and use scripts from different domains. It bypasses common CORS issues, enables dynamic cookie syncing, and provides enhanced control over session management.

## 🌟 Key Features
- **Cross-Origin Script Support:** Seamlessly load and interact with scripts from different websites without running into CORS problems.
- **Automatic Cookie Syncing:** Keeps your cookies synchronized between the main thread and the worker, ensuring consistent session management.
- **Dynamic Cookie Filtering:** Customize the list of cookies to sync based on specific prefixes, allowing flexible control over data sharing.
- **Automatic Cookie Cleanup:** Periodically removes expired cookies from the stored list to prevent stale data.
- **Custom `importScripts` Handling:** Overrides `importScripts` in the worker to resolve script URLs relative to the worker script, ensuring compatibility across origins.

## 📦 Installation

To get started, install the package via npm:

```bash
npm install remote-shared-worker
```

## 🛠️ Usage

After installation, you can use `RemoteSharedWorker` just like a regular `SharedWorker`, but with enhanced features for cross-origin compatibility and cookie management.

### Basic Example

```javascript
import RemoteSharedWorker from 'remote-shared-worker';

const worker = new RemoteSharedWorker('https://example.com/worker.js');

worker.port.start();
worker.port.postMessage('Hello, remote worker!');
```

### 📌 Example: Local Script Usage

```javascript
import RemoteSharedWorker from 'remote-shared-worker';

const worker = new RemoteSharedWorker('worker.js');

worker.port.onmessage = (event) => {
  console.log('Message from worker:', event.data);
};

worker.port.postMessage('Hello, worker!');
```

### 🌐 Example: Cross-Origin Script

```javascript
import RemoteSharedWorker from 'remote-shared-worker';

const worker = new RemoteSharedWorker('https://external-site.com/worker.js');

worker.port.onmessage = (event) => {
  console.log('Message from cross-origin worker:', event.data);
};

worker.port.postMessage('Hello from the main thread!');
```

## 🍪 Advanced Cookie Management

The `RemoteSharedWorker` provides robust cookie handling capabilities, making it easy to sync and manage session-related cookies between the main thread and the worker.

### 🔄 How Cookie Syncing Works
- **Automatic Syncing:** The main thread sends cookies to the worker at regular intervals (every 5 seconds).
- **Filtered Syncing:** Only cookies matching specified prefixes are synced, reducing unnecessary data transfer.
- **Cross-Origin Compatibility:** Handles cookie synchronization even when using cross-origin scripts.

### 🎯 Custom Cookie Filtering

You can dynamically update the list of cookie prefixes to be synced using the `updateFilter()` method.

```javascript
import RemoteSharedWorker from 'remote-shared-worker';

const worker = new RemoteSharedWorker('worker.js');

worker.updateFilter(['custom_', 'tracking_', 'auth_']);

worker.port.onmessage = (event) => {
  console.log('Filtered cookies:', event.data);
};

worker.port.postMessage('Requesting filtered cookies.');
```

### 🧹 Automatic Cookie Cleanup

The worker periodically checks for expired cookies and removes them to prevent stale data.

```javascript
import RemoteSharedWorker from 'remote-shared-worker';

const worker = new RemoteSharedWorker('worker.js');

worker.port.onmessage = (event) => {
  console.log('Valid cookies after cleanup:', event.data);
};

worker.port.postMessage('Check for expired cookies.');
```

### 🔍 Cookie Syncing in Depth

#### 1. **Syncing Process**
- The `syncCookies()` method retrieves cookies from `document.cookie` in the main thread.
- The cookies are filtered based on the prefixes specified in `updateFilter()`.
- The filtered cookies are sent to the worker using `port.postMessage()`.

#### 2. **Dynamic Filter Updates**
- Use `updateFilter(newFilter)` to change the list of cookie prefixes at any time.

```javascript
worker.updateFilter(['session_']);
```

#### 3. **Cookie Expiration Handling**
- The worker inspects each cookie’s `expires` attribute and excludes expired cookies.
```javascript
import RemoteSharedWorker from 'remote-shared-worker';

const worker = new RemoteSharedWorker('worker.js');

// The worker handles cookie expiry cleanup automatically
worker.port.onmessage = (event) => {
  console.log('Received up-to-date cookies:', event.data);
};

worker.port.postMessage('Check for expired cookies.');

```

