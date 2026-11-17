/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Tests the ThunderBirdX update check (personal fork) against a local server
 * standing in for the GitHub releases API.
 */

const { HttpServer } = ChromeUtils.importESModule(
  "resource://testing-common/httpd.sys.mjs"
);
const { ThunderBirdXUpdates } = ChromeUtils.importESModule(
  "moz-src:///comm/mail/modules/ThunderBirdXUpdates.sys.mjs"
);

const RELEASES_PAGE = "https://github.com/QuantumBoy-729/ThunderBirdX/releases";

let server;
/** What the fake API returns next: [status code, JSON body or null]. */
let nextResponse;

add_setup(() => {
  server = new HttpServer();
  server.registerPathHandler("/latest", (request, response) => {
    const [status, body] = nextResponse;
    response.setStatusLine(request.httpVersion, status, "Status");
    response.setHeader("Content-Type", "application/json");
    if (body) {
      response.write(JSON.stringify(body));
    }
  });
  server.start(-1);
  Services.prefs.setStringPref(
    "mail.thunderbirdx.update.url",
    `http://localhost:${server.identity.primaryPort}/latest`
  );

  registerCleanupFunction(async () => {
    Services.prefs.clearUserPref("mail.thunderbirdx.update.url");
    Services.prefs.clearUserPref("mail.thunderbirdx.version");
    Services.prefs.clearUserPref("mail.thunderbirdx.update.lastCheck");
    Services.prefs.clearUserPref("mail.thunderbirdx.update.dismissed");
    await new Promise(resolve => server.stop(resolve));
  });
});

add_task(function test_compareVersions() {
  const compare = (a, b) =>
    Math.sign(ThunderBirdXUpdates.compareVersions(a, b));
  Assert.equal(compare("0.2.0", "0.1.0"), 1, "minor bump is newer");
  Assert.equal(compare("0.10.0", "0.9.5"), 1, "compares numerically");
  Assert.equal(compare("v1.0.0", "1.0.0"), 0, "ignores a leading v");
  Assert.equal(compare("1.0", "1.0.0"), 0, "missing parts count as 0");
  Assert.equal(compare("1.0.0-beta.1", "1.0.0"), 0, "ignores suffixes");
  Assert.equal(compare("0.1.0", "0.1.1"), -1, "patch bump is newer");
});

add_task(async function test_devBuild() {
  Services.prefs.setStringPref("mail.thunderbirdx.version", "0.0.0");
  Assert.ok(ThunderBirdXUpdates.isDevBuild, "0.0.0 is a development build");
  Assert.ok(
    !ThunderBirdXUpdates.shouldAutoCheck(),
    "development builds never check in the background"
  );
  const result = await ThunderBirdXUpdates.check();
  Assert.equal(result.status, "dev", "a manual check reports a dev build");
});

add_task(async function test_updateAvailable() {
  Services.prefs.setStringPref("mail.thunderbirdx.version", "0.1.0");
  Services.prefs.setIntPref("mail.thunderbirdx.update.lastCheck", 0);
  Assert.ok(ThunderBirdXUpdates.shouldAutoCheck(), "a check is due");

  nextResponse = [
    200,
    { tag_name: "v0.2.0", html_url: `${RELEASES_PAGE}/tag/v0.2.0` },
  ];
  const result = await ThunderBirdXUpdates.check();
  Assert.equal(result.status, "update", "a newer release is found");
  Assert.equal(result.latestVersion, "0.2.0", "the leading v is removed");
  Assert.equal(result.url, `${RELEASES_PAGE}/tag/v0.2.0`, "release page");
  Assert.ok(
    !ThunderBirdXUpdates.shouldAutoCheck(),
    "no further check is due for a day"
  );

  Assert.ok(!ThunderBirdXUpdates.isDismissed("0.2.0"), "not dismissed yet");
  ThunderBirdXUpdates.dismiss("0.2.0");
  Assert.ok(ThunderBirdXUpdates.isDismissed("0.2.0"), "dismissed");
  Assert.ok(
    !ThunderBirdXUpdates.isDismissed("0.3.0"),
    "a later version is offered again"
  );
});

add_task(async function test_upToDate() {
  Services.prefs.setStringPref("mail.thunderbirdx.version", "0.2.0");
  nextResponse = [
    200,
    { tag_name: "v0.2.0", html_url: `${RELEASES_PAGE}/tag/v0.2.0` },
  ];
  const result = await ThunderBirdXUpdates.check();
  Assert.equal(result.status, "current", "same version is up to date");
});

add_task(async function test_foreignLink() {
  Services.prefs.setStringPref("mail.thunderbirdx.version", "0.1.0");
  nextResponse = [
    200,
    { tag_name: "v0.3.0", html_url: "https://example.com/not-a-release" },
  ];
  const result = await ThunderBirdXUpdates.check();
  Assert.equal(result.status, "update", "the update is still reported");
  Assert.equal(
    result.url,
    RELEASES_PAGE,
    "links outside the repository's releases are not followed"
  );
});

add_task(async function test_noReleaseYet() {
  Services.prefs.setStringPref("mail.thunderbirdx.version", "0.1.0");
  nextResponse = [404, { message: "Not Found" }];
  const result = await ThunderBirdXUpdates.check();
  Assert.equal(result.status, "current", "no published release is fine");
});

add_task(async function test_errors() {
  Services.prefs.setStringPref("mail.thunderbirdx.version", "0.1.0");
  nextResponse = [500, null];
  let result = await ThunderBirdXUpdates.check();
  Assert.equal(result.status, "error", "server errors are reported");

  nextResponse = [200, { tag_name: "nightly" }];
  result = await ThunderBirdXUpdates.check();
  Assert.equal(result.status, "error", "a tag that isn't a version");
});
