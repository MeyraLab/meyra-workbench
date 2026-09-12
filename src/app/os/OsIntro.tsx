import { useEffect } from "react";
import { APPS } from "../apps";

type Props = {
  onEnter: () => void;
};

export function OsIntro({ onEnter }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        onEnter();
      }
    };
    window.addEventListener("keydown", onKey);
    const timer = window.setTimeout(onEnter, 1800);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(timer);
    };
  }, [onEnter]);

  const count = String(APPS.length).padStart(2, "0");

  return (
    <div className="os-intro" role="dialog" aria-label="MEYRA OS">
      <div className="os-intro-inner">
        <p className="line line-kicker">MEYRA</p>
        <p className="line line-title">MEYRA OS</p>
        <p className="line line-sub">Personal workbench</p>
        <p className="line diag d1">Initializing workspace...</p>
        <p className="line diag d2">
          <span>Projects</span>
          <span className="dots" aria-hidden="true" />
          <span>OK</span>
        </p>
        <p className="line diag d3">
          <span>Tools</span>
          <span className="dots" aria-hidden="true" />
          <span>{count}</span>
        </p>
        <p className="line diag d5">
          System ready
          <span className="os-cursor" aria-hidden="true" />
        </p>
        <div className="progress" aria-hidden="true">
          <span />
        </div>
        <button type="button" className="os-btn enter" onClick={onEnter}>
          Enter workspace
        </button>
      </div>
    </div>
  );
}
