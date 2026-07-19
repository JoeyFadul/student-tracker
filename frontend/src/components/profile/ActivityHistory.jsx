import { useEffect, useRef, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { theme } from '../../theme';
import { Card } from '../ui/Card';
import { SkeletonBlock } from '../ui/Skeleton';

// Activity list with cursor-based infinite scroll. Renders the initial page
// (passed in as initialItems + initialCursor by the parent — the profile fetch
// already returns the first 30 plus a nextCursor), then a sentinel at the
// bottom that triggers onLoadMore the moment it scrolls into view. Server
// uses a FilterExpression so a page can come back smaller than 30 even when
// more events exist; we just keep walking the cursor.
export function ActivityHistory({ initialItems, initialCursor, onLoadMore, loading: parentLoading = false }) {
  const [items, setItems] = useState(initialItems || []);
  const [cursor, setCursor] = useState(initialCursor || null);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  // Reset when the parent passes a new student (different initialItems
  // identity) — otherwise opening a second student would append to the
  // first student's activity list.
  useEffect(() => {
    setItems(initialItems || []);
    setCursor(initialCursor || null);
  }, [initialItems, initialCursor]);

  const loadMore = useCallback(async () => {
    if (!cursor || loading || !onLoadMore) return;
    setLoading(true);
    try {
      const { items: nextItems = [], nextCursor = null } = await onLoadMore(cursor) || {};
      setItems(prev => [...prev, ...nextItems]);
      setCursor(nextCursor);
    } catch (err) {
      console.warn('Activity load-more failed:', err);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, onLoadMore]);

  // IntersectionObserver fires the moment the sentinel scrolls into view —
  // no scroll-position math, no resize listeners. Re-attaches whenever the
  // cursor or sentinel ref changes.
  useEffect(() => {
    if (!cursor) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    }, { rootMargin: '120px 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [cursor, loadMore]);

  return (
    <Card title="Activity">
      {items.length === 0 && !cursor ? (
        // While the parent is still fetching the first history page, show
        // placeholder lines rather than flashing "No activity yet".
        parentLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '12px 0' }}>
            <SkeletonBlock width="70%" />
            <SkeletonBlock width="55%" />
            <SkeletonBlock width="62%" />
          </div>
        ) : (
          <div style={emptyStyle}>No activity yet</div>
        )
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((entry, i) => (
            <ActivityEntry
              key={entry.timestamp || i}
              entry={entry}
              isLast={i === items.length - 1 && !cursor}
            />
          ))}
          {cursor && (
            <div ref={sentinelRef} style={sentinelStyle}>
              {loading && <Loader2 size={18} color={theme.colors.textMuted} className="spin" />}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function ActivityEntry({ entry, isLast }) {
  const formattedDate = formatRelativeDate(entry.timestamp);
  const isPositive = entry.delta > 0;

  return (
    <div style={{ ...entryStyle, borderBottom: isLast ? 'none' : `1px solid ${theme.colors.border}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={reasonStyle}>{entry.reason || (isPositive ? 'Points awarded' : 'Points removed')}</div>
        <div style={dateStyle}>{formattedDate}</div>
      </div>
      <div style={{
        ...deltaStyle,
        color: isPositive ? theme.colors.success : theme.colors.danger,
        background: isPositive ? theme.colors.successSoft : theme.colors.dangerSoft,
      }}>
        {isPositive ? '+' : ''}{entry.delta}
      </div>
    </div>
  );
}

function formatRelativeDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const today = new Date();
  const diffDays = Math.floor((today - date) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const emptyStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textFaint,
  padding: '20px 0',
  textAlign: 'center',
};

const entryStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '12px 0',
};

const reasonStyle = {
  fontSize: theme.font.sizes.body,
  color: theme.colors.text,
  fontWeight: 500,
  letterSpacing: '-0.005em',
};

const dateStyle = {
  fontSize: theme.font.sizes.footnote,
  color: theme.colors.textFaint,
  marginTop: 2,
};

const deltaStyle = {
  fontSize: theme.font.sizes.footnote,
  fontWeight: 700,
  padding: '4px 10px',
  borderRadius: theme.radius.pill,
  minWidth: 38,
  textAlign: 'center',
};

const sentinelStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px 0',
  minHeight: 36,
};
