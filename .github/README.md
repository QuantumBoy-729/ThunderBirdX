# ThunderBirdX

ThunderBirdX is a personal fork of [Mozilla Thunderbird](https://github.com/thunderbird/thunderbird-desktop)
focused on a cleaner, more modern interface and everyday productivity features:
one inbox for all your accounts, fast triage, and tools that help you get through
a busy mailbox.

It stays close to upstream Thunderbird, so it keeps Thunderbird's privacy
defaults, open standards support and add-on ecosystem, and regularly pulls in
upstream fixes.

> **Status:** early development. The new interface is usable day to day; most
> of the new productivity features are still planned. The table below shows
> exactly what exists today.

## Feature status

✅ Available · 🚧 In progress · 📋 Planned

### Email and accounts

| Feature | Status | Notes |
| --- | --- | --- |
| Unified inbox across all accounts | ✅ | On by default for new profiles |
| IMAP and POP3 (Gmail, Outlook, Yahoo, iCloud, …) | ✅ | From Thunderbird |
| Microsoft Exchange | 🚧 | EWS and Graph support are arriving upstream |
| Templates | ✅ | From Thunderbird |
| Multiple signatures | ✅ | One per identity, from Thunderbird |
| Filters and adaptive spam filtering | ✅ | From Thunderbird |
| Read receipts | ✅ | Recipient-approved receipts, from Thunderbird |
| Undo send | 📋 | Short delay before sending with an Undo bar |
| Snooze | 📋 | Hide a message and bring it back at a chosen time |
| Scheduled send | 📋 | Send a message automatically at a chosen time |

### Reading and triage

| Feature | Status | Notes |
| --- | --- | --- |
| Hover quick actions on messages | ✅ | Archive, mark read or unread, delete |
| Keyboard shortcuts | ✅ | Customizable, from Thunderbird |
| Attachment search | ✅ | Via global search, from Thunderbird |
| Sender avatars | ✅ | Letter avatars in the message list, conversation view and message header |
| Simplified message header | ✅ | Large sender avatar and subject, icon-only actions (customizable as before) |
| Conversation view | 🚧 | Built on Thunderbird's experimental conversation view; on by default in development builds, still being tested |
| Quick reply | 🚧 | Type under a message to open a pre-filled reply you review before sending; still being tested |
| Fully inline reply (no separate window) | 📋 | |
| Speed Reader | 📋 | Word-by-word reading view, roughly 250 to 1,000+ words per minute |

### Interface and customization

| Feature | Status | Notes |
| --- | --- | --- |
| Refreshed design: softer surfaces, rounder controls, one accent color | ✅ | Light and dark mode |
| App rail on the left | ✅ | Mail, address book, calendar, tasks, chat |
| Flat message cards with an unread marker | ✅ | |
| Calendar with day, week and month views | ✅ | From Thunderbird |
| Light and dark themes | ✅ | Plus Thunderbird's theme add-ons |
| Custom backgrounds | 📋 | |
| Notification sound choices | 📋 | |

### Integrations and AI

| Feature | Status | Notes |
| --- | --- | --- |
| Web apps in the app rail (chat, storage, task tools, …) | 📋 | Built on Thunderbird's spaces; add-ons can already add spaces today |
| AI writing assistant | 📋 | Optional and off by default. Bring your own API key, choose your provider |

Extensions come from Thunderbird's existing [add-ons site](https://addons.thunderbird.net);
ThunderBirdX does not run its own app store.

### Platforms

ThunderBirdX builds for Windows, macOS and Linux, like Thunderbird.

ThunderBirdX is and will always be free: no paid tiers, no subscriptions and no
features held back. It is open source under the
[Mozilla Public License 2.0](https://www.mozilla.org/MPL/2.0/).

## Roadmap

1. **Design tokens** ✅. New color, shape and spacing foundations, in light and dark.
2. **App shell** ✅. App rail, toolbar and tabs.
3. **Folder pane and message list** ✅. Unified folders by default, flat cards,
   hover quick actions.
4. **Reading pane** 🚧. Simpler message header and sender avatars are done;
   conversation view and quick reply are in testing; fully inline reply is next.
5. **Sending** 📋. Undo send, scheduled send.
6. **Triage** 📋. Snooze, Speed Reader.
7. **Compose and secondary screens** 📋. Matching design for the compose window,
   address book, calendar and settings.
8. **Integrations and AI** 📋. Web apps in the app rail, optional AI writing
   assistant.
9. **Polish** 📋. Motion, accessibility review, custom backgrounds and sounds.

## Design principles

- **Stay close to upstream.** New styles live in separate files under
  `mail/themes/shared/mail/overhaul/`, and changes to upstream files are kept
  small, so upstream updates merge cleanly.
- **Everything can be switched off.** The new interface is controlled by the
  `mail.overhaul.enabled` preference (Settings → General → Config Editor). Set it
  to `false` to get the standard Thunderbird look back.
- **Accessibility first.** High contrast mode is never restyled, and new
  controls get keyboard and screen reader support.
- **Privacy by default.** No tracking of you or of the people you email (no
  read-tracking pixels), and no AI or cloud features unless you turn them on.

## Building

ThunderBirdX builds like Thunderbird: this repository is checked out as `comm/`
inside a Firefox source checkout.

```bash
git clone https://github.com/mozilla-firefox/firefox.git
cd firefox
git clone https://github.com/QuantumBoy-729/ThunderBirdX.git comm
```

Create a `mozconfig` file in the `firefox` folder. An artifact build downloads
prebuilt binaries and only builds the front end, which takes a few minutes:

```
ac_add_options --enable-project=comm/mail
ac_add_options --enable-artifact-builds
mk_add_options MOZ_OBJDIR=@TOPSRCDIR@/obj-tb-artifact
```

Then bootstrap, build and run. On Windows, run these from the
[MozillaBuild](https://wiki.mozilla.org/MozillaBuild) shell:

```bash
./mach bootstrap
```

```bash
./mach build
```

```bash
./mach run
```

After the first build, `./mach build faster` is enough for front-end changes.
See the [Building Thunderbird guide](https://developer.thunderbird.net/thunderbird-development/building-thunderbird)
for more detail.

## Relationship to Thunderbird

ThunderBirdX is an independent fork and is not affiliated with or endorsed by
MZLA Technologies or the Mozilla Foundation. "Thunderbird" is a trademark of the
Mozilla Foundation. For the official app, visit [thunderbird.net](https://www.thunderbird.net).

Thunderbird's own README is in the root of this repository.
