/**
 * Build a robust CSS selector for a DOM element.
 * Priority: name attribute → aria-label → id → CSS path.
 */
export function getSelector(el: Element): string {
  const name = el.getAttribute('name');
  if (name) return `[name="${name}"]`;

  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel) return `[aria-label="${ariaLabel}"]`;

  if (el.id) return `#${el.id}`;

  // CSS path fallback: walk up the tree
  const parts: string[] = [];
  let current: Element | null = el;
  while (current) {
    if (current.id) {
      parts.unshift(`#${current.id}`);
      break;
    }
    let part = current.tagName.toLowerCase();
    const parent: Element | null = current.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (s: Element) => s.tagName === current!.tagName
      );
      if (siblings.length > 1) {
        const idx = siblings.indexOf(current) + 1;
        part += `:nth-of-type(${idx})`;
      }
    }
    parts.unshift(part);
    current = parent;
    if (!current || current.tagName === 'HTML' || current.tagName === 'BODY') break;
  }
  return parts.join(' > ');
}
