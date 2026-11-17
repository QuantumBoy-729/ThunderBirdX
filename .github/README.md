<p align="center">
  <img src="../mail/branding/thunderbirdx/default256.png" width="128" height="128" alt="ThunderBirdX logo">
</p>

<h1 align="center">ThunderBirdX</h1>

<p align="center">
  A modern, free email app for Windows, macOS and Linux, built on Thunderbird.
</p>

<p align="center">
  <a href="https://github.com/QuantumBoy-729/ThunderBirdX/releases/latest"><b>Download</b></a> ·
  <a href="#features">Features</a> ·
  <a href="#install">Install</a> ·
  <a href="#coming-from-thunderbird">Coming from Thunderbird</a> ·
  <a href="#building-from-source">Build from source</a>
</p>

---

ThunderBirdX is a desktop email client with a clean, modern interface: one
inbox for all your accounts, message cards with previews and sender avatars,
quick actions on hover, and a look you can make your own with themes,
backgrounds and sounds.

Under the hood it is built on [Mozilla Thunderbird](https://www.thunderbird.net),
so it keeps everything that makes Thunderbird dependable: support for almost
any email provider, a calendar, an address book, end-to-end encryption with
OpenPGP and S/MIME, and thousands of add-ons.

- **Free, always.** No paid tiers, no subscriptions, no features held back.
- **Private by default.** No tracking of you or of the people you email, no
  read-tracking pixels, and no AI or cloud features unless you turn them on.
  The only connection ThunderBirdX adds is a once-a-day check of GitHub for a
  new version, which you can turn off.
- **Open source** under the [Mozilla Public License 2.0](https://www.mozilla.org/MPL/2.0/).

> **Status: early release (0.x).** The new interface is ready for everyday use.
> Several planned productivity features are still in development; see
> [Features](#features) for exactly what's available today.

## Features

✅ Available · 🚧 In testing · 📋 Planned

### A modern inbox

| Feature | Status | Notes |
| --- | --- | --- |
| Unified inbox across all accounts | ✅ | On by default |
| Message cards with preview text | ✅ | The first line of each message under its subject |
| Sender avatars | ✅ | In the message list, conversation view and message header |
| Senders shown by name | ✅ | Show names, addresses, or both |
| Hover quick actions | ✅ | Archive, mark read or unread, delete |
| Clean message header | ✅ | Large sender avatar and subject, icon-only actions |
| Conversation view | 🚧 | Read a whole thread in one place |
| Quick reply | 🚧 | Type a reply under a message, review it before sending |
| Fully inline reply | 📋 | Reply without opening a separate window |
| Speed Reader | 📋 | Word-by-word reading at 250 to 1,000+ words per minute |

### Make it yours

All in **Settings → Appearance → ThunderBirdX**; changes apply instantly.

| Feature | Status | Notes |
| --- | --- | --- |
| Light and dark mode | ✅ | Follows your system, or choose one |
| Theme presets | ✅ | Default (blue), Ocean, Forest, Sunset, Graphite |
| Shape and layout | ✅ | Sharp, soft or round corners; wide or slim app rail |
| Backgrounds | ✅ | Gradient presets or your own image, with a readability veil and blur |
| New mail sounds | ✅ | Chime, Pop, Bell or Soft |
| Classic look | ✅ | Untick **Use the ThunderBirdX look** for the standard Thunderbird design |

### Email, calendar and contacts

| Feature | Status | Notes |
| --- | --- | --- |
| IMAP and POP3 (Gmail, Outlook.com, Yahoo, iCloud, Fastmail, …) | ✅ | |
| Microsoft Exchange | 🚧 | Exchange (EWS) support is arriving from Thunderbird |
| Calendar and tasks | ✅ | Day, week and month views; CalDAV and Google Calendar |
| Address book | ✅ | CardDAV and LDAP |
| OpenPGP and S/MIME encryption | ✅ | |
| Templates, signatures, filters, spam filtering | ✅ | |
| Read receipts | ✅ | Only when the recipient agrees to send one |
| Undo send | 📋 | |
| Snooze | 📋 | |
| Scheduled send | 📋 | |

### Integrations

| Feature | Status | Notes |
| --- | --- | --- |
| Add-ons | ✅ | From [addons.thunderbird.net](https://addons.thunderbird.net); there is no separate store |
| Web apps in the app rail | 📋 | Chat, storage and task tools next to your mail |
| AI writing assistant | 📋 | Optional and off by default; bring your own API key and choose your provider |

## Install

Download the file for your system from the
[latest release](https://github.com/QuantumBoy-729/ThunderBirdX/releases/latest).

| System | File | How to install |
| --- | --- | --- |
| Windows 10 and 11 (64-bit) | `…-windows-x64-setup.exe` | Run the installer |
| Windows, portable | `…-windows-x64.zip` | Unzip anywhere and run `thunderbird.exe` |
| macOS (Apple silicon) | `…-macos-arm64.dmg` | Open it and drag ThunderBirdX to Applications |
| Linux (64-bit) | `…-linux-x64.tar.xz` | Extract and run `thunderbird` |

ThunderBirdX is not yet code signed, so your system may warn you the first time:

- **Windows:** if SmartScreen says "Windows protected your PC", choose
  **More info → Run anyway**.
- **macOS:** right-click ThunderBirdX in Applications and choose **Open**. If
  macOS says the app is damaged, run this in Terminal, then open it again:
  ```bash
  xattr -cr /Applications/ThunderBirdX.app
  ```

To check a download, compare it with `SHA256SUMS.txt` from the same release.

### Updates

ThunderBirdX checks for a new version once a day and shows a bar at the
bottom of the window when one is out. Choose **Download** to open its release
page, then install it in the same place as your current version (the
installer does this by default; for the zip, unpack it over the old folder),
so it keeps using your mail and settings.

To check by hand, or to turn the daily check off, go to
**Settings → Appearance → ThunderBirdX → Updates**. ThunderBirdX doesn't
download or install anything by itself.

## Coming from Thunderbird

ThunderBirdX can sit next to Thunderbird. It stores its data in the same place
as Thunderbird but starts with its own, empty profile, so your existing setup
is not touched.

- **Start fresh:** add your accounts in ThunderBirdX as you would in any email app.
- **Bring your Thunderbird data:** in ThunderBirdX, open the app menu (☰) and
  choose **Tools → Import**, then pick Thunderbird. Your Thunderbird profile is
  copied, not moved.
- **Use the same profile in both:** start ThunderBirdX with `-P` to open the
  profile manager and pick your Thunderbird profile. Don't run both apps on the
  same profile at the same time, and back the profile up first.

## Roadmap

1. **Design foundations** ✅: colors, shapes and spacing in light and dark.
2. **App shell** ✅: app rail, toolbar and tabs.
3. **Message list** ✅: unified inbox, message cards, previews, quick actions.
4. **Reading** 🚧: simpler header and avatars are done; conversation view and
   quick reply are in testing; fully inline reply is next.
5. **Sending** 📋: undo send, scheduled send.
6. **Triage** 📋: snooze, Speed Reader.
7. **Compose and other screens** 📋: matching design for writing mail, the
   address book, calendar and settings.
8. **Integrations and AI** 📋: web apps in the app rail, optional AI writing
   assistant.
9. **Polish** 🚧: themes, backgrounds and sounds are done; animations,
   an accessibility review and code signing are next.

See [CHANGELOG.md](CHANGELOG.md) for what changed in each release.

## Feedback and help

- **Found a bug or have an idea?** Open an
  [issue](https://github.com/QuantumBoy-729/ThunderBirdX/issues). Please include
  your ThunderBirdX version (**Help → About ThunderBirdX**) and your system.
- **Security problem?** Please report it privately; see [SECURITY.md](SECURITY.md).
- **Want to help?** See [CONTRIBUTING.md](CONTRIBUTING.md).

ThunderBirdX is an independent project. Please don't report ThunderBirdX
problems to Mozilla or the Thunderbird team.

## Building from source

ThunderBirdX builds the same way as Thunderbird: this repository is checked
out as `comm/` inside a Firefox source checkout.

```bash
git clone https://github.com/mozilla-firefox/firefox.git
```

```bash
cd firefox
git checkout $(curl -fsSL https://raw.githubusercontent.com/QuantumBoy-729/ThunderBirdX/overhaul/.github/release/gecko-rev)
git clone https://github.com/QuantumBoy-729/ThunderBirdX.git comm
```

Create a file named `mozconfig` in the `firefox` folder. This "artifact build"
downloads prebuilt binaries and only builds the app's interface, which takes a
few minutes:

```
ac_add_options --enable-project=comm/mail
ac_add_options --enable-artifact-builds
ac_add_options --with-branding=comm/mail/branding/thunderbirdx
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

After the first build, `./mach build faster` is enough for interface changes.
The [Thunderbird build guide](https://developer.thunderbird.net/thunderbird-development/building-thunderbird)
has more detail, including full (non-artifact) builds.

### How the code is organized

- `mail/themes/shared/mail/overhaul/`: the ThunderBirdX design, as stylesheets
  that sit on top of Thunderbird's. Changes to Thunderbird's own files are kept
  small so upstream updates merge cleanly.
- `mail/branding/thunderbirdx/`: name, logo and icons. The logo artwork and the
  scripts that generate the icons are in `source/`.
- `mail/modules/OverhaulUtils.sys.mjs`: shared code for avatars and quick reply.
- `mail/components/preferences/overhaulAppearance.mjs`: the ThunderBirdX
  settings section.

### Releases

Releases are built by GitHub Actions ([release.yml](workflows/release.yml)):

1. Push a tag such as `v0.2.0`, or run the **Release** workflow from the
   Actions tab and enter a version.
2. The workflow builds Windows, Linux and macOS packages with the settings in
   [release/mozconfig](release/mozconfig) and attaches them, with checksums
   and the notes from [release/notes.md](release/notes.md), to a **draft**
   release.
3. Review the draft, then publish it.

Artifact builds reuse Mozilla's prebuilt binaries, so the Firefox source must
match the Thunderbird code it is paired with: [release/gecko-rev](release/gecko-rev)
pins that Firefox revision. Every Monday, the **Upstream sync** workflow
([upstream-sync.yml](workflows/upstream-sync.yml)) opens a pull request that
merges the latest Thunderbird changes and updates the pin.

## License and trademarks

ThunderBirdX is free software under the
[Mozilla Public License 2.0](https://www.mozilla.org/MPL/2.0/), like the
Thunderbird code it is built on. Thanks to everyone who builds Thunderbird.

ThunderBirdX is an independent project. It is not affiliated with or endorsed
by MZLA Technologies or the Mozilla Foundation. Thunderbird and Mozilla are
trademarks of the Mozilla Foundation. For the official Thunderbird app, visit
[thunderbird.net](https://www.thunderbird.net).

Thunderbird's own README is in the root of this repository.
