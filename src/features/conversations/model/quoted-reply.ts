/**
 * An e-mail reply usually carries our previous message underneath the new
 * text ("Le … a écrit :", "> …", Outlook's header block). Shown as-is it
 * makes OUR message appear twice in the thread. `splitQuotedReply` separates
 * the new part from the quoted tail so the tail can be folded.
 *
 * Deliberately cautious — hiding real content is worse than showing a quote:
 * no recognised separator → everything is `fresh`; a separator on the very
 * first line (the message is only a quote) → everything is `fresh`;
 * `>` lines are cut only when they form the trailing block (an interleaved,
 * line-by-line answer is left whole).
 */
export interface SplitReply {
  fresh: string;
  quoted: string | null;
}

const FR_ATTRIBUTION_END = /(?:a|ont)\s+écrit\s*:?\s*$/i;
const EN_ATTRIBUTION_END = /wrote\s*:?\s*$/i;
const ORIGINAL_MESSAGE = /^[-_ ]*(?:original message|message d['’]origine|message original|forwarded message)[-_ ]*$/i;
const HEADER_FROM = /^(?:de|from)\s*:/i;
const HEADER_FOLLOWUP = /^(?:envoyé|envoye|sent|date|objet|subject|à|to)\s*:/i;
const QUOTE_LINE = /^\s*>/;

/** "Le … a écrit :" / "On … wrote:", possibly wrapped onto the next line. */
function startsAttribution(lines: readonly string[], index: number): boolean {
  const line = (lines[index] ?? "").trim();
  const next = (lines[index + 1] ?? "").trim();
  if (/^le\s.+/i.test(line) && (FR_ATTRIBUTION_END.test(line) || (FR_ATTRIBUTION_END.test(next) && next.length < 25))) {
    return true;
  }
  if (/^on\s.+/i.test(line) && (EN_ATTRIBUTION_END.test(line) || (EN_ATTRIBUTION_END.test(next) && next.length < 25))) {
    return true;
  }
  return false;
}

/** Outlook's "De : … / Envoyé : … / Objet : …" block. */
function startsHeaderBlock(lines: readonly string[], index: number): boolean {
  if (!HEADER_FROM.test((lines[index] ?? "").trim())) return false;
  return lines.slice(index + 1, index + 5).some((line) => HEADER_FOLLOWUP.test(line.trim()));
}

function startsTrailingQuoteBlock(lines: readonly string[], index: number): boolean {
  if (!QUOTE_LINE.test(lines[index] ?? "")) return false;
  return lines.slice(index).every((line) => line.trim() === "" || QUOTE_LINE.test(line));
}

export function splitQuotedReply(text: string): SplitReply {
  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = (lines[index] ?? "").trim();
    const isSeparator =
      ORIGINAL_MESSAGE.test(line) && line !== "" ||
      startsAttribution(lines, index) ||
      startsHeaderBlock(lines, index) ||
      startsTrailingQuoteBlock(lines, index);
    if (!isSeparator) continue;

    const fresh = lines.slice(0, index).join("\n").trim();
    // Nothing new before the separator: never hide the whole message.
    if (fresh === "") return { fresh: text, quoted: null };
    return { fresh, quoted: lines.slice(index).join("\n").trim() };
  }
  return { fresh: text, quoted: null };
}
