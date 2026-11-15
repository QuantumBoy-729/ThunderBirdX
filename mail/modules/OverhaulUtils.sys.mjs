/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Shared helpers for the ThunderBirdX overhaul (personal fork).
 */

/**
 * Whether the overhauled UI is enabled.
 *
 * @returns {boolean}
 */
export function isOverhaulEnabled() {
  return Services.prefs.getBoolPref("mail.overhaul.enabled", false);
}

/**
 * Extract the display name from an author string such as
 * `"Jordan Lee" <jordan@example.com>`, falling back to the local part of the
 * address.
 *
 * @param {string} author
 * @returns {string}
 */
function displayNameFromAuthor(author) {
  const text = (author ?? "").trim();
  const name = text
    .replace(/<[^>]*>/, "")
    .replace(/^["']|["']$/g, "")
    .trim();
  if (name && !name.includes("@")) {
    return name;
  }
  const address = text.match(/<([^>]+)>/)?.[1] ?? name;
  return address.split("@")[0];
}

/**
 * Data needed to draw a letter avatar for a message author.
 *
 * @param {string} author - Display name, address, or both.
 * @returns {{initials: string, hue: number}} Up to two uppercase initials and
 *   a stable hue (0-359) derived from the author.
 */
export function getAvatarData(author) {
  const name = displayNameFromAuthor(author);
  const words = name.split(/[\s._-]+/).filter(Boolean);
  const initials =
    words.length > 1
      ? words[0][0] + words.at(-1)[0]
      : (words[0] ?? "?").slice(0, 1);

  let hash = 0;
  for (const char of name.toLowerCase()) {
    hash = (hash * 31 + char.codePointAt(0)) | 0;
  }

  return {
    initials: initials.toLocaleUpperCase(),
    hue: Math.abs(hash) % 360,
  };
}

/**
 * Hands quick reply text from the message pane to the compose window that the
 * reply opens. Keyed by the URI of the message being replied to.
 */
export const QuickReplyStore = {
  /** @type {Map<string, string>} */
  _pending: new Map(),

  /**
   * Remember text to insert when the reply to `messageURI` opens.
   *
   * @param {string} messageURI
   * @param {string} text
   */
  set(messageURI, text) {
    this._pending.set(messageURI, text);
  },

  /**
   * Return and forget the pending text for `messageURI`, if any.
   *
   * @param {string} messageURI
   * @returns {?string}
   */
  take(messageURI) {
    const text = this._pending.get(messageURI) ?? null;
    this._pending.delete(messageURI);
    return text;
  },
};
