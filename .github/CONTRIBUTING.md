# Contributing to ThunderBirdX

Thanks for helping! Bug reports, ideas and code are all welcome.

## Reporting bugs and ideas

Open an [issue](https://github.com/QuantumBoy-729/ThunderBirdX/issues) with:

- your ThunderBirdX version (**Help → About ThunderBirdX**) and system,
- what you did, what you expected and what happened instead,
- a screenshot if it's about how something looks.

To check whether a bug comes from ThunderBirdX or from Thunderbird itself,
untick **Settings → Appearance → ThunderBirdX → Use the ThunderBirdX look** and
try again. If it still happens, it may be a Thunderbird bug; mention that in
the issue.

Security problems should be reported privately; see [SECURITY.md](SECURITY.md).

## Code

Set up a build with the steps in the [README](README.md#building-from-source).

### Where changes go

- `overhaul` is the main branch. Make changes on a separate branch and open a
  pull request into `overhaul`; please don't push to `overhaul` directly.
- Keep each pull request to one change, and describe how you tested it.

### Guidelines

- **Prefer new files over editing Thunderbird's.** ThunderBirdX styles live in
  `mail/themes/shared/mail/overhaul/`. When a Thunderbird file must change,
  keep the change small and mark it with an `Overhaul (personal fork)` comment,
  so weekly upstream merges stay easy.
- **Keep things switchable.** New UI should be behind
  `mail.overhaul.enabled` (CSS: `@media -moz-pref("mail.overhaul.enabled")`),
  and larger features behind their own preference.
- **Don't restyle high contrast mode** (`@media not (prefers-contrast)`), and
  give new controls keyboard and screen reader support.
- **User-visible text goes in Fluent files**, mostly
  `mail/locales/en-US/messenger/overhaul.ftl`.
- **No tracking and no cloud features that are on by default.**

### Before opening a pull request

From the `comm` folder:

```bash
../mach commlint <changed files>
```

Then, from the `firefox` folder, run the tests for the area you changed, for
example:

```bash
./mach xpcshell-test comm/mailnews/news/test/unit/test_handleNewsUri.js
```

```bash
./mach mochitest --headless comm/mail/components/preferences/test/browser/
```

Fixes to Thunderbird code that aren't specific to ThunderBirdX are best sent
to [Thunderbird](https://developer.thunderbird.net/contributing) too, so
everyone benefits and the change comes back in the next upstream merge.

## License

By contributing, you agree that your contributions are licensed under the
[Mozilla Public License 2.0](https://www.mozilla.org/MPL/2.0/).
