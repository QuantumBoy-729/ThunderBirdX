/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * ThunderBirdX update check (personal fork).
 *
 * ThunderBirdX builds don't use Mozilla's update service. Instead this asks
 * GitHub for the latest published ThunderBirdX release and compares it with
 * the version stamped into the build (mail.thunderbirdx.version, set by the
 * release workflow). Nothing is downloaded or installed: the user is pointed
 * at the release page.
 *
 * Prefs:
 *   mail.thunderbirdx.version             this build's version ("0.0.0" for
 *                                         development builds)
 *   mail.thunderbirdx.update.autoCheck    check once a day in the background
 *   mail.thunderbirdx.update.lastCheck    time of the last check (seconds)
 *   mail.thunderbirdx.update.dismissed    version the user chose to skip
 *   mail.thunderbirdx.update.url          (hidden) overrides the GitHub API
 *                                         address, for tests
 */

const REPOSITORY = "QuantumBoy-729/ThunderBirdX";
const LATEST_RELEASE_API = `https://api.github.com/repos/${REPOSITORY}/releases/latest`;
const RELEASES_PAGE = `https://github.com/${REPOSITORY}/releases`;
const DEV_VERSION = "0.0.0";
const CHECK_INTERVAL_SECONDS = 24 * 60 * 60;

/**
 * @typedef {object} UpdateCheckResult
 * @property {"update"|"current"|"dev"|"error"} status
 * @property {string} currentVersion - This build's version.
 * @property {string} [latestVersion] - The newest published version.
 * @property {string} [url] - Page to download the newest version from.
 */

/**
 * Split a version such as "0.10.2" or "v1.2.0-beta.1" into numbers for
 * comparison. Anything after "-" or "+" is ignored.
 *
 * @param {string} version
 * @returns {number[]}
 */
function parseVersion(version) {
  return version
    .trim()
    .replace(/^v/i, "")
    .split(/[-+]/)[0]
    .split(".")
    .map(part => parseInt(part, 10) || 0);
}

export const ThunderBirdXUpdates = {
  RELEASES_PAGE,

  /** @returns {string} */
  get currentVersion() {
    return Services.prefs.getStringPref(
      "mail.thunderbirdx.version",
      DEV_VERSION
    );
  },

  /** @returns {boolean} */
  get isDevBuild() {
    return this.currentVersion == DEV_VERSION;
  },

  /**
   * Compare two versions.
   *
   * @param {string} a
   * @param {string} b
   * @returns {number} Negative if a is older than b, 0 if equal, positive if
   *   a is newer.
   */
  compareVersions(a, b) {
    const pa = parseVersion(a);
    const pb = parseVersion(b);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
      if (diff) {
        return diff;
      }
    }
    return 0;
  },

  /**
   * Whether a background check is due.
   *
   * @returns {boolean}
   */
  shouldAutoCheck() {
    if (
      this.isDevBuild ||
      !Services.prefs.getBoolPref("mail.thunderbirdx.update.autoCheck", true)
    ) {
      return false;
    }
    const lastCheck = Services.prefs.getIntPref(
      "mail.thunderbirdx.update.lastCheck",
      0
    );
    return Date.now() / 1000 - lastCheck >= CHECK_INTERVAL_SECONDS;
  },

  /**
   * Whether the user asked not to be reminded about this version.
   *
   * @param {string} version
   * @returns {boolean}
   */
  isDismissed(version) {
    return (
      Services.prefs.getStringPref("mail.thunderbirdx.update.dismissed", "") ==
      version
    );
  },

  /**
   * Don't remind the user about this version again.
   *
   * @param {string} version
   */
  dismiss(version) {
    Services.prefs.setStringPref("mail.thunderbirdx.update.dismissed", version);
  },

  /**
   * Ask GitHub for the latest published release.
   *
   * @returns {Promise<UpdateCheckResult>}
   */
  async check() {
    const currentVersion = this.currentVersion;
    if (this.isDevBuild) {
      return { status: "dev", currentVersion };
    }

    let release;
    try {
      const response = await fetch(
        Services.prefs.getStringPref(
          "mail.thunderbirdx.update.url",
          LATEST_RELEASE_API
        ),
        {
          headers: { Accept: "application/vnd.github+json" },
          credentials: "omit",
          cache: "no-store",
        }
      );
      // GitHub answers 404 until the first release is published.
      if (response.status == 404) {
        Services.prefs.setIntPref(
          "mail.thunderbirdx.update.lastCheck",
          Math.floor(Date.now() / 1000)
        );
        return { status: "current", currentVersion };
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      release = await response.json();
    } catch (e) {
      console.warn(`ThunderBirdX update check failed: ${e}`);
      return { status: "error", currentVersion };
    }

    Services.prefs.setIntPref(
      "mail.thunderbirdx.update.lastCheck",
      Math.floor(Date.now() / 1000)
    );

    const latestVersion = String(release?.tag_name ?? "").replace(/^v/i, "");
    if (!/^\d+(\.\d+)*/.test(latestVersion)) {
      return { status: "error", currentVersion };
    }
    // Only ever send the user to this repository's release pages.
    const url = String(release.html_url ?? "").startsWith(`${RELEASES_PAGE}/`)
      ? release.html_url
      : RELEASES_PAGE;

    if (this.compareVersions(latestVersion, currentVersion) > 0) {
      return { status: "update", currentVersion, latestVersion, url };
    }
    return { status: "current", currentVersion, latestVersion, url };
  },
};
