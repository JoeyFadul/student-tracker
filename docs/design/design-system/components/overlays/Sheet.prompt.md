Every popup in Well Done renders through Sheet — centered panel, radius 24, dim backdrop, scale 0.95→1 with springy ease. Tap backdrop or Esc to close.

```jsx
<Sheet open={open} onClose={close} title="Award points">…content + button row…</Sheet>
```

Button row convention: outline Cancel + primary/success confirm, both size="lg" fullWidth, gap 8.
