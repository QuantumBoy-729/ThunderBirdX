ThunderBirdX @VERSION@, based on Thunderbird @BASE@ (Daily).

See the [feature list](https://github.com/QuantumBoy-729/ThunderBirdX#feature-status) for what's in this build.

## Downloads

| Platform | File |
| --- | --- |
| Windows (installer) | `ThunderBirdX-@VERSION@-windows-x64-setup.exe` |
| Windows (portable zip) | `ThunderBirdX-@VERSION@-windows-x64.zip` |
| macOS (Apple silicon) | `ThunderBirdX-@VERSION@-macos-arm64.dmg` |
| Linux (x64) | `ThunderBirdX-@VERSION@-linux-x64.tar.xz` |

`SHA256SUMS.txt` lists the checksum of every file.

## Before you install

- **Builds are not code signed.** Windows SmartScreen may warn you: choose
  *More info → Run anyway*. On macOS, drag ThunderBirdX to Applications, then
  right-click it and choose *Open* the first time. If macOS says the app is
  damaged, run `xattr -cr /Applications/ThunderBirdX.app` in Terminal.
- **No automatic updates.** Download new versions from this Releases page.
- **Profiles:** ThunderBirdX uses the same profile folder as Thunderbird but
  creates its own default profile per installation. Back up your Thunderbird
  profile before pointing ThunderBirdX at it.
- This is a development build based on Thunderbird Daily, so expect rough
  edges. The program file and its shortcuts still show the Thunderbird Daily
  icon; the windows themselves use the ThunderBirdX logo.

ThunderBirdX is a personal fork and is not affiliated with or endorsed by
MZLA Technologies or the Mozilla Foundation.

<sub>Built from @COMMIT@ with Gecko @GECKO@.</sub>
