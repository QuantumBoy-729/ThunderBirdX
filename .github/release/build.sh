#!/bin/bash
# Build and package ThunderBirdX for release. Run from the Firefox checkout
# root, with this repository checked out as comm/. VERSION (for example 0.2.0
# or v0.2.0) is stamped into the build for the update check.
set -euo pipefail

if [ -n "${VERSION:-}" ]; then
  version="${VERSION#v}"
  if ! [[ "$version" =~ ^[0-9]+(\.[0-9]+){1,3}$ ]]; then
    echo "VERSION must look like 1.2.3, got: $VERSION" >&2
    exit 1
  fi
  prefs=comm/mail/branding/thunderbirdx/pref/thunderbird-branding.js
  perl -pi -e "s/pref\(\"mail\.thunderbirdx\.version\", \"[^\"]*\"\)/pref(\"mail.thunderbirdx.version\", \"$version\")/" "$prefs"
  grep -q "pref(\"mail.thunderbirdx.version\", \"$version\")" "$prefs" || {
    echo "Could not stamp version $version into $prefs" >&2
    exit 1
  }
  echo "Building ThunderBirdX $version"
fi

# Bootstrap first: it can rewrite the top-level mozconfig, so the release
# mozconfig is put in place afterwards.
./mach --no-interactive bootstrap --application-choice "Firefox for Desktop Artifact Mode"
cp comm/.github/release/mozconfig mozconfig

./mach build
./mach package
