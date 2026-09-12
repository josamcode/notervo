// Retire the legacy cache. Offline commerce needs an explicit privacy/cache policy.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("notervo-cache-"))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.registration.unregister())
  );
});
