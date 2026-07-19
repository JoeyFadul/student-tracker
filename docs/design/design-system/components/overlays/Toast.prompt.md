Card-styled toast, bottom-center above the tab bar. Every grant shows one with a +N/−N pill and Undo — the toast window is the only undo mechanism. Auto-dismisses ~4.5s in the app.

```jsx
<Toast delta={5} message="Awarded to Maya for Kindness" actionLabel="Undo" onAction={undo} />
```
