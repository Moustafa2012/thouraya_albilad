'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Info, Pencil, Check, X, ChevronDown } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export const glassInputBaseCls =
  'h-10 w-full bg-background/60 backdrop-blur-sm text-sm border border-border/70 hover:border-border focus:border-primary/60 transition-colors rounded-md px-3 outline-none disabled:opacity-50 disabled:cursor-not-allowed';

export const inputCls = glassInputBaseCls;

const toSafeId = (value?: string) =>
  value?.replace(/[^a-zA-Z0-9\-_:.]/g, '');

type RenderControlProps = {
  id: string;
  describedBy?: string;
  invalid?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
};

// ─── Autocomplete Types ───────────────────────────────────────────────────────

export type AutocompleteOption =
  | string
  | { label: string; value: string; description?: string };

export interface AutocompleteConfig {
  /** List of options to suggest */
  options: AutocompleteOption[];
  /** Max suggestions shown at once (default: 6) */
  maxVisible?: number;
  /** Allow free-form input not in the options list (default: true) */
  allowFreeInput?: boolean;
  /** Filter mode: 'startsWith' | 'includes' (default: 'includes') */
  filterMode?: 'startsWith' | 'includes';
  /** Callback when an option is selected */
  onSelect?: (value: string, option: AutocompleteOption) => void;
}

// ─── Edit Mode Types ──────────────────────────────────────────────────────────

export interface EditModeConfig {
  /** Start in read (display) mode */
  initialMode?: 'read' | 'edit';
  /** Display value shown in read mode (falls back to current input value) */
  displayValue?: string;
  /** Placeholder shown in read mode when there is no value */
  emptyText?: string;
  /** Called when the user confirms the edit (returns the new value) */
  onConfirm?: (value: string) => void | Promise<void>;
  /** Called when the user cancels the edit */
  onCancel?: () => void;
  /** Show confirm/cancel action buttons (default: true) */
  showActions?: boolean;
}

// ─── Main Props ───────────────────────────────────────────────────────────────

export interface GlassFieldProps {
  id?: string;
  name?: string;
  label?: string;
  labelAr?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  isRtl?: boolean;
  className?: string;
  labelClassName?: string;
  controlClassName?: string;
  messageClassName?: string;
  renderControl?: (props: RenderControlProps) => React.ReactNode;
  children?: React.ReactNode;
  /** Enable inline autocomplete suggestions */
  autocomplete?: AutocompleteConfig;
  /** Enable read/edit toggle mode */
  editMode?: EditModeConfig;
  /** Controlled value (required when using autocomplete or editMode) */
  value?: string;
  /** onChange handler */
  onChange?: (value: string) => void;
}

// ─── Autocomplete Dropdown ────────────────────────────────────────────────────

function normalizeOption(opt: AutocompleteOption): { label: string; value: string; description?: string } {
  return typeof opt === 'string' ? { label: opt, value: opt } : opt;
}

interface AutocompleteDropdownProps {
  options: AutocompleteOption[];
  query: string;
  maxVisible: number;
  filterMode: 'startsWith' | 'includes';
  activeIndex: number;
  onSelect: (opt: AutocompleteOption) => void;
  id: string;
  isRtl?: boolean;
}

function AutocompleteDropdown({
  options,
  query,
  maxVisible,
  filterMode,
  activeIndex,
  onSelect,
  id,
  isRtl,
}: AutocompleteDropdownProps) {
  const filtered = React.useMemo(() => {
    if (!query) return options.slice(0, maxVisible);
    const q = query.toLowerCase();
    return options
      .filter((opt) => {
        const label = normalizeOption(opt).label.toLowerCase();
        return filterMode === 'startsWith' ? label.startsWith(q) : label.includes(q);
      })
      .slice(0, maxVisible);
  }, [options, query, maxVisible, filterMode]);

  if (!filtered.length) return null;

  return (
    <motion.ul
      id={`${id}-listbox`}
      role="listbox"
      aria-label="Suggestions"
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className={cn(
        'absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border/60',
        'bg-background/90 backdrop-blur-md shadow-lg shadow-black/10',
        isRtl ? 'right-0' : 'left-0'
      )}
    >
      {filtered.map((opt, i) => {
        const { label, value, description } = normalizeOption(opt);
        const isActive = i === activeIndex;
        // Highlight matching segment
        const lowerLabel = label.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const matchIdx = lowerLabel.indexOf(lowerQuery);
        const before = matchIdx >= 0 ? label.slice(0, matchIdx) : label;
        const match = matchIdx >= 0 ? label.slice(matchIdx, matchIdx + query.length) : '';
        const after = matchIdx >= 0 ? label.slice(matchIdx + query.length) : '';

        return (
          <li
            key={value}
            id={`${id}-option-${i}`}
            role="option"
            aria-selected={isActive}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(opt);
            }}
            className={cn(
              'flex cursor-pointer flex-col gap-0.5 px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-foreground hover:bg-muted/60'
            )}
          >
            <span className="font-medium">
              {before}
              {match && (
                <span className="font-bold underline decoration-primary/50 underline-offset-2">
                  {match}
                </span>
              )}
              {after}
            </span>
            {description && (
              <span className="text-[11px] text-muted-foreground">{description}</span>
            )}
          </li>
        );
      })}
    </motion.ul>
  );
}

// ─── Edit Mode Read View ──────────────────────────────────────────────────────

interface EditReadViewProps {
  displayValue?: string;
  emptyText?: string;
  onEdit: () => void;
  disabled?: boolean;
  isRtl?: boolean;
  className?: string;
}

function EditReadView({ displayValue, emptyText = 'Click to edit…', onEdit, disabled, isRtl, className }: EditReadViewProps) {
  return (
    <div
      className={cn(
        'group flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-transparent',
        'bg-background/40 px-3 text-sm transition-all',
        'hover:border-border/60 hover:bg-background/60',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onClick={onEdit}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? onEdit() : undefined}
      aria-label="Edit value"
    >
      <span className={cn(!displayValue && 'text-muted-foreground/60 italic')}>
        {displayValue || emptyText}
      </span>
      <Pencil
        className={cn(
          'size-3.5 shrink-0 text-muted-foreground/40 transition-opacity',
          'opacity-0 group-hover:opacity-100',
          isRtl ? 'mr-auto' : 'ml-auto'
        )}
      />
    </div>
  );
}

// ─── Main GlassField ──────────────────────────────────────────────────────────

const GlassFieldRender: React.ForwardRefRenderFunction<HTMLDivElement, GlassFieldProps> = (
  props,
  ref
) => {
  const {
    id,
    name,
    label,
    labelAr,
    error,
    hint,
    required,
    disabled,
    readOnly,
    isRtl,
    className,
    labelClassName,
    controlClassName,
    messageClassName,
    renderControl,
    children,
    autocomplete,
    editMode,
    value: controlledValue,
    onChange,
  } = props;

  const autoId = React.useId();
  const safeNameId = React.useMemo(() => toSafeId(name), [name]);
  const controlId = React.useMemo(() => id ?? safeNameId ?? autoId, [id, safeNameId, autoId]);
  const errorId = `${controlId}-error`;
  const hintId = `${controlId}-hint`;

  const describedBy = React.useMemo(() => {
    const ids = [error ? errorId : null, hint ? hintId : null].filter(Boolean);
    return ids.length ? ids.join(' ') : undefined;
  }, [error, hint, errorId, hintId]);

  const resolvedLabel = React.useMemo(
    () => (isRtl ? labelAr ?? label : label ?? labelAr),
    [isRtl, labelAr, label]
  );

  // ── Edit Mode State ──────────────────────────────────────────────────
  const [editModeState, setEditModeState] = React.useState<'read' | 'edit'>(
    editMode?.initialMode ?? 'edit'
  );
  const [editDraftValue, setEditDraftValue] = React.useState(controlledValue ?? '');
  const [isConfirming, setIsConfirming] = React.useState(false);

  React.useEffect(() => {
    if (editMode) setEditDraftValue(controlledValue ?? '');
  }, [controlledValue, editMode]);

  const handleEditStart = () => {
    setEditDraftValue(controlledValue ?? '');
    setEditModeState('edit');
  };

  const handleEditConfirm = async () => {
    if (editMode?.onConfirm) {
      setIsConfirming(true);
      try {
        await editMode.onConfirm(editDraftValue);
      } finally {
        setIsConfirming(false);
      }
    }
    onChange?.(editDraftValue);
    setEditModeState('read');
    setShowDropdown(false);
  };

  const handleEditCancel = () => {
    setEditDraftValue(controlledValue ?? '');
    editMode?.onCancel?.();
    setEditModeState('read');
    setShowDropdown(false);
  };

  // ── Autocomplete State ───────────────────────────────────────────────
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const acOptions = autocomplete?.options ?? [];
  const acMaxVisible = autocomplete?.maxVisible ?? 6;
  const acFilterMode = autocomplete?.filterMode ?? 'includes';

  const currentInputValue = editMode ? editDraftValue : (controlledValue ?? '');

  const filteredOptions = React.useMemo(() => {
    if (!currentInputValue) return acOptions.slice(0, acMaxVisible);
    const q = currentInputValue.toLowerCase();
    return acOptions
      .filter((opt) => {
        const lbl = normalizeOption(opt).label.toLowerCase();
        return acFilterMode === 'startsWith' ? lbl.startsWith(q) : lbl.includes(q);
      })
      .slice(0, acMaxVisible);
  }, [acOptions, currentInputValue, acMaxVisible, acFilterMode]);

  const handleInputChange = (newVal: string) => {
    if (editMode) {
      setEditDraftValue(newVal);
    } else {
      onChange?.(newVal);
    }
    setActiveIndex(-1);
    setShowDropdown(true);
  };

  const handleSelectOption = (opt: AutocompleteOption) => {
    const { value: optVal } = normalizeOption(opt);
    if (editMode) {
      setEditDraftValue(optVal);
    } else {
      onChange?.(optVal);
    }
    autocomplete?.onSelect?.(optVal, opt);
    setShowDropdown(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!autocomplete || !showDropdown || !filteredOptions.length) {
      if (editMode && e.key === 'Enter') handleEditConfirm();
      if (editMode && e.key === 'Escape') handleEditCancel();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && filteredOptions[activeIndex]) {
        handleSelectOption(filteredOptions[activeIndex]);
      } else if (editMode) {
        handleEditConfirm();
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setActiveIndex(-1);
      if (editMode) handleEditCancel();
    }
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Decide what to render inside the field ────────────────────────────
  const isEditMode = !!editMode;
  const isReadState = isEditMode && editModeState === 'read';
  const showAutocomplete = !!autocomplete;

  const renderInlineInput = () => {
    const inputValue = isEditMode ? editDraftValue : (controlledValue ?? '');
    const inputNode = (
      <input
        ref={inputRef}
        id={controlId}
        aria-describedby={describedBy}
        aria-invalid={!!error}
        aria-required={required}
        aria-autocomplete={showAutocomplete ? 'list' : undefined}
        aria-controls={showAutocomplete ? `${controlId}-listbox` : undefined}
        aria-activedescendant={
          showAutocomplete && activeIndex >= 0
            ? `${controlId}-option-${activeIndex}`
            : undefined
        }
        required={required}
        disabled={disabled || isConfirming}
        readOnly={readOnly}
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => showAutocomplete && setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        className={cn(
          glassInputBaseCls,
          isEditMode && 'pr-20',
          showAutocomplete && 'pr-8',
          controlClassName
        )}
      />
    );

    return (
      <div ref={containerRef} className="relative">
        <div className="relative">
          {inputNode}

          {/* Autocomplete chevron */}
          {showAutocomplete && !isEditMode && (
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onMouseDown={(e) => {
                e.preventDefault();
                setShowDropdown((v) => !v);
                inputRef.current?.focus();
              }}
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-transform hover:text-muted-foreground',
                isRtl ? 'left-2.5' : 'right-2.5',
                showDropdown && 'rotate-180'
              )}
            >
              <ChevronDown className="size-3.5" />
            </button>
          )}

          {/* Edit mode actions */}
          {isEditMode && editModeState === 'edit' && editMode.showActions !== false && (
            <div
              className={cn(
                'absolute top-1/2 flex -translate-y-1/2 items-center gap-1',
                isRtl ? 'left-2' : 'right-2'
              )}
            >
              <button
                type="button"
                disabled={isConfirming}
                onClick={handleEditConfirm}
                aria-label="Confirm"
                className={cn(
                  'flex size-6 items-center justify-center rounded transition-colors',
                  'bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50'
                )}
              >
                {isConfirming
                  ? <span className="size-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  : <Check className="size-3" />
                }
              </button>
              <button
                type="button"
                onClick={handleEditCancel}
                aria-label="Cancel"
                className="flex size-6 items-center justify-center rounded bg-muted/60 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </div>
          )}
        </div>

        {/* Autocomplete dropdown */}
        {showAutocomplete && (
          <AnimatePresence>
            {showDropdown && filteredOptions.length > 0 && (
              <AutocompleteDropdown
                options={filteredOptions}
                query={inputValue}
                maxVisible={acMaxVisible}
                filterMode={acFilterMode}
                activeIndex={activeIndex}
                onSelect={handleSelectOption}
                id={controlId}
                isRtl={isRtl}
              />
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  // ── Final rendered control ────────────────────────────────────────────
  const renderFinalControl = () => {
    // Edit Mode — read state
    if (isReadState) {
      return (
        <EditReadView
          displayValue={editMode?.displayValue ?? controlledValue}
          emptyText={editMode?.emptyText}
          onEdit={handleEditStart}
          disabled={disabled}
          isRtl={isRtl}
          className={controlClassName}
        />
      );
    }

    // Autocomplete or EditMode active — render managed input
    if (showAutocomplete || isEditMode) {
      return renderInlineInput();
    }

    // Default: delegate to renderControl or children
    if (renderControl) {
      return renderControl({
        id: controlId,
        describedBy,
        invalid: !!error,
        required,
        disabled,
        readOnly,
        className: cn(glassInputBaseCls, controlClassName),
      });
    }

    return children;
  };

  return (
    <div
      ref={ref}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={cn('space-y-1.5', className)}
    >
      {resolvedLabel && (
        <Label
          htmlFor={controlId}
          className={cn(
            'flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground',
            labelClassName
          )}
        >
          {resolvedLabel}
          {required && (
            <span className="text-destructive" aria-hidden="true">*</span>
          )}
          {/* Edit mode badge */}
          {isEditMode && (
            <span
              className={cn(
                'ml-auto text-[10px] font-normal normal-case tracking-normal transition-colors',
                editModeState === 'edit' ? 'text-primary' : 'text-muted-foreground/50'
              )}
            >
              {editModeState === 'edit' ? 'editing' : 'saved'}
            </span>
          )}
        </Label>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={isReadState ? 'read' : 'edit'}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.12 }}
        >
          {renderFinalControl()}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            id={errorId}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              'flex items-center gap-1.5 text-xs font-medium text-destructive',
              messageClassName
            )}
          >
            <AlertCircle className="size-3 shrink-0" />
            {error}
          </motion.p>
        )}

        {hint && (
          <motion.p
            key="hint"
            id={hintId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'flex items-start gap-1.5 text-[11px] text-muted-foreground',
              messageClassName
            )}
          >
            <Info className="mt-0.5 size-3 shrink-0" />
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export const GlassField = React.forwardRef(GlassFieldRender);
GlassField.displayName = 'GlassField';