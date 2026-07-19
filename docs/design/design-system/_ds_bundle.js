/* @ds-bundle: {"format":4,"namespace":"WellDoneDesignSystem_96828f","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"Fab","sourcePath":"components/actions/Fab.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Chip","sourcePath":"components/display/Chip.jsx"},{"name":"EmptyState","sourcePath":"components/display/EmptyState.jsx"},{"name":"ErrorBanner","sourcePath":"components/display/ErrorBanner.jsx"},{"name":"Skeleton","sourcePath":"components/display/Skeleton.jsx"},{"name":"SkeletonRow","sourcePath":"components/display/Skeleton.jsx"},{"name":"SkeletonList","sourcePath":"components/display/Skeleton.jsx"},{"name":"Label","sourcePath":"components/forms/Input.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SearchBar","sourcePath":"components/forms/SearchBar.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/icons/Icon.jsx"},{"name":"AppHeader","sourcePath":"components/navigation/AppHeader.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"ConfirmDialog","sourcePath":"components/overlays/ConfirmDialog.jsx"},{"name":"Sheet","sourcePath":"components/overlays/Sheet.jsx"},{"name":"Toast","sourcePath":"components/overlays/Toast.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"53498007aac0","components/actions/Fab.jsx":"a8c2eba86fea","components/actions/IconButton.jsx":"c7c04c2fa363","components/display/Avatar.jsx":"529f7a33ff86","components/display/Card.jsx":"89f1b308ed7b","components/display/Chip.jsx":"52249aab52cd","components/display/EmptyState.jsx":"f8155612700f","components/display/ErrorBanner.jsx":"ee31da3ef5b9","components/display/Skeleton.jsx":"75d23e5a24cb","components/forms/Input.jsx":"66dd68ad2d31","components/forms/SearchBar.jsx":"05ce90d2d8bc","components/forms/Select.jsx":"af2c43022398","components/forms/Textarea.jsx":"6d9083801509","components/icons/Icon.jsx":"854a4fec88d0","components/navigation/AppHeader.jsx":"b33ad358f48b","components/navigation/TabBar.jsx":"0d17673fba4d","components/overlays/ConfirmDialog.jsx":"baacade0d347","components/overlays/Sheet.jsx":"918d25545682","components/overlays/Toast.jsx":"d7ad75c564eb","ui_kits/app/Screens1.jsx":"0c0488b8e28d","ui_kits/app/Screens2.jsx":"e33b07da129c","ui_kits/app/data.js":"91f7c56736fe"},"inlinedExternals":[],"unexposedExports":[{"name":"inputBaseStyle","sourcePath":"components/forms/Input.jsx"},{"name":"usePressable","sourcePath":"components/actions/Button.jsx"}]} */

(() => {

const __ds_ns = (window.WellDoneDesignSystem_96828f = window.WellDoneDesignSystem_96828f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React; // Press feedback used everywhere in the app (usePressable): scale(0.97).
function usePressable() {
  const [pressed, setPressed] = useState(false);
  const handlers = {
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    onTouchStart: () => setPressed(true),
    onTouchEnd: () => setPressed(false),
    onTouchCancel: () => setPressed(false)
  };
  return {
    pressed,
    handlers,
    pressedStyle: pressed ? {
      transform: 'scale(0.97)'
    } : {}
  };
}
const variants = {
  primary: {
    background: 'var(--wd-accent)',
    color: '#fff',
    border: 'none'
  },
  secondary: {
    background: 'var(--wd-slate)',
    color: '#fff',
    border: 'none'
  },
  tertiary: {
    background: 'transparent',
    color: 'var(--wd-text)',
    border: 'none'
  },
  outline: {
    background: 'var(--wd-surface)',
    color: 'var(--wd-text)',
    border: '1.5px solid var(--wd-border)'
  },
  gunmetal: {
    background: 'var(--wd-gunmetal)',
    color: '#fff',
    border: 'none'
  },
  success: {
    background: 'var(--wd-accent)',
    color: '#fff',
    border: 'none'
  },
  danger: {
    background: 'var(--wd-danger)',
    color: '#fff',
    border: 'none'
  },
  dangerSoft: {
    background: 'var(--wd-danger-soft)',
    color: 'var(--wd-danger)',
    border: 'none'
  }
};
const sizes = {
  sm: {
    padding: '8px 14px',
    fontSize: 13,
    minHeight: 36,
    borderRadius: 12
  },
  md: {
    padding: '11px 18px',
    fontSize: 15,
    minHeight: 44,
    borderRadius: 12
  },
  lg: {
    padding: '14px 20px',
    fontSize: 16,
    minHeight: 52,
    borderRadius: 16
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon = null,
  iconRight = null,
  onClick,
  type = 'button',
  style,
  ...rest
}) {
  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;
  const {
    handlers,
    pressedStyle
  } = usePressable();
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    onClick: onClick,
    disabled: disabled
  }, handlers, {
    style: {
      ...variantStyle,
      ...sizeStyle,
      ...pressedStyle,
      width: fullWidth ? '100%' : 'auto',
      fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontFamily: 'var(--wd-font-body)',
      transition: 'transform 0.1s ease, opacity 0.15s ease, background 0.15s ease',
      WebkitTapHighlightColor: 'transparent',
      ...style
    }
  }, rest), icon, children, iconRight);
}
Object.assign(__ds_scope, { usePressable, Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Round icon-only button on a soft surface circle.
function IconButton({
  icon,
  onClick,
  ariaLabel,
  size = 36,
  style
}) {
  const {
    handlers,
    pressedStyle
  } = __ds_scope.usePressable();
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick
  }, handlers, {
    "aria-label": ariaLabel,
    style: {
      background: 'var(--wd-surface)',
      boxShadow: 'var(--wd-shadow-sm)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent',
      transition: 'transform 0.1s ease',
      flexShrink: 0,
      width: size,
      height: size,
      borderRadius: size / 2,
      ...pressedStyle,
      ...style
    }
  }), icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
const DEFAULT_AVATAR = '🌱';

// The one student avatar tile: photo if set, emoji otherwise, 🌱 default.
// Honey-soft squircle background; emoji is data, not decoration.
function Avatar({
  student = {},
  size = 52,
  radius = 16,
  emojiSize,
  style
}) {
  const isPhotoUrl = student.photo && student.photo.startsWith('http');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: radius,
      background: 'var(--wd-avatar-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      overflow: 'hidden',
      ...style
    }
  }, isPhotoUrl ? /*#__PURE__*/React.createElement("img", {
    src: student.photo,
    alt: student.name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: emojiSize != null ? emojiSize : Math.round(size * 0.54)
    }
  }, student.photo || DEFAULT_AVATAR));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Bordered white surface — 1px hairline + subtle shadow, radius 20.
function Card({
  title,
  subtitle,
  children,
  padding = 20,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--wd-surface)',
      border: '1px solid var(--wd-border)',
      borderRadius: 20,
      padding,
      boxShadow: 'var(--wd-shadow-sm)',
      marginBottom: 14,
      ...style
    }
  }, rest), (title || subtitle) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 600,
      color: 'var(--wd-text)',
      letterSpacing: '-0.01em'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--wd-text-muted)',
      marginTop: 2
    }
  }, subtitle)), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Chip.jsx
try { (() => {
const tones = {
  neutral: {
    background: 'var(--wd-surface-alt)',
    color: 'var(--wd-text-muted)'
  },
  danger: {
    background: 'var(--wd-danger-soft)',
    color: 'var(--wd-danger)'
  },
  accent: {
    background: 'var(--wd-accent-soft)',
    color: 'var(--wd-accent-dark)'
  },
  slate: {
    background: 'var(--wd-slate-soft)',
    color: 'var(--wd-slate)'
  },
  gunmetal: {
    background: 'var(--wd-gunmetal)',
    color: 'var(--wd-on-dark)'
  },
  success: {
    background: 'var(--wd-success-soft)',
    color: 'var(--wd-accent-dark)'
  },
  honey: {
    background: 'var(--wd-slate-soft)',
    color: 'var(--wd-slate)'
  }
};

// Small pill for status/metadata: streak flames, deltas, read-only badges.
function Chip({
  icon,
  children,
  tone = 'neutral',
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '6px 12px',
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 600,
      ...(tones[tone] || tones.neutral),
      ...style
    }
  }, icon, /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Chip.jsx", error: String((e && e.message) || e) }); }

// components/display/EmptyState.jsx
try { (() => {
// Card-style empty state: icon in a soft accent circle, title, hint, action.
function EmptyState({
  icon,
  title,
  hint,
  action,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '40px 24px',
      background: 'var(--wd-surface)',
      borderRadius: 20,
      boxShadow: 'var(--wd-shadow-md)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 72,
      height: 72,
      borderRadius: 36,
      background: 'var(--wd-accent-soft)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 18
    }
  }, icon), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--wd-text)',
      margin: 0,
      letterSpacing: '-0.01em'
    }
  }, title), hint && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--wd-text-muted)',
      margin: '8px 0 22px',
      lineHeight: 1.5,
      maxWidth: 320
    }
  }, hint), action);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/display/ErrorBanner.jsx
try { (() => {
function ErrorBanner({
  message,
  onDismiss,
  style
}) {
  if (!message) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      background: 'var(--wd-danger-soft)',
      color: 'var(--wd-danger)',
      fontSize: 13,
      fontWeight: 500,
      borderRadius: 12,
      marginBottom: 14,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", null, message), onDismiss && /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss,
    "aria-label": "Dismiss error",
    style: {
      background: 'none',
      border: 'none',
      color: 'var(--wd-danger)',
      cursor: 'pointer',
      fontSize: 20,
      lineHeight: 1,
      padding: '0 4px',
      fontFamily: 'inherit'
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { ErrorBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ErrorBanner.jsx", error: String((e && e.message) || e) }); }

// components/display/Skeleton.jsx
try { (() => {
// Loading skeletons. Rule: skeletons for anything that loads content;
// spinners only inside busy controls. Uses the wd-shimmer keyframes from base.css.
const shimmerStyle = {
  background: 'linear-gradient(90deg, var(--wd-surface-alt) 0%, var(--wd-shimmer-mid) 50%, var(--wd-surface-alt) 100%)',
  backgroundSize: '400px 100%',
  animation: 'wd-shimmer 1.4s ease-in-out infinite'
};
function Skeleton({
  width = '100%',
  height = 14,
  radius = 6,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...shimmerStyle,
      width,
      height,
      borderRadius: radius,
      ...style
    }
  });
}

// Card-shaped row matching StudentListItem's silhouette.
function SkeletonRow() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 14px 14px 16px',
      background: 'var(--wd-surface)',
      borderRadius: 20,
      boxShadow: 'var(--wd-shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 16,
      flexShrink: 0,
      ...shimmerStyle
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...shimmerStyle,
      width: '55%',
      height: 14,
      borderRadius: 6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...shimmerStyle,
      width: '30%',
      height: 10,
      borderRadius: 6
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      ...shimmerStyle,
      width: 40,
      height: 22,
      borderRadius: 6
    }
  }));
}
function SkeletonList({
  count = 5,
  gap = 10,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap,
      ...style
    }
  }, Array.from({
    length: count
  }, (_, i) => /*#__PURE__*/React.createElement(SkeletonRow, {
    key: i
  })));
}
Object.assign(__ds_scope, { Skeleton, SkeletonRow, SkeletonList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Label({
  children
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--wd-text-muted)',
      marginBottom: 6
    }
  }, children);
}
const inputBaseStyle = {
  width: '100%',
  padding: '14px 16px',
  fontSize: 15,
  border: 'none',
  borderRadius: 12,
  marginBottom: 14,
  boxSizing: 'border-box',
  fontFamily: 'var(--wd-font-body)',
  background: 'var(--wd-surface-alt)',
  color: 'var(--wd-text)',
  outline: 'none',
  WebkitAppearance: 'none'
};
function Input({
  label,
  style,
  ...inputProps
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, label && /*#__PURE__*/React.createElement(Label, null, label), /*#__PURE__*/React.createElement("input", _extends({}, inputProps, {
    style: {
      ...inputBaseStyle,
      ...style
    }
  })));
}
Object.assign(__ds_scope, { Label, inputBaseStyle, Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const chevronSvg = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2378716c\' stroke-width=\'2\'><polyline points=\'6 9 12 15 18 9\'/></svg>")';

// Native <select> styled as a soft-fill input — real system control on iOS.
function Select({
  label,
  options = [],
  style,
  ...selectProps
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, label && /*#__PURE__*/React.createElement(__ds_scope.Label, null, label), /*#__PURE__*/React.createElement("select", _extends({}, selectProps, {
    style: {
      ...__ds_scope.inputBaseStyle,
      appearance: 'none',
      paddingRight: 40,
      backgroundImage: chevronSvg,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 14px center',
      ...style
    }
  }), options.map(opt => /*#__PURE__*/React.createElement("option", {
    key: opt.value,
    value: opt.value
  }, opt.label))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  label,
  style,
  ...textareaProps
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, label && /*#__PURE__*/React.createElement(__ds_scope.Label, null, label), /*#__PURE__*/React.createElement("textarea", _extends({}, textareaProps, {
    style: {
      ...__ds_scope.inputBaseStyle,
      minHeight: 88,
      resize: 'vertical',
      lineHeight: 1.5,
      ...style
    }
  })));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
// Lucide glyphs used across Well Done (the app imports lucide-react).
// Same 24×24 viewBox, stroke-based, strokeWidth 2 default (2.4 active tab).
const GLYPHS = {
  'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'bar-chart-3': '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  'settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  'flame': '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'minus': '<path d="M5 12h14"/>',
  'check': '<polyline points="20 6 9 17 4 12"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'arrow-up-down': '<path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'camera': '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  'more-horizontal': '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  'trending-up': '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
  'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'loader-2': '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
  'calendar': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
  'trash-2': '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  'pencil': '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
  'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  'mail': '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'
};
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  style,
  className
}) {
  const body = GLYPHS[name] || '';
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      ...style
    },
    className: className,
    "aria-hidden": "true",
    dangerouslySetInnerHTML: {
      __html: body
    }
  });
}
const ICON_NAMES = Object.keys(GLYPHS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/actions/Fab.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// 56px floating action button with the orange glow — "Add student".
// App positions it fixed above the tab bar (bottom: tabBar + 20, right: 20).
function Fab({
  icon,
  onClick,
  ariaLabel = 'Add student',
  fixed = true,
  style
}) {
  const {
    handlers,
    pressedStyle
  } = __ds_scope.usePressable();
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    "aria-label": ariaLabel,
    title: ariaLabel
  }, handlers, {
    style: {
      position: fixed ? 'fixed' : 'relative',
      bottom: fixed ? 'calc(var(--wd-tab-bar-height) + 20px + env(safe-area-inset-bottom))' : undefined,
      right: fixed ? 20 : undefined,
      width: 56,
      height: 56,
      borderRadius: 28,
      background: 'var(--wd-accent)',
      color: '#fff',
      border: 'none',
      boxShadow: 'var(--wd-shadow-fab)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 40,
      transition: 'transform 0.1s ease, box-shadow 0.15s ease',
      WebkitTapHighlightColor: 'transparent',
      ...pressedStyle,
      ...style
    }
  }), icon || /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 26,
    strokeWidth: 2.5
  }));
}
Object.assign(__ds_scope, { Fab });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Fab.jsx", error: String((e && e.message) || e) }); }

// components/forms/SearchBar.jsx
try { (() => {
// Pill search field with leading search icon — dashboard roster filter.
function SearchBar({
  value,
  onChange,
  placeholder = 'Search students…',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search",
    size: 18,
    color: "var(--wd-text-faint)",
    style: {
      position: 'absolute',
      left: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: placeholder,
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    style: {
      width: '100%',
      padding: '12px 14px 12px 42px',
      fontSize: 15,
      border: 'none',
      borderRadius: 999,
      background: 'var(--wd-surface-alt)',
      color: 'var(--wd-text)',
      boxSizing: 'border-box',
      outline: 'none',
      fontFamily: 'var(--wd-font-body)',
      minHeight: 44,
      WebkitAppearance: 'none'
    }
  }));
}
Object.assign(__ds_scope, { SearchBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SearchBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/AppHeader.jsx
try { (() => {
// Gunmetal chrome header — dark band, white large-title in the rounded
// display face, silver subtitle. The signature of the Gunmetal & Coral system.
function AppHeader({
  title,
  subtitle,
  action,
  left,
  sticky = true
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      width: '100%',
      paddingTop: 'env(safe-area-inset-top)',
      position: sticky ? 'sticky' : 'relative',
      top: sticky ? 0 : undefined,
      zIndex: 100,
      background: 'var(--wd-gunmetal)',
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto',
      padding: '22px 20px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, left && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, left), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 30,
      fontWeight: 800,
      color: 'var(--wd-on-dark)',
      margin: 0,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
      fontFamily: 'var(--wd-font-display)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--wd-on-dark-muted)',
      marginTop: 4,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, subtitle)), action && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, action)));
}
Object.assign(__ds_scope, { AppHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/AppHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Gunmetal frosted tab bar: coral active tab, silver inactive — dark chrome
// bookending the white canvas (pairs with the gunmetal AppHeader).
function TabBar({
  active = 'students',
  onChange,
  tabs,
  fixed = true
}) {
  const items = tabs || [{
    key: 'students',
    label: 'Students',
    icon: 'users'
  }, {
    key: 'stats',
    label: 'Stats',
    icon: 'bar-chart-3'
  }, {
    key: 'settings',
    label: 'Settings',
    icon: 'settings'
  }];
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: fixed ? 'fixed' : 'relative',
      left: 0,
      right: 0,
      bottom: fixed ? 0 : undefined,
      background: 'var(--wd-surface-translucent)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      zIndex: 50,
      paddingBottom: 'env(safe-area-inset-bottom)',
      borderTopLeftRadius: fixed ? 24 : 24,
      borderTopRightRadius: fixed ? 24 : 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'stretch',
      maxWidth: 720,
      margin: '0 auto',
      height: 64
    }
  }, items.map(tab => /*#__PURE__*/React.createElement(TabButton, {
    key: tab.key,
    tab: tab,
    active: tab.key === active,
    onClick: () => onChange && onChange(tab.key)
  }))));
}
function TabButton({
  tab,
  active,
  onClick
}) {
  const {
    handlers,
    pressedStyle
  } = __ds_scope.usePressable();
  const color = active ? 'var(--wd-accent)' : 'var(--wd-silver)';
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick
  }, handlers, {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--wd-font-body)',
      WebkitTapHighlightColor: 'transparent',
      transition: 'transform 0.1s ease, color 0.15s ease',
      color,
      ...pressedStyle
    }
  }), typeof tab.icon === 'string' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: tab.icon,
    size: 24,
    strokeWidth: active ? 2.4 : 2,
    color: color
  }) : tab.icon, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: active ? 600 : 500,
      marginTop: 2
    }
  }, tab.label));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/overlays/Sheet.jsx
try { (() => {
const {
  useEffect,
  useState
} = React; // The one popup surface: centered modal panel over a dim backdrop.
// (App name "Sheet" is historical — layout is a centered modal.)
// `inline` renders without fixed positioning for previews/cards.
function Sheet({
  open = true,
  onClose,
  title,
  children,
  inline = false
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) requestAnimationFrame(() => setVisible(true));else setVisible(false);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onEsc = e => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: inline ? 'relative' : 'fixed',
      inset: inline ? undefined : 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.22s ease',
      opacity: visible ? 1 : 0,
      minHeight: inline ? 320 : undefined,
      width: inline ? '100%' : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 'calc(100% - 32px)',
      maxWidth: 480,
      maxHeight: '85dvh',
      background: 'var(--wd-surface)',
      borderRadius: 24,
      boxShadow: 'var(--wd-shadow-lg)',
      overflowY: 'auto',
      transition: 'opacity 0.18s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1)' : 'scale(0.95)'
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 20px 12px',
      fontSize: 20,
      fontWeight: 700,
      color: 'var(--wd-text)',
      letterSpacing: '-0.01em'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px 20px'
    }
  }, children)));
}
Object.assign(__ds_scope, { Sheet });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlays/Sheet.jsx", error: String((e && e.message) || e) }); }

// components/overlays/ConfirmDialog.jsx
try { (() => {
// The one confirmation dialog for consequential actions. destructive adds the
// "This cannot be undone" warning strip. (App version also supports typed-text
// confirmation and async busy/error state.)
function ConfirmDialog({
  title,
  children,
  confirmLabel = 'Confirm',
  destructive = false,
  onConfirm,
  onClose,
  inline = false
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Sheet, {
    open: true,
    onClose: onClose,
    title: title,
    inline: inline
  }, destructive ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      padding: 14,
      background: 'var(--wd-danger-soft)',
      borderRadius: 12,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "alert-triangle",
    size: 18,
    color: "var(--wd-danger)",
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: 'var(--wd-danger)',
      marginBottom: 4
    }
  }, "This cannot be undone"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--wd-text-muted)',
      lineHeight: 1.45
    }
  }, children))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      color: 'var(--wd-text-muted)',
      lineHeight: 1.5,
      marginBottom: 18
    }
  }, children), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    size: "lg",
    fullWidth: true,
    onClick: onClose
  }, "Cancel"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: destructive ? 'danger' : 'primary',
    size: "lg",
    fullWidth: true,
    onClick: onConfirm
  }, confirmLabel)));
}
Object.assign(__ds_scope, { ConfirmDialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlays/ConfirmDialog.jsx", error: String((e && e.message) || e) }); }

// components/overlays/Toast.jsx
try { (() => {
// Card-styled toast, bottom-center, with optional delta pill and Undo action.
// Every grant surfaces one — the toast IS the undo mechanism.
function Toast({
  message,
  delta,
  actionLabel,
  onAction,
  inline = false,
  style
}) {
  const showBadge = typeof delta === 'number';
  const isPositive = showBadge && delta > 0;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      position: inline ? 'relative' : 'fixed',
      bottom: inline ? undefined : 'calc(var(--wd-tab-bar-height) + 14px + env(safe-area-inset-bottom))',
      left: inline ? undefined : '50%',
      transform: inline ? undefined : 'translateX(-50%)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: 10,
      paddingRight: 14,
      background: 'var(--wd-surface)',
      border: '1px solid var(--wd-border)',
      borderRadius: 20,
      boxShadow: 'var(--wd-shadow-lg)',
      fontFamily: 'var(--wd-font-body)',
      fontSize: 13,
      zIndex: 300,
      maxWidth: 'min(calc(100% - 24px), 460px)',
      ...style
    }
  }, showBadge && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 40,
      height: 32,
      padding: '0 10px',
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      flexShrink: 0,
      color: isPositive ? 'var(--wd-success)' : 'var(--wd-danger)',
      background: isPositive ? 'var(--wd-success-soft)' : 'var(--wd-danger-soft)'
    }
  }, isPositive ? '+' : '', delta), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      color: 'var(--wd-text)',
      fontWeight: 500,
      letterSpacing: '-0.005em',
      lineHeight: 1.3
    }
  }, message), actionLabel && /*#__PURE__*/React.createElement("button", {
    onClick: onAction,
    type: "button",
    style: {
      background: 'transparent',
      border: 'none',
      color: 'var(--wd-accent)',
      padding: '6px 8px',
      margin: '-6px -4px -6px 0',
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: 'inherit',
      WebkitTapHighlightColor: 'transparent',
      flexShrink: 0
    }
  }, actionLabel));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlays/Toast.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Screens1.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Login + Dashboard screens (recreated from frontend/src/components/login + dashboard).
const DS1 = window.WellDoneDesignSystem_96828f;
function usePressable() {
  const [pressed, setPressed] = React.useState(false);
  const handlers = {
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    onTouchStart: () => setPressed(true),
    onTouchEnd: () => setPressed(false),
    onTouchCancel: () => setPressed(false)
  };
  return {
    pressed,
    handlers,
    pressedStyle: pressed ? {
      transform: 'scale(0.97)'
    } : {}
  };
}
function LoginScreen({
  onSignIn
}) {
  const {
    Button,
    Input
  } = DS1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 380,
      background: 'var(--wd-surface)',
      padding: 32,
      borderRadius: 24,
      boxShadow: 'var(--wd-shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 32,
      fontWeight: 700,
      color: 'var(--wd-text)',
      margin: '0 0 4px',
      letterSpacing: '-0.02em'
    }
  }, "Well Done"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--wd-text-muted)',
      margin: '0 0 24px'
    }
  }, "Sign in to your classroom"), /*#__PURE__*/React.createElement(Input, {
    type: "email",
    placeholder: "Email",
    defaultValue: "teacher@school.edu"
  }), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    placeholder: "Password",
    defaultValue: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
  }), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: onSignIn
  }, "Sign in"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--wd-text-muted)',
      marginTop: 14,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: linkBtnStyle1,
    type: "button"
  }, "Forgot password?")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--wd-text-muted)',
      marginTop: 14,
      textAlign: 'center'
    }
  }, "New here? ", /*#__PURE__*/React.createElement("button", {
    style: linkBtnStyle1,
    type: "button"
  }, "Create an account"))));
}
const linkBtnStyle1 = {
  background: 'transparent',
  border: 'none',
  padding: 0,
  color: 'var(--wd-accent)',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
  textDecoration: 'underline'
};
function StudentListItem({
  student,
  onClick,
  selectable,
  selected
}) {
  const {
    Avatar,
    Icon
  } = DS1;
  const {
    handlers,
    pressedStyle
  } = usePressable();
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick
  }, handlers, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '14px 14px 14px 16px',
      background: 'var(--wd-surface)',
      border: '1px solid var(--wd-border)',
      borderRadius: 20,
      cursor: 'pointer',
      width: '100%',
      fontFamily: 'var(--wd-font-body)',
      transition: 'transform 0.1s ease, box-shadow 0.15s ease',
      WebkitTapHighlightColor: 'transparent',
      boxShadow: selected ? '0 0 0 2px var(--wd-accent), var(--wd-shadow-sm)' : 'var(--wd-shadow-sm)',
      ...pressedStyle
    }
  }), selectable && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 7,
      flexShrink: 0,
      border: selected ? '2px solid var(--wd-accent)' : '2px solid var(--wd-border)',
      background: selected ? 'var(--wd-accent)' : 'var(--wd-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, selected && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14,
    color: "#fff",
    strokeWidth: 3
  })), /*#__PURE__*/React.createElement(Avatar, {
    student: student,
    size: 56,
    emojiSize: 30
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 600,
      color: 'var(--wd-text)',
      marginBottom: 4,
      letterSpacing: '-0.01em'
    }
  }, student.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      minHeight: 15
    }
  }, student.streak > 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 12,
    color: "var(--wd-accent)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--wd-accent-dark)',
      fontWeight: 700
    }
  }, student.streak)))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      color: 'var(--wd-text)',
      lineHeight: 1,
      letterSpacing: '-0.025em',
      fontFamily: 'var(--wd-font-display)'
    }
  }, student.points), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--wd-text-faint)',
      marginTop: 3,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      fontWeight: 500
    }
  }, "points")), !selectable && /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 18,
    color: "var(--wd-text-faint)"
  }));
}
function SortControl({
  value,
  onChange
}) {
  const {
    Icon
  } = DS1;
  const opts = [{
    key: 'recent',
    label: 'Recent'
  }, {
    key: 'name',
    label: 'A–Z'
  }, {
    key: 'pointsDesc',
    label: 'High'
  }, {
    key: 'pointsAsc',
    label: 'Low'
  }];
  const current = opts.find(o => o.key === value) || opts[0];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '0 12px',
      borderRadius: 999,
      background: 'var(--wd-surface-alt)',
      minHeight: 44,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-down",
    size: 14,
    color: "var(--wd-text)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--wd-text)'
    }
  }, current.label), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 14,
    color: "var(--wd-text-muted)"
  }), /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: e => onChange(e.target.value),
    "aria-label": "Sort students",
    style: {
      position: 'absolute',
      inset: 0,
      opacity: 0,
      cursor: 'pointer',
      border: 'none',
      appearance: 'none'
    }
  }, opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.key,
    value: o.key
  }, o.label))));
}
function BulkGrantEntry({
  onClick
}) {
  const {
    Icon
  } = DS1;
  const {
    handlers,
    pressedStyle
  } = usePressable();
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick
  }, handlers, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      width: '100%',
      padding: '12px 16px',
      marginBottom: 14,
      background: 'var(--wd-accent-soft)',
      border: 'none',
      borderRadius: 16,
      color: 'var(--wd-accent-dark)',
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: 'var(--wd-font-body)',
      WebkitTapHighlightColor: 'transparent',
      transition: 'transform 0.1s ease',
      ...pressedStyle
    }
  }), /*#__PURE__*/React.createElement(Icon, {
    name: "user-plus",
    size: 16,
    strokeWidth: 2.2
  }), "Award to multiple students");
}
function DashboardScreen({
  students,
  onSelectStudent,
  classroomName,
  yearLabel
}) {
  const {
    AppHeader,
    SearchBar,
    Fab,
    IconButton,
    Icon
  } = DS1;
  const [search, setSearch] = React.useState('');
  const [sortKey, setSortKey] = React.useState('recent');
  const [selectMode, setSelectMode] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState(new Set());
  const sorted = React.useMemo(() => {
    let list = search ? students.filter(s => s.name.toLowerCase().includes(search.toLowerCase())) : [...students];
    if (sortKey === 'name') list.sort((a, b) => a.name.localeCompare(b.name));else if (sortKey === 'pointsDesc') list.sort((a, b) => b.points - a.points);else if (sortKey === 'pointsAsc') list.sort((a, b) => a.points - b.points);else list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
  }, [students, search, sortKey]);
  const toggle = id => setSelectedIds(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppHeader, {
    title: selectMode ? 'Select students' : classroomName,
    subtitle: selectMode ? `${selectedIds.size} selected` : `${yearLabel} · ${students.length} students`,
    action: selectMode ? /*#__PURE__*/React.createElement(IconButton, {
      ariaLabel: "Cancel selection",
      onClick: () => {
        setSelectMode(false);
        setSelectedIds(new Set());
      },
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "x",
        size: 18,
        color: "var(--wd-text)"
      })
    }) : null
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 120px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 14,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(SearchBar, {
    value: search,
    onChange: setSearch
  }), /*#__PURE__*/React.createElement(SortControl, {
    value: sortKey,
    onChange: setSortKey
  })), !selectMode && /*#__PURE__*/React.createElement(BulkGrantEntry, {
    onClick: () => setSelectMode(true)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, sorted.map(s => /*#__PURE__*/React.createElement(StudentListItem, {
    key: s.id,
    student: s,
    selectable: selectMode,
    selected: selectedIds.has(s.id),
    onClick: () => selectMode ? toggle(s.id) : onSelectStudent(s.id)
  })))), !selectMode && /*#__PURE__*/React.createElement(Fab, {
    fixed: false,
    style: {
      position: 'absolute',
      bottom: 84,
      right: 20
    }
  }), selectMode && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 64,
      padding: '12px 16px',
      background: 'var(--wd-surface-translucent)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--wd-border)'
    }
  }, /*#__PURE__*/React.createElement(DS1.Button, {
    fullWidth: true,
    size: "lg",
    disabled: selectedIds.size === 0
  }, "Award to ", selectedIds.size || '…', " students")));
}
Object.assign(window, {
  LoginScreen,
  DashboardScreen,
  StudentListItem,
  SortControl
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Screens1.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Screens2.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Profile, Stats, Settings screens (recreated from frontend/src/components/profile, stats, settings).
const DS2 = window.WellDoneDesignSystem_96828f;
function usePressable() {
  const [pressed, setPressed] = React.useState(false);
  const handlers = {
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    onTouchStart: () => setPressed(true),
    onTouchEnd: () => setPressed(false),
    onTouchCancel: () => setPressed(false)
  };
  return {
    pressed,
    handlers,
    pressedStyle: pressed ? {
      transform: 'scale(0.97)'
    } : {}
  };
}
function ModeToggle({
  mode,
  setMode,
  amount
}) {
  const {
    Icon
  } = DS2;
  const Btn = ({
    m,
    icon,
    children
  }) => {
    const {
      handlers,
      pressedStyle
    } = usePressable();
    const active = mode === m;
    return /*#__PURE__*/React.createElement("button", _extends({
      onClick: () => setMode(m)
    }, handlers, {
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '10px 14px',
        border: 'none',
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'var(--wd-font-body)',
        WebkitTapHighlightColor: 'transparent',
        transition: 'background 0.18s ease, box-shadow 0.18s ease, color 0.18s ease',
        background: active ? 'var(--wd-surface)' : 'transparent',
        color: active ? 'var(--wd-text)' : 'var(--wd-text-muted)',
        boxShadow: active ? 'var(--wd-shadow-sm)' : 'none',
        ...pressedStyle
      }
    }), /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 14,
      strokeWidth: 2.5
    }), children);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      padding: 4,
      background: 'var(--wd-surface-alt)',
      borderRadius: 16,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    m: "grant",
    icon: "plus"
  }, "Award ", amount), /*#__PURE__*/React.createElement(Btn, {
    m: "revoke",
    icon: "minus"
  }, "Revoke ", amount));
}
function ReasonSheet({
  amount,
  onClose,
  onCommit
}) {
  const {
    Sheet
  } = DS2;
  const [mode, setMode] = React.useState('grant');
  const ReasonCard = ({
    reason
  }) => {
    const {
      handlers,
      pressedStyle
    } = usePressable();
    return /*#__PURE__*/React.createElement("button", _extends({
      onClick: () => onCommit(mode === 'revoke' ? -amount : amount, reason)
    }, handlers, {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--wd-surface-alt)',
        border: 'none',
        borderRadius: 16,
        padding: '20px 12px',
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--wd-text)',
        fontFamily: 'var(--wd-font-body)',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        textAlign: 'center',
        minHeight: 58,
        transition: 'transform 0.1s ease, background 0.15s ease',
        ...pressedStyle
      }
    }), reason);
  };
  return /*#__PURE__*/React.createElement(Sheet, {
    open: true,
    onClose: onClose,
    title: "Why?"
  }, /*#__PURE__*/React.createElement(ModeToggle, {
    mode: mode,
    setMode: setMode,
    amount: amount
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      marginBottom: 10
    }
  }, window.WD_REASONS.map(r => /*#__PURE__*/React.createElement(ReasonCard, {
    key: r,
    reason: r
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      width: '100%',
      background: 'transparent',
      border: 'none',
      color: 'var(--wd-text-muted)',
      fontSize: 13,
      fontWeight: 500,
      padding: '12px 0 4px',
      cursor: 'pointer',
      fontFamily: 'inherit'
    }
  }, "+ Other reason\u2026"));
}
function QuickGrantRow({
  onPick
}) {
  const {
    Icon
  } = DS2;
  const QuickBtn = ({
    n
  }) => {
    const {
      handlers,
      pressedStyle
    } = usePressable();
    return /*#__PURE__*/React.createElement("button", _extends({
      onClick: () => onPick(n)
    }, handlers, {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--wd-accent)',
        color: '#fff',
        border: 'none',
        borderRadius: 16,
        padding: '14px 0',
        fontSize: 17,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'var(--wd-font-body)',
        minHeight: 56,
        WebkitTapHighlightColor: 'transparent',
        transition: 'transform 0.1s ease',
        boxShadow: '0 2px 6px rgba(239, 131, 84, 0.28)',
        ...pressedStyle
      }
    }), n);
  };
  const More = () => {
    const {
      handlers,
      pressedStyle
    } = usePressable();
    return /*#__PURE__*/React.createElement("button", _extends({
      "aria-label": "Custom amount"
    }, handlers, {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--wd-surface)',
        border: 'none',
        borderRadius: 16,
        padding: '14px 0',
        cursor: 'pointer',
        minHeight: 56,
        WebkitTapHighlightColor: 'transparent',
        transition: 'transform 0.1s ease',
        boxShadow: 'var(--wd-shadow-md)',
        ...pressedStyle
      }
    }), /*#__PURE__*/React.createElement(Icon, {
      name: "more-horizontal",
      size: 20,
      color: "var(--wd-text)"
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 8,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(QuickBtn, {
    n: 1
  }), /*#__PURE__*/React.createElement(QuickBtn, {
    n: 2
  }), /*#__PURE__*/React.createElement(QuickBtn, {
    n: 5
  }), /*#__PURE__*/React.createElement(More, null));
}
function ProfileScreen({
  student,
  onBack,
  activity,
  onGrant
}) {
  const {
    AppHeader,
    IconButton,
    Icon,
    Avatar,
    Chip,
    Card
  } = DS2;
  const [pendingAmount, setPendingAmount] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppHeader, {
    title: student.name,
    left: /*#__PURE__*/React.createElement(IconButton, {
      ariaLabel: "Back",
      onClick: onBack,
      icon: /*#__PURE__*/React.createElement(Icon, {
        name: "chevron-left",
        size: 18,
        color: "var(--wd-text)"
      })
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 100px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 0 12px',
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 32,
      overflow: 'hidden',
      boxShadow: 'var(--wd-shadow-md)',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    student: student,
    size: 120,
    radius: 32,
    emojiSize: 56
  })), student.streak > 1 && /*#__PURE__*/React.createElement(Chip, {
    tone: "accent",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "flame",
      size: 14,
      color: "var(--wd-accent-dark)"
    })
  }, student.streak, " day streak"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 64,
      fontWeight: 800,
      color: 'var(--wd-accent)',
      letterSpacing: '-0.04em',
      lineHeight: 1,
      fontFamily: 'var(--wd-font-display)'
    }
  }, student.points), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--wd-text-muted)',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      fontWeight: 500,
      marginTop: 6
    }
  }, "points earned"))), /*#__PURE__*/React.createElement(QuickGrantRow, {
    onPick: setPendingAmount
  }), /*#__PURE__*/React.createElement(Card, {
    title: "Activity"
  }, activity.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 0',
      borderBottom: i === activity.length - 1 ? 'none' : '1px solid var(--wd-border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      color: 'var(--wd-text)',
      fontWeight: 500,
      letterSpacing: '-0.005em'
    }
  }, e.reason), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--wd-text-faint)',
      marginTop: 2
    }
  }, e.when)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      padding: '4px 10px',
      borderRadius: 999,
      minWidth: 38,
      textAlign: 'center',
      color: e.delta > 0 ? 'var(--wd-success)' : 'var(--wd-danger)',
      background: e.delta > 0 ? 'var(--wd-success-soft)' : 'var(--wd-danger-soft)'
    }
  }, e.delta > 0 ? '+' : '', e.delta)))), /*#__PURE__*/React.createElement(Card, {
    title: "Notes",
    subtitle: "Only you can see these"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      color: 'var(--wd-text)',
      lineHeight: 1.5
    }
  }, "Great progress with reading group this week. Pair with Leo for math."))), pendingAmount !== null && /*#__PURE__*/React.createElement(ReasonSheet, {
    amount: pendingAmount,
    onClose: () => setPendingAmount(null),
    onCommit: (delta, reason) => {
      setPendingAmount(null);
      onGrant(student.id, delta, reason);
    }
  }));
}
function StatsScreen({
  students,
  yearLabel
}) {
  const {
    AppHeader,
    Icon
  } = DS2;
  const totalPoints = students.reduce((s, x) => s + x.points, 0);
  const onFire = students.filter(s => s.streak > 1).length;
  const avg = Math.round(totalPoints / students.length);
  const top = window.WD_TOP_REASONS;
  const max = top[0].count;
  const tileLabel = {
    fontSize: 13,
    color: 'var(--wd-text-muted)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppHeader, {
    title: "Statistics",
    subtitle: yearLabel
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 16px 100px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / 3',
      background: 'var(--wd-gunmetal)',
      borderRadius: 24,
      padding: '24px 22px 22px',
      boxShadow: 'var(--wd-shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--wd-silver)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 6
    }
  }, "Total points"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 60,
      fontWeight: 800,
      color: 'var(--wd-accent)',
      letterSpacing: '-0.04em',
      lineHeight: 1,
      fontFamily: 'var(--wd-font-display)'
    }
  }, totalPoints.toLocaleString()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--wd-silver)',
      marginTop: 8
    }
  }, "across ", students.length, " students")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--wd-surface)',
      borderRadius: 20,
      padding: '16px 18px',
      boxShadow: 'var(--wd-shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: tileLabel
  }, "Avg / student"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 34,
      fontWeight: 800,
      color: 'var(--wd-text)',
      letterSpacing: '-0.02em',
      lineHeight: 1,
      fontFamily: 'var(--wd-font-display)'
    }
  }, avg)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--wd-slate-soft)',
      borderRadius: 20,
      padding: '16px 18px',
      boxShadow: 'var(--wd-shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...tileLabel,
      color: 'var(--wd-slate)'
    }
  }, "On streak"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 34,
      fontWeight: 800,
      color: 'var(--wd-text)',
      letterSpacing: '-0.02em',
      lineHeight: 1,
      fontFamily: 'var(--wd-font-display)',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 22,
    color: "var(--wd-accent)"
  }), /*#__PURE__*/React.createElement("span", null, onFire))), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / 3',
      background: 'var(--wd-surface)',
      borderRadius: 20,
      padding: 20,
      boxShadow: 'var(--wd-shadow-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      color: 'var(--wd-text-muted)',
      fontWeight: 600,
      marginBottom: 14,
      textTransform: 'uppercase',
      letterSpacing: 0.6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trending-up",
    size: 14,
    color: "var(--wd-text-muted)"
  }), /*#__PURE__*/React.createElement("span", null, "Top reasons \xB7 last 30 days")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, top.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.reason,
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 14px',
      borderRadius: 12,
      overflow: 'hidden',
      background: 'var(--wd-surface-alt)',
      minHeight: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      background: 'var(--wd-accent-soft)',
      width: `${r.count / max * 100}%`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      fontSize: 15,
      color: 'var(--wd-text)',
      fontWeight: 600
    }
  }, r.reason), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      fontSize: 13,
      color: 'var(--wd-accent-dark)',
      fontWeight: 700
    }
  }, r.count)))))));
}
function SettingsScreen({
  onSignOut
}) {
  const {
    AppHeader,
    Icon
  } = DS2;
  const Row = ({
    icon,
    iconColor = 'var(--wd-slate)',
    label,
    value,
    isFirst,
    isLast
  }) => {
    const {
      handlers,
      pressedStyle
    } = usePressable();
    return /*#__PURE__*/React.createElement("button", _extends({}, handlers, {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 16px',
        background: 'var(--wd-surface)',
        border: 'none',
        cursor: 'pointer',
        width: '100%',
        fontFamily: 'var(--wd-font-body)',
        WebkitTapHighlightColor: 'transparent',
        transition: 'transform 0.1s ease',
        borderRadius: 0,
        borderTopLeftRadius: isFirst ? 20 : 0,
        borderTopRightRadius: isFirst ? 20 : 0,
        borderBottomLeftRadius: isLast ? 20 : 0,
        borderBottomRightRadius: isLast ? 20 : 0,
        borderBottom: isLast ? 'none' : '1px solid var(--wd-border)',
        ...pressedStyle
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 12,
        background: 'var(--wd-slate-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 18,
      color: iconColor
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: 'var(--wd-text)',
        letterSpacing: '-0.005em'
      }
    }, label), value && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--wd-text-muted)',
        marginTop: 1
      }
    }, value)), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18,
      color: "var(--wd-text-faint)"
    }));
  };
  const group = {
    background: 'var(--wd-surface)',
    borderRadius: 20,
    boxShadow: 'var(--wd-shadow-md)',
    marginBottom: 18,
    overflow: 'hidden'
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AppHeader, {
    title: "Settings"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 16px 100px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: group
  }, /*#__PURE__*/React.createElement(Row, {
    icon: "users",
    label: "Classroom",
    value: "Ms. Rivera's Class",
    isFirst: true
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "calendar",
    label: "School year",
    value: "2025\u20132026",
    isLast: true
  })), /*#__PURE__*/React.createElement("div", {
    style: group
  }, /*#__PURE__*/React.createElement(Row, {
    icon: "check",
    iconColor: "var(--wd-text-muted)",
    label: "Privacy Policy",
    isFirst: true
  }), /*#__PURE__*/React.createElement(Row, {
    icon: "mail",
    iconColor: "var(--wd-text-muted)",
    label: "Terms of Service",
    isLast: true
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onSignOut,
    style: {
      width: '100%',
      background: 'var(--wd-surface)',
      border: 'none',
      borderRadius: 20,
      padding: '16px 18px',
      boxShadow: 'var(--wd-shadow-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      color: 'var(--wd-danger)',
      fontSize: 15,
      fontWeight: 600,
      fontFamily: 'var(--wd-font-body)',
      cursor: 'pointer',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "log-out",
    size: 18,
    color: "var(--wd-danger)"
  }), /*#__PURE__*/React.createElement("span", null, "Sign out")), /*#__PURE__*/React.createElement("button", {
    style: {
      width: '100%',
      background: 'transparent',
      border: 'none',
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      color: 'var(--wd-danger)',
      fontSize: 13,
      fontWeight: 500,
      fontFamily: 'var(--wd-font-body)',
      cursor: 'pointer',
      opacity: 0.85
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: 18,
    color: "var(--wd-danger)"
  }), /*#__PURE__*/React.createElement("span", null, "Delete account"))));
}
Object.assign(window, {
  ProfileScreen,
  StatsScreen,
  SettingsScreen,
  ReasonSheet,
  QuickGrantRow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Screens2.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
// Sample classroom data for the UI kit demo.
const WD_STUDENTS = [{
  id: 's1',
  name: 'Maya Rodriguez',
  photo: '🦊',
  points: 128,
  streak: 6,
  createdAt: '9'
}, {
  id: 's2',
  name: 'Leo Kim',
  photo: '🐢',
  points: 114,
  streak: 0,
  createdAt: '8'
}, {
  id: 's3',
  name: 'Ana Whitfield',
  photo: '🌟',
  points: 96,
  streak: 3,
  createdAt: '7'
}, {
  id: 's4',
  name: 'Dominic Okafor',
  photo: '',
  points: 91,
  streak: 0,
  createdAt: '6'
}, {
  id: 's5',
  name: 'Priya Natarajan',
  photo: '🦋',
  points: 87,
  streak: 2,
  createdAt: '5'
}, {
  id: 's6',
  name: 'Sam Alvarez',
  photo: '🐸',
  points: 73,
  streak: 0,
  createdAt: '4'
}, {
  id: 's7',
  name: 'June Park',
  photo: '🐰',
  points: 62,
  streak: 4,
  createdAt: '3'
}, {
  id: 's8',
  name: 'Theo Brandt',
  photo: '',
  points: 41,
  streak: 0,
  createdAt: '2'
}];
const WD_ACTIVITY = {
  s1: [{
    reason: 'Kindness',
    delta: 5,
    when: 'Today'
  }, {
    reason: 'Participation',
    delta: 2,
    when: 'Today'
  }, {
    reason: 'Helping',
    delta: 1,
    when: 'Yesterday'
  }, {
    reason: 'Talking during quiet time',
    delta: -1,
    when: 'Yesterday'
  }, {
    reason: 'Homework',
    delta: 2,
    when: '3 days ago'
  }, {
    reason: 'Teamwork',
    delta: 5,
    when: 'Jan 12'
  }]
};
const WD_REASONS = ['Kindness', 'Effort', 'Helping', 'Homework', 'Participation', 'Listening', 'Cleanup', 'Teamwork'];
const WD_TOP_REASONS = [{
  reason: 'Effort',
  count: 42
}, {
  reason: 'Kindness',
  count: 35
}, {
  reason: 'Participation',
  count: 28
}, {
  reason: 'Homework',
  count: 19
}, {
  reason: 'Teamwork',
  count: 12
}];
Object.assign(window, {
  WD_STUDENTS,
  WD_ACTIVITY,
  WD_REASONS,
  WD_TOP_REASONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Fab = __ds_scope.Fab;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.ErrorBanner = __ds_scope.ErrorBanner;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.SkeletonRow = __ds_scope.SkeletonRow;

__ds_ns.SkeletonList = __ds_scope.SkeletonList;

__ds_ns.Label = __ds_scope.Label;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SearchBar = __ds_scope.SearchBar;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.AppHeader = __ds_scope.AppHeader;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.ConfirmDialog = __ds_scope.ConfirmDialog;

__ds_ns.Sheet = __ds_scope.Sheet;

__ds_ns.Toast = __ds_scope.Toast;

})();
