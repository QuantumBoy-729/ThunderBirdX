/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* globals openLinkExternally, specialTabs */

// ThunderBirdX (personal fork): checks GitHub for a newer ThunderBirdX release
// once a day and offers it in a notification bar at the bottom of the main
// window. See ThunderBirdXUpdates.sys.mjs.

var ThunderBirdXUpdateNotifier = {
  /** Wait after startup so the check doesn't compete with loading mail. */
  STARTUP_DELAY_MS: 60 * 1000,
  /** How often to see whether the daily check is due while running. */
  POLL_INTERVAL_MS: 60 * 60 * 1000,

  init() {
    this.updates = ChromeUtils.importESModule(
      "moz-src:///comm/mail/modules/ThunderBirdXUpdates.sys.mjs"
    ).ThunderBirdXUpdates;
    if (this.updates.isDevBuild) {
      return;
    }
    const startupTimer = setTimeout(
      () => this.maybeCheck(),
      this.STARTUP_DELAY_MS
    );
    const pollTimer = setInterval(
      () => this.maybeCheck(),
      this.POLL_INTERVAL_MS
    );
    window.addEventListener(
      "unload",
      () => {
        clearTimeout(startupTimer);
        clearInterval(pollTimer);
      },
      { once: true }
    );
  },

  async maybeCheck() {
    // With several main windows open, only one of them checks.
    if (
      Services.wm.getMostRecentWindow("mail:3pane") != window ||
      !this.updates.shouldAutoCheck()
    ) {
      return;
    }
    const result = await this.updates.check();
    if (
      result.status == "update" &&
      !this.updates.isDismissed(result.latestVersion)
    ) {
      await this.notify(result);
    }
  },

  /**
   * @param {object} result - An UpdateCheckResult with status "update".
   * @param {string} result.latestVersion - The newer version.
   * @param {string} result.url - Where to download it.
   */
  async notify({ latestVersion, url }) {
    const box = specialTabs.msgNotificationBar;
    if (box.getNotificationWithValue("thunderbirdx-update")) {
      return;
    }
    const [message, download, later] = await document.l10n.formatMessages([
      { id: "overhaul-update-notification", args: { version: latestVersion } },
      "overhaul-update-notification-download",
      "overhaul-update-notification-later",
    ]);
    const attr = (msg, name) =>
      msg.attributes.find(a => a.name == name)?.value ?? "";

    await box.appendNotification(
      "thunderbirdx-update",
      {
        label: message.value,
        priority: box.PRIORITY_INFO_MEDIUM,
      },
      [
        {
          label: attr(download, "label"),
          accessKey: attr(download, "accesskey"),
          callback: () => {
            openLinkExternally(url);
          },
        },
        {
          label: attr(later, "label"),
          accessKey: attr(later, "accesskey"),
          callback: () => {
            this.updates.dismiss(latestVersion);
          },
        },
      ]
    );
  },
};

window.addEventListener("load", () => ThunderBirdXUpdateNotifier.init(), {
  once: true,
});
