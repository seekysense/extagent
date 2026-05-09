import { getSelector } from './selectorUtils';

let isCapturing = false;

function handleClick(e: MouseEvent): void {
  if (!isCapturing) return;
  const el = e.target as Element;
  if (!el) return;
  const selector = getSelector(el);
  const label = el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 50) || selector;
  chrome.runtime.sendMessage({
    action: 'recordingStep',
    step: {
      type: 'click',
      selector,
      description: `click su "${label}"`,
    },
  });
}

function handleBlur(e: FocusEvent): void {
  if (!isCapturing) return;
  const el = e.target as HTMLInputElement | HTMLTextAreaElement;
  if (!el || !('value' in el)) return;
  const value = (el as HTMLInputElement).value;
  if (!value) return;
  const selector = getSelector(el);
  chrome.runtime.sendMessage({
    action: 'recordingStep',
    step: {
      type: 'type',
      selector,
      text: value,
      description: `testo "${value.slice(0, 40)}" in ${selector}`,
    },
  });
}

function handleChange(e: Event): void {
  if (!isCapturing) return;
  const el = e.target as HTMLSelectElement;
  if (!el || el.tagName !== 'SELECT') return;
  const selector = getSelector(el);
  chrome.runtime.sendMessage({
    action: 'recordingStep',
    step: {
      type: 'select',
      selector,
      text: el.value,
      description: `selezionato "${el.value}" in ${selector}`,
    },
  });
}

function startCapture(): void {
  if (isCapturing) return;
  isCapturing = true;
  document.addEventListener('click', handleClick, true);
  document.addEventListener('blur', handleBlur, true);
  document.addEventListener('change', handleChange, true);
}

function stopCapture(): void {
  isCapturing = false;
  document.removeEventListener('click', handleClick, true);
  document.removeEventListener('blur', handleBlur, true);
  document.removeEventListener('change', handleChange, true);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'startRecordingCapture') startCapture();
  if (message.action === 'stopRecordingCapture') stopCapture();
});
