# YTM-RPC Vencord Plugin

A Vencord plugin that displays your YouTube Music activity on Discord. No separate server needed!

> **⚠️ Warning:** Vencord is a third-party client modification that violates Discord's Terms of Service. Using it may result in account suspension or ban. **Use at your own risk.**

## Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (`npm i -g pnpm`)

## Brainless install, feel your luck :) [TESTED ONLY ON W11 !!!]

```bash
git clone https://github.com/Vendicated/Vencord
cd Vencord
git clone https://github.com/Louchatfroff/YTMusic-RPC
mkdir -p src\userplugins\YTMusic-RPC
xcopy "YTmusic-RPC\vencord-plugin" "src\userplugins\YTMusic-RPC" /E /I
pnpm install --frozen-lockfile
pnpm build --dev
pnpm inject
```

## Installation

Custom plugins require building Vencord from source.

### 1. Clone and Build Vencord

If you don't have Vencord installed from source yet:

```bash
git clone https://github.com/Vendicated/Vencord
cd Vencord
pnpm install --frozen-lockfile
pnpm build --dev
pnpm inject
```

> **Note:** Vencord uses pnpm. Do NOT use npm or yarn!

### 2. Get a Discord Application ID

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" → Give it a name (e.g., "YouTube Music")
3. Copy the **Application ID**

### 3. Install the Plugin

1. Create the userplugins folder if it doesn't exist:
   ```bash
   mkdir -p src/userplugins
   ```

2. Copy the plugin folder:
   ```bash
   xcopy "YTmusic-RPC\vencord-plugin" "src\userplugins\YTMusic-RPC" /E /I
   ```

   The folder should contain:
   - `index.ts` - Main plugin code
   - `native.ts` - Node.js server code

3. Rebuild Vencord:
   ```bash
   pnpm build --dev
   ```

4. Restart Discord (Ctrl+R or Settings → Vencord → Restart Client)

### 4. Configure the Plugin

1. Open Discord Settings
2. Go to Vencord → Plugins
3. Find **YTMusicRPC** and enable it
4. Click the gear icon ⚙️
5. Enter your **Application ID**
6. Restart Discord

### 5. Install the Browser Extension

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → Select the `extension/` folder from this repo

### 6. Use It

1. Make sure Discord is open with Vencord
2. Play music on [YouTube Music](https://music.youtube.com)
3. Your Discord status will update automatically!

## Settings

| Option | Description | Default |
|--------|-------------|---------|
| Application ID | Your Discord app ID from Developer Portal | (required) |
| Port | HTTP port for extension connection | 8766 |

## Updating

When updating the plugin, copy the new files and rebuild:

```bash
pnpm build --dev
```

Then restart Discord.

## References

- [Vencord Installation Guide](https://docs.vencord.dev/installing/)
- [Custom Plugins Guide](https://docs.vencord.dev/installing/custom-plugins/)
