/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global Preferences */

// Overhaul (personal fork): ThunderBirdX section of Settings → Appearance.

const lazy = {};
ChromeUtils.defineESModuleGetters(lazy, {
  MailNotificationManager:
    "resource:///modules/MailNotificationManager.sys.mjs",
});

Preferences.addAll([
  { id: "mail.overhaul.enabled", type: "bool" },
  { id: "mail.overhaul.theme", type: "string" },
  { id: "mail.overhaul.corners", type: "string" },
  { id: "mail.overhaul.rail", type: "string" },
  { id: "mail.overhaul.avatars", type: "bool" },
  { id: "mail.overhaul.unread_bar", type: "bool" },
  { id: "mail.overhaul.background", type: "string" },
  { id: "mail.overhaul.background.image", type: "string" },
  { id: "mail.overhaul.background.dim", type: "string" },
  { id: "mail.overhaul.background.blur", type: "bool" },
  { id: "mail.overhaul.sound", type: "string" },
  { id: "mail.overhaul.preview", type: "bool" },
]);
// Also on the General pane, which usually registers it first.
if (!Preferences.get("mail.addressDisplayFormat")) {
  Preferences.add({ id: "mail.addressDisplayFormat", type: "int" });
}

export const overhaulAppearance = {
  init() {
    for (const id of [
      "mail.overhaul.enabled",
      "mail.overhaul.background",
      "mail.overhaul.background.image",
    ]) {
      Preferences.get(id).on("change", () => this.updateDisabledState());
    }
    this.updateDisabledState();

    document
      .getElementById("overhaulBackgroundChoose")
      .addEventListener("command", () => this.chooseBackgroundImage());
    document
      .getElementById("overhaulSoundPreview")
      .addEventListener("command", () => this.previewSound());
  },

  /**
   * Disable the options that currently have no effect.
   */
  updateDisabledState() {
    const enabled = Preferences.get("mail.overhaul.enabled").value;
    for (const element of document.querySelectorAll(
      "#overhaulOptions :is(menulist, checkbox, button)"
    )) {
      element.disabled = !enabled;
    }

    const background = Preferences.get("mail.overhaul.background").value;
    const hasBackground = enabled && background != "none";
    document.getElementById("overhaulBackgroundDim").disabled = !hasBackground;
    document.getElementById("overhaulBackgroundBlur").disabled = !hasBackground;
  },

  /**
   * Let the user pick an image file and switch the background to it.
   */
  async chooseBackgroundImage() {
    const picker = Cc["@mozilla.org/filepicker;1"].createInstance(
      Ci.nsIFilePicker
    );
    const [title] = await document.l10n.formatValues([
      "overhaul-background-picker-title",
    ]);
    picker.init(window.browsingContext, title, Ci.nsIFilePicker.modeOpen);
    picker.appendFilters(Ci.nsIFilePicker.filterImages);

    const current = Preferences.get("mail.overhaul.background.image").value;
    if (current.startsWith("file://")) {
      try {
        picker.displayDirectory = Services.io
          .newURI(current)
          .QueryInterface(Ci.nsIFileURL).file.parent;
      } catch (e) {
        console.warn(e);
      }
    }

    const result = await new Promise(resolve => picker.open(resolve));
    if (result != Ci.nsIFilePicker.returnOK || !picker.file) {
      return;
    }
    Preferences.get("mail.overhaul.background.image").value =
      Services.io.newFileURI(picker.file).spec;
    Preferences.get("mail.overhaul.background").value = "custom";
  },

  /**
   * Play the selected new mail sound (or the General one if none is chosen).
   */
  previewSound() {
    lazy.MailNotificationManager.playSound(
      Services.prefs.getBranch("mail.biff.play_sound")
    );
  },
};
