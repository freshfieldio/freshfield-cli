# 🥕 Freshfield.io CLI

Official CLI tool for [Freshfield.io](https://freshfield.io/) platform. Generate changelogs/release notes from your git commits.

> **⚠️ Early Development Notice:** Freshfield.io is in early stages of development. You may encounter bugs or breaking changes. If you find issues or have suggestions for improvements, please don't hesitate to [open an issue](https://github.com/freshfieldio/freshfield-cli/issues) or contribute to the project.

</br>

## Quick start

### 1. Initialize with your credentials

```bash
npx freshfield-cli init
```

Enter your **CLI token** and **App ID** when prompted. Get these from your [Freshfield.io dashboard](https://app.freshfield.io/).

> If you want to use a different App ID or token later, just re-run this command.

### 2. Generate draft updates from git commits

```bash
npx freshfield-cli update
```

Run this from any git repository folder to create draft updates from recent commits. You can choose:

- **Date Range**: Select commits between specific dates
- **Commit Count**: Select the last N commits

### 3. Edit and publish

All CLI-generated updates are created as **private drafts**. Review, edit, and publish them from your [Freshfield.io dashboard](https://app.freshfield.io/).

</br>

## Installation

### Using npx (Recommended)

No installation needed, just run commands directly:

```bash
npx freshfield-cli init
npx freshfield-cli update
```

### Global Installation

```bash
npm install -g freshfield-cli
# or
pnpm add -g freshfield-cli
# or
yarn global add freshfield-cli
```

Then use without `npx`:

```bash
freshfield-cli init
freshfield-cli update
```

**Alternative commands:** You can also use `freshfield` or `ff` instead of `freshfield-cli`.

</br>

## Requirements

- **Node.js**: >= 18.0.0
- **Git**: Must be run from a git repository (for `update` command)
- **[Freshfield.io account](https://freshfield.io/)**

</br>

## License

[MIT](./LICENSE)
