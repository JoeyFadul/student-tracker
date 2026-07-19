The one confirm dialog for consequential actions — Cancel + confirm pair; destructive deletes get the danger warning strip. (App adds typed-text friction for irreversible deletes.)

```jsx
<ConfirmDialog title="Delete Maya Rodriguez?" destructive confirmLabel="Delete student" onConfirm={del} onClose={close}>
  Maya will be removed from the roster. Past-year archives keep her data.
</ConfirmDialog>
```
