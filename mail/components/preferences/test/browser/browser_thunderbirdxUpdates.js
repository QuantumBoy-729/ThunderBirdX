/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, you can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Tests the Updates row of Settings > Appearance > ThunderBirdX (personal
 * fork). The update check talks to a data: URL instead of GitHub.
 */

const RELEASE_URL =
  "https://github.com/QuantumBoy-729/ThunderBirdX/releases/tag/v9.0.0";

function releaseResponse(tag) {
  return `data:application/json,${encodeURIComponent(
    JSON.stringify({ tag_name: tag, html_url: RELEASE_URL })
  )}`;
}

add_setup(async () => {
  await SpecialPowers.pushPrefEnv({
    set: [
      ["mail.overhaul.enabled", true],
      ["mail.thunderbirdx.version", "0.1.0"],
    ],
    clear: [["mail.thunderbirdx.update.lastCheck"]],
  });
});

add_task(async function test_layoutAndEnabledState() {
  const { prefsDocument } = await openNewPrefsTab("paneAppearance");
  const autoCheck = prefsDocument.getElementById("overhaulUpdateAuto");
  const checkNow = prefsDocument.getElementById("overhaulUpdateCheck");
  const theme = prefsDocument.getElementById("overhaulTheme");

  Assert.ok(BrowserTestUtils.isVisible(autoCheck), "auto check is shown");
  Assert.ok(BrowserTestUtils.isVisible(checkNow), "Check now is shown");
  Assert.ok(
    BrowserTestUtils.isHidden(
      prefsDocument.getElementById("overhaulUpdateStatusRow")
    ),
    "no status before a check"
  );
  // Both rows' controls sit in the second column of the same grid.
  const updatesRow = autoCheck.parentElement;
  const backgroundRow = prefsDocument.getElementById(
    "overhaulBackgroundChoose"
  ).parentElement;
  Assert.lessOrEqual(
    Math.abs(
      updatesRow.getBoundingClientRect().left -
        backgroundRow.getBoundingClientRect().left
    ),
    1,
    "the Updates controls line up with the other options"
  );

  await SpecialPowers.pushPrefEnv({ set: [["mail.overhaul.enabled", false]] });
  await TestUtils.waitForCondition(
    () => theme.disabled,
    "look options are disabled with the look"
  );
  Assert.ok(!autoCheck.disabled, "auto check stays enabled");
  Assert.ok(!checkNow.disabled, "Check now stays enabled");
  await SpecialPowers.popPrefEnv();

  await closePrefsTab();
});

add_task(async function test_checkNow() {
  const { prefsDocument } = await openNewPrefsTab("paneAppearance");
  const checkNow = prefsDocument.getElementById("overhaulUpdateCheck");
  const statusRow = prefsDocument.getElementById("overhaulUpdateStatusRow");
  const status = prefsDocument.getElementById("overhaulUpdateStatus");
  const download = prefsDocument.getElementById("overhaulUpdateDownload");

  async function check(response, expectedId) {
    await SpecialPowers.pushPrefEnv({
      set: [["mail.thunderbirdx.update.url", response]],
    });
    checkNow.scrollIntoView();
    checkNow.doCommand();
    await TestUtils.waitForCondition(
      () =>
        !checkNow.disabled &&
        prefsDocument.l10n.getAttributes(status).id !=
          "overhaul-updates-checking",
      "the check finishes"
    );
    Assert.equal(
      prefsDocument.l10n.getAttributes(status).id,
      expectedId,
      "the status shows the result"
    );
    Assert.ok(BrowserTestUtils.isVisible(statusRow), "status is shown");
    await SpecialPowers.popPrefEnv();
  }

  await check(releaseResponse("v9.0.0"), "overhaul-updates-available");
  Assert.deepEqual(
    prefsDocument.l10n.getAttributes(status).args,
    { version: "9.0.0" },
    "the new version is named"
  );
  Assert.ok(BrowserTestUtils.isVisible(download), "Download is offered");

  await check(releaseResponse("v0.1.0"), "overhaul-updates-latest");
  Assert.ok(BrowserTestUtils.isHidden(download), "no Download when current");

  await check("data:application/json,not json", "overhaul-updates-error");

  await closePrefsTab();
});
