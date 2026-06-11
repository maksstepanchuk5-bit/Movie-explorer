type Props = {
  className?: string;
  label: string;
};

export function PosterPlaceholder({ className = "", label }: Props) {
  return (
    <div
      className={["poster-placeholder", className].filter(Boolean).join(" ")}
      role="img"
      aria-label={label}
    >
      <img
        className="poster-placeholder-icon"
        src="/poster-placeholder-icon.svg"
        alt=""
        aria-hidden="true"
        decoding="async"
      />
    </div>
  );
}
