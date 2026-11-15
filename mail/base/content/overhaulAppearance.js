/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Overhaul (personal fork): applies the custom background image chosen in
// Settings → Appearance → ThunderBirdX to the main window.
//
// The window's Content-Security-Policy does not allow file: images, so the
// file is read and inlined as a data: URL in the --overhaul-bg-custom
// property used by overhaul/shell.css.

var OverhaulAppearance = {
  PREF: "mail.overhaul.background.image",
  /** Images larger than this are ignored to keep memory use reasonable. */
  MAX_BYTES: 20 * 1024 * 1024,
  TYPES: {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    avif: "image/avif",
    svg: "image/svg+xml",
  },

  init() {
    Services.prefs.addObserver(this.PREF, this);
    window.addEventListener(
      "unload",
      () => Services.prefs.removeObserver(this.PREF, this),
      { once: true }
    );
    this.update();
  },

  observe() {
    this.update();
  },

  async update() {
    const root = document.documentElement;
    const url = Services.prefs.getStringPref(this.PREF, "");
    const type = this.TYPES[url.split(".").pop().toLowerCase()];
    if (!url.startsWith("file://") || !type) {
      root.style.removeProperty("--overhaul-bg-custom");
      return;
    }

    try {
      const file = Services.io.newURI(url).QueryInterface(Ci.nsIFileURL).file;
      const { size } = await IOUtils.stat(file.path);
      if (size > this.MAX_BYTES) {
        console.warn(`Overhaul background image is too large: ${file.path}`);
        root.style.removeProperty("--overhaul-bg-custom");
        return;
      }
      const bytes = await IOUtils.read(file.path);
      const dataURL = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(new Blob([bytes], { type }));
      });
      // Ignore stale results if the pref changed while reading.
      if (Services.prefs.getStringPref(this.PREF, "") == url) {
        root.style.setProperty(
          "--overhaul-bg-custom",
          `url(${JSON.stringify(dataURL)})`
        );
      }
    } catch (error) {
      console.error("Could not load the overhaul background image", error);
      root.style.removeProperty("--overhaul-bg-custom");
    }
  },
};

window.addEventListener("load", () => OverhaulAppearance.init(), {
  once: true,
});
