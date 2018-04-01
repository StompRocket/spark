importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js')

console.log('this is my custom service worker')

workbox.precaching.precacheAndRoute(self.__precacheManifest || [])
workbox.routing.registerNavigationRoute('/index.html', {
  whitelist: [
    new RegExp('/#/*')
  ]
})
workbox.routing.registerRoute(
  new RegExp('https://lh3.googleusercontent.com/*'),
  workbox.strategies.networkFirst()
)
