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
