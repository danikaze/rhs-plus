# Assets

Files on this folder are copied in the build process via [CopyPlugin](../../webpack.config.js) without loader.

This means no hash is added and no import is required. Just use the path to it together with [chrome.runtime.getURL()](https://developer.chrome.com/docs/extensions/reference/runtime/#method-getURL) (i.e. for images it would be `src={chrome.runtime.getURL('assets/file.png')}`)
