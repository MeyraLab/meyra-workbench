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
            <>
              <span className="os-moon" />
              <span className="os-spark s1" />
              <span className="os-spark s2" />
              <span className="os-spark s3" />
            </>
          ) : (
            <>
              <span className="os-sun" />
              <span className="os-puff p1" />
              <span className="os-puff p2" />
            </>
          )}
        </span>
      </button>
      <span className="os-beat" aria-label={`Scene ${beat} of ${total}`}>
        <span className="os-beat-star" aria-hidden="true" />
        {beat}/{total}
      </span>
    </div>
  );
}
