#!/bin/bash
# Build and package ThunderBirdX for release. Run from the Firefox checkout
# root, with this repository checked out as comm/.
set -euo pipefail

# Bootstrap first: it can rewrite the top-level mozconfig, so the release
# mozconfig is put in place afterwards.
./mach --no-interactive bootstrap --application-choice "Firefox for Desktop Artifact Mode"
cp comm/.github/release/mozconfig mozconfig

./mach build
./mach package
