# Changelog

All notable changes to ThunderBirdX. Versions follow
[semantic versioning](https://semver.org); while ThunderBirdX is 0.x, any
release may change things.

Each release also includes the Thunderbird changes merged up to its build; the
release notes name the Thunderbird version it is based on.

## 0.1.0

The first release of ThunderBirdX, based on Thunderbird 162 (Daily).

### New look

- Refreshed design in light and dark mode: softer surfaces, rounder controls
  and one accent color.
- App rail on the left for mail, address book, calendar, tasks and chat.
- Unified inbox across all accounts, on by default.
- Message cards with sender avatars, preview text and an unread marker.
- Senders shown by name only by default, with an option to show addresses.
- Quick actions on hover: archive, mark read or unread, delete.
- Simpler message header with a large sender avatar.
- ThunderBirdX name, logo and icons.

### Make it yours

Settings → Appearance → ThunderBirdX:

- Theme presets: Default (blue), Ocean, Forest, Sunset, Graphite.
- Sharp, soft or round corners; wide or slim app rail.
- Backgrounds behind the app: gradient presets or your own image, with a
  readability veil and optional blur.
- New mail sounds: Chime, Pop, Bell or Soft.
- Switches for avatars, the unread marker and preview text, and for the
  classic Thunderbird look.

### In testing

- Conversation view.
- Quick reply under a message (opens a pre-filled reply to review before
  sending).

### Updates

- ThunderBirdX checks GitHub once a day for a new version and offers it in a
  bar at the bottom of the window. Turn it off, or check by hand, in
  Settings → Appearance → ThunderBirdX → Updates.

### Privacy

- No Mozilla start page, in-app notifications, update checks or crash reports.

### Fixes

- Opening a `news:` link with malformed percent-encoding no longer throws an
  error.

### Known limitations

- Not code signed: Windows and macOS warn on first launch.
- Updates are offered, not installed: download the new version from its
  release page.
- The program file and its shortcuts on Windows still show the Thunderbird
  Daily icon.
- macOS builds are for Apple silicon only.
