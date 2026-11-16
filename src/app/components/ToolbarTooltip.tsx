export function ToolbarTooltip({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="ui-hint invisible absolute bottom-full left-1/2 z-[21] mb-2 -translate-x-1/2 group-hover/toolbar:visible group-focus-visible/toolbar:visible"
    >
      {label}
    </span>
  );
}
