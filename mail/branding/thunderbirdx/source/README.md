# ThunderBirdX logo sources

`logo.jpg` is the original ThunderBirdX artwork. The branding images in the
parent folder are generated from it:

```bash
python cutout.py logo.jpg build
python make_assets.py build/mark.png ..
```

`cutout.py` cuts the bird-and-ring mark out of the dark background (dropping
the lightning, glow and wordmark) and writes `build/mark.png`. `make_assets.py`
writes the window icons (`.png`, `.ico`, `.icns`), the About dialog and account
setup logos, the Windows Start menu tiles and the installer images.

The `.exe` icon is built into the prebuilt Thunderbird binary used by artifact
builds, so it still shows the Thunderbird Daily icon.
