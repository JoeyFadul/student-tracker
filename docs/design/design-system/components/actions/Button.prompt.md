The Well Done button — coral primary, sentence-case label, press-scale feedback.

```jsx
<Button variant="primary" size="lg" fullWidth icon={<Icon name="check" size={18} strokeWidth={2.5} />}>Award 5</Button>
<Button variant="outline" size="lg">Cancel</Button>
```

Variants: primary (coral), secondary (solid slate), tertiary, outline (silver hairline), gunmetal (chrome actions like "End year"), success (= coral, commit/award), danger (destructive red), dangerSoft. Paired dialog actions: outline Cancel + primary/danger confirm, both size="lg" fullWidth. Also exports `usePressable()`.
