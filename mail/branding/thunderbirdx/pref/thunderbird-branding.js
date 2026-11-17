/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// ThunderBirdX (personal fork) branding prefs, based on the Daily branding.

// This build's ThunderBirdX version, used by the update check. Release builds
// replace it (see .github/release/build.sh); 0.0.0 means a development build.
pref("mail.thunderbirdx.version", "0.0.0");

// No start page: the Thunderbird start page is for Mozilla's own builds.
pref("mailnews.start_page.enabled", false);
pref("mailnews.start_page.url", "about:blank");
pref("mailnews.start_page.override_url", "");

// ThunderBirdX releases are published on GitHub; there is no update server.
pref(
  "app.update.url.manual",
  "https://github.com/QuantumBoy-729/ThunderBirdX/releases"
);
pref(
  "app.update.url.details",
  "https://github.com/QuantumBoy-729/ThunderBirdX/releases"
);

pref("app.vendorURL", "https://github.com/QuantumBoy-729/ThunderBirdX");

// Mozilla's in-app notifications (donation appeals, Thunderbird news) are
// written for Thunderbird itself, so they are not fetched.
pref("mail.inappnotifications.enabled", false);
pref("mail.inappnotifications.url", "");
