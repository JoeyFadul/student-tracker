import { Sheet } from '../ui/Sheet';
import { ReasonPicker } from './ReasonPicker';
import { useAppData } from '../../routes/context';

// Thin wrapper that puts the shared ReasonPicker inside a centered Sheet.
// onConfirm is invoked with (delta, reason). For the 1/2/5 path
// allowRevoke=false and the picker submits +amount. For the custom-amount
// path allowRevoke=true and the picker exposes a Grant/Revoke toggle.
export function ReasonPrompt({ amount, allowRevoke = false, open, onClose, onConfirm, title }) {
  const { reasonsApi } = useAppData();
  if (!amount && open) return null;
  const unit = amount === 1 ? 'point' : 'points';
  const computedTitle = allowRevoke
    ? (amount ? `${amount} ${unit}` : '')
    : (amount ? `Award ${amount} ${unit}` : '');

  return (
    <Sheet open={open} onClose={onClose} title={title ?? computedTitle}>
      <ReasonPicker
        amount={amount}
        allowRevoke={allowRevoke}
        reasons={reasonsApi.reasons}
        onSubmit={(delta, reason) => {
          onConfirm(delta, reason);
        }}
      />
    </Sheet>
  );
}
