import { describe, expect, it } from "vitest";
import { splitQuotedReply } from "./quoted-reply";

const ours = "Bonjour Ada,\nUne idée pour votre prospection.\nCordialement";

describe("splitQuotedReply — only the new part of a reply is shown", () => {
  it("Gmail FR, attribution on one line", () => {
    const text = `Oui, intéressée !\n\nLe jeu. 24 sept. 2026 à 09:00, Bewise <hello@bewise.fr> a écrit :\n> ${ours.split("\n").join("\n> ")}`;
    const result = splitQuotedReply(text);
    expect(result.fresh).toBe("Oui, intéressée !");
    expect(result.quoted).toContain("Une idée pour votre prospection.");
    expect(result.quoted).toContain("a écrit");
  });

  it("Gmail FR, attribution wrapped over two lines", () => {
    const text = `Merci.\n\nLe jeu. 24 sept. 2026 à 09:00, Bewise <hello@bewise.fr>\na écrit :\n\n> ${ours}`;
    const result = splitQuotedReply(text);
    expect(result.fresh).toBe("Merci.");
    expect(result.quoted).toContain("Une idée pour votre prospection.");
  });

  it("Gmail EN, one line and wrapped", () => {
    const one = splitQuotedReply(`Sounds good.\n\nOn Thu, Sep 24, 2026 at 9:00 AM Bewise <hello@bewise.fr> wrote:\n> ${ours}`);
    expect(one.fresh).toBe("Sounds good.");
    expect(one.quoted).toContain("Une idée");

    const wrapped = splitQuotedReply(`Sounds good.\n\nOn Thu, Sep 24, 2026 at 9:00 AM Bewise <hello@bewise.fr>\nwrote:\n> ${ours}`);
    expect(wrapped.fresh).toBe("Sounds good.");
  });

  it("Outlook, English header block", () => {
    const text = `Yes please.\n\nFrom: Bewise <hello@bewise.fr>\nSent: Thursday, September 24, 2026 9:00 AM\nTo: Ada\nSubject: Idée\n\n${ours}`;
    const result = splitQuotedReply(text);
    expect(result.fresh).toBe("Yes please.");
    expect(result.quoted).toContain("From: Bewise");
    expect(result.quoted).toContain("Une idée");
  });

  it("Outlook, French header block", () => {
    const text = `Oui volontiers.\n\nDe : Bewise <hello@bewise.fr>\nEnvoyé : jeudi 24 septembre 2026 09:00\nÀ : Ada\nObjet : Idée\n\n${ours}`;
    const result = splitQuotedReply(text);
    expect(result.fresh).toBe("Oui volontiers.");
    expect(result.quoted).toContain("Objet : Idée");
  });

  it("'Original Message' / 'Message d’origine' separators", () => {
    expect(splitQuotedReply(`OK\n\n-----Original Message-----\nFrom: x\n${ours}`).fresh).toBe("OK");
    expect(splitQuotedReply(`OK\n\n----- Message d’origine -----\nDe : x\n${ours}`).fresh).toBe("OK");
    expect(splitQuotedReply(`OK\n\n-------- Message d'origine --------\n${ours}`).fresh).toBe("OK");
  });

  it("a trailing block of '>' lines, without any attribution line", () => {
    const result = splitQuotedReply(`D'accord.\n\n> Bonjour Ada,\n> Une idée\n>\n> Cordialement`);
    expect(result.fresh).toBe("D'accord.");
    expect(result.quoted).toContain("> Une idée");
  });

  it("Windows line endings", () => {
    const result = splitQuotedReply("Oui.\r\n\r\nLe jeu. 24 sept. 2026 à 09:00, Bewise a écrit :\r\n> Bonjour\r\n> Idée");
    expect(result.fresh).toBe("Oui.");
    expect(result.quoted).not.toBeNull();
  });
});

describe("splitQuotedReply — cautious: nothing is ever lost", () => {
  const whole = (text: string) => {
    const result = splitQuotedReply(text);
    expect(result).toEqual({ fresh: text, quoted: null });
  };

  it("no recognised separator → the whole text, unsplit", () => whole("Bonjour,\nMerci pour votre message, rappelez-moi demain."));

  it("a message that IS only the quote (separator on the first line) is shown whole", () => {
    whole("Le jeu. 24 sept. 2026 à 09:00, Bewise a écrit :\n> Bonjour");
  });

  it("interleaved replies (text after a '>' line) are not cut", () => {
    whole("> Avez-vous un budget ?\nOui, 10k.\n> Quand ?\nDès octobre.");
  });

  it("a sentence that merely starts with 'Le' or mentions 'a écrit' is not a separator", () => {
    whole("Le directeur a écrit qu'il était d'accord.\nMerci.");
    whole("On Monday we wrote to them.\nNo answer yet.");
  });

  it("empty text", () => whole(""));

  it("concatenating fresh and quoted gives back every line of the original", () => {
    const text = `Oui.\n\nLe jeu. 24 sept. 2026 à 09:00, Bewise <hello@bewise.fr> a écrit :\n> ${ours}`;
    const { fresh, quoted } = splitQuotedReply(text);
    expect(`${fresh}\n\n${quoted}`.replace(/\s+/g, " ")).toBe(text.replace(/\s+/g, " "));
  });
});
