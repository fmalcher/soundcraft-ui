---
sidebar_position: 2
---

# Use commands and feedback

The library exposes commands and feedback in a human-readable and object-oriented structure.
Feedback is published as streams that you can subscribe to. This uses the Observable object from [RxJS](https://rxjs.dev/).

```ts
conn.master.setFaderLavel(0.5);
conn.master.input(5).solo();
conn.aux(3).input(2).mute();

conn.master.faderLevel$.subscribe(value => {
  // ...
});
```

All available command and feedback streams are described and listed in these docs.

## Reading values as Promises

If you prefer working with Promises and `async`/`await` to fetch values, you can use the `firstValueFrom()` function from RxJS to convert the Observable to a Promise. Please be aware that a Promise only resolves once, so you will receive a single latest value of a stream.

```ts
import { firstValueFrom } from 'rxjs';

async function getMasterLevel() {
  const faderLevel = await firstValueFrom(conn.master.faderLevel$);
  return faderLevel;
}
```
