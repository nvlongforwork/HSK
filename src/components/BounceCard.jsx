import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function BounceCard({ to, children, style, delay = 0 }) {
  const [bouncing, setBouncing] = useState(false);
  const navigate = useNavigate();
  const { boxShadow, ...cardStyle } = style ?? {};
  const timerRef = useRef(null);
  const navigatingRef = useRef(false);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleClick = (event) => {
    // Let the browser handle opening links in a new tab or window.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    if (navigatingRef.current) return;
    navigatingRef.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigate(to);
      return;
    }

    setBouncing(true);
    timerRef.current = window.setTimeout(() => navigate(to), 320);
  };

  return (
    <Link
      to={to}
      className={`bounce-card${bouncing ? " bounce-card--click" : ""}`}
      style={{ "--bounce-delay": `${Math.min(delay, 6) * 0.08}s`, "--card-shadow": boxShadow ?? "var(--shadow-sm)", ...cardStyle }}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
