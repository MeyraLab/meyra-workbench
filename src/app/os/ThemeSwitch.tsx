type Props = {
  resolved: "light" | "dark";
  beat: number;
  total: number;
  onTheme: () => void;
};

export function ThemeSwitch({ resolved, beat, total, onTheme }: Props) {
  const night = resolved === "dark";

  return (
    <div className="os-hud-cluster">
      <button
        type="button"
        className={`os-theme-switch${night ? " is-night" : " is-day"}`}
        aria-label={night ? "Switch to day" : "Switch to night"}
        aria-pressed={night}
        onClick={onTheme}
      >
        <span className="os-theme-track" aria-hidden="true">
          {night ? (
            <span className="os-theme-knob is-left">
              <svg className="os-crescent" viewBox="0 0 24 24" fill="none">
                <path
                  fill="#f4e9c8"
                  d="M13.2 3.1a9 9 0 1 0 7.7 14.3A7.15 7.15 0 0 1 13.2 3.1Z"
                />
              </svg>
              <i className="twinkle t1" />
              <i className="twinkle t2" />
              <i className="twinkle t3" />
            </span>
          ) : (
            <>
              <span className="os-puff p1" />
              <span className="os-puff p2" />
              <span className="os-theme-knob is-right">
                <span className="os-sun" />
              </span>
            </>
          )}
        </span>
      </button>
      <span className="os-beat" aria-label={`Scene ${beat} of ${total}`}>
        <span className="os-beat-star" aria-hidden="true" />
        {beat}/{total}
        <span className="os-beat-caret" aria-hidden="true" />
      </span>
    </div>
  );
}
