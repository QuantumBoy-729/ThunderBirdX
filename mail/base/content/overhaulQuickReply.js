/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Overhaul (personal fork): quick reply bar at the bottom of a message.
//
// Typing here and pressing Reply (or Ctrl+Enter) opens a normal reply window
// with the text already inserted above the quote, so the user can review it
// before sending. Nothing is sent from the message pane itself.

// aboutMessage.js
/* globals gMessage, gMessageURI */

var OverhaulQuickReply = {
  /** @type {HTMLElement} */
  bar: null,
  /** @type {HTMLTextAreaElement} */
  input: null,

  init() {
    this.bar = document.getElementById("overhaulQuickReply");
    this.input = document.getElementById("overhaulQuickReplyInput");
    if (!this.bar) {
      return;
    }

    this.input.addEventListener("keydown", event => {
      if (event.key == "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        this.reply();
      }
    });
    document
      .getElementById("overhaulQuickReplySend")
      .addEventListener("click", () => this.reply());

    window.addEventListener("MsgLoaded", () => this.update());
    this.update();
  },

  /**
   * Show the bar for replyable messages and clear any leftover text.
   */
  update() {
    this.input.value = "";
    const folder = gMessage?.folder;
    const noReplyFolders =
      Ci.nsMsgFolderFlags.Drafts |
      Ci.nsMsgFolderFlags.Templates |
      Ci.nsMsgFolderFlags.Queue;
    this.bar.hidden =
      !gMessage ||
      !folder ||
      folder.isSpecialFolder(noReplyFolders, true) ||
      gMessageURI?.startsWith("news-message://");
  },

  /**
   * Open a reply to the displayed message with the typed text inserted.
   */
  reply() {
    const text = this.input.value.trim();
    if (!text || !gMessage || !gMessageURI) {
      return;
    }
    const { QuickReplyStore } = ChromeUtils.importESModule(
      "moz-src:///comm/mail/modules/OverhaulUtils.sys.mjs"
    );
    QuickReplyStore.set(gMessageURI, text);
    top.ComposeMessage(
      Ci.nsIMsgCompType.ReplyToSender,
      Ci.nsIMsgCompFormat.Default,
      gMessage.folder,
      [gMessageURI]
    );
    this.input.value = "";
  },
};

window.addEventListener("load", () => OverhaulQuickReply.init(), {
  once: true,
});
