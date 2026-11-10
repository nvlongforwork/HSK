// Hanzi Writer stores outlines and centre lines in a 1024-unit, Y-up coordinate system.
export function getStrokeParts(data) {
  if (Array.isArray(data)) return { strokes: data, medians: [] };
  return {
    strokes: Array.isArray(data?.strokes) ? data.strokes : [],
    medians: Array.isArray(data?.medians) ? data.medians : [],
  };
}

export function strokeAnnotations(medians, x, y, size) {
  return medians.map((median, index) => {
    if (!Array.isArray(median) || median.length < 2) return null;
    const points = median.filter((point) => Array.isArray(point) && point.length === 2)
      .map(([px, py]) => ({ x: x + px * size / 1024, y: y + (900 - py) * size / 1024 }));
    if (points.length < 2) return null;
    const last = points.at(-1);
    let previous = points.length - 2;
    while (previous > 0 && Math.hypot(last.x - points[previous].x, last.y - points[previous].y) < 0.3) previous--;
    const length = Math.hypot(last.x - points[previous].x, last.y - points[previous].y);
    if (!length) return null;
    const dx = (last.x - points[previous].x) / length;
    const dy = (last.y - points[previous].y) / length;
    const first = points[0];
    return {
      number: index + 1, points,
      labelX: Math.max(x + 0.1, Math.min(x + size - 2.4, first.x - 1)),
      labelY: Math.max(y + 0.1, Math.min(y + size - 2.1, first.y - 2)),
      arrow: [
        last,
        { x: last.x - dx * 1.25 - dy * 0.5, y: last.y - dy * 1.25 + dx * 0.5 },
        { x: last.x - dx * 1.25 + dy * 0.5, y: last.y - dy * 1.25 - dx * 0.5 },
      ],
    };
  }).filter(Boolean);
}
