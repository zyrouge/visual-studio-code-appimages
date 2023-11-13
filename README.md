# Visual Studio Code AppImages

[![Latest](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fzyrouge%2Fvisual-studio-code-appimages%2Fdist-badges%2Fbadge-latest.json)](https://github.com/zyrouge/visual-studio-code-appimages/releases/latest)
[![Latest (Pre-release)](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fzyrouge%2Fvisual-studio-code-appimages%2Fdist-badges%2Fbadge-prerelease.json)](https://github.com/zyrouge/visual-studio-code-appimages/releases)
[![Release](https://github.com/zyrouge/visual-studio-code-appimages/actions/workflows/release.yml/badge.svg)](https://github.com/zyrouge/visual-studio-code-appimages/actions/workflows/release.yml)
[![Badges](https://github.com/zyrouge/visual-studio-code-appimages/actions/workflows/badges.yml/badge.svg)](https://github.com/zyrouge/visual-studio-code-appimages/actions/workflows/badges.yml)

Packages [Visual Studio Code](https://code.visualstudio.com/) and [Visual Studio Code Insiders](https://code.visualstudio.com/insiders/) as AppImages.

AppImages are directly created from `.tar.gz` builds and are not decompiled or modified. AppImages are compiled in Ubuntu 20.04. Latest releases contain stable version and pre-releases contain insiders version.

## Supported Builds

-   AMD64
-   ARMhf
-   ARM64

## Installation

### Pho

This command requires [Pho](https://github.com/zyrouge/pho) to be installed.

```bash
# stable
pho install github --id visual-studio-code zyrouge/visual-studio-code-appimages

# insiders
pho install github --release prerelease --id visual-studio-code zyrouge/visual-studio-code-appimages
```

### Manual

Can be directly downloaded from Github Releases and intergrated using tools like AppImageLauncher.
