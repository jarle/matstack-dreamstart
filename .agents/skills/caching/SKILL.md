---
name: caching
description: Caching with @adonisjs/cache (keys, tags, invalidation). Use when adding or debugging cache behavior.
---

## Caching

- We cache using redis, through the `@adonisjs/cache` package: `import cache from "@adonisjs/cache/services/main"`

```ts
const result = await cache.getOrSet({
  key: `<unique cache key for item>`,
  factory: async () => {
    // perform the operation here and return its result
  },
})
```

- We can clear the cache with `node ace cache:clear`
- You can associate a cache entry with one or more tags to simplify invalidation. Instead of managing individual keys, entries can be grouped under multiple tags and invalidated in a single operation.

```ts
await cache.getOrSet({
  key: 'foo',
  factory: getFromDb(),
  tags: ['tag-1', 'tag-2'],
})

await cache.deleteByTags({ tags: ['tag-1'] })
```

- On exceptions, the factory will wrap the actual exception. Use `import { safeCacheOperation } from '#services/cache'` for bubling up the actual exception.
