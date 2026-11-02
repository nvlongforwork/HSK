import { useState, useEffect } from "react";

export default function useMarkdown(url) {
  const [request, setRequest] = useState({ url: null, content: null, loading: false, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Unable to load content (${res.status})`);
        return res.text();
      })
      .then((text) => {
        if (!controller.signal.aborted) setRequest({ url, content: text, loading: false, error: null });
      })
      .catch((err) => {
        if (!controller.signal.aborted) setRequest({ url, content: null, loading: false, error: err.message });
      });
    return () => controller.abort();
  }, [url, attempt]);

  const retry = () => {
    setRequest({ url, content: null, loading: true, error: null });
    setAttempt((value) => value + 1);
  };
  // Do not expose a previous lesson while a new route starts fetching.
  if (request.url !== url) return { content: null, loading: Boolean(url), error: null, retry };
  return { ...request, retry };
}
