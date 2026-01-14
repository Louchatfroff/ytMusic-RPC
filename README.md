# YTM-RPC - YouTube Music Discord Rich Presence

Display your YouTube Music activity on Discord.

## Features

- Shows current song, artist, and album art on Discord
- Progress bar with elapsed/remaining time
- Actual album cover
- Vencord plugin (no server required, just vencord, built from source)

## Requirements

- Discord desktop app (or Vencord)
- Chrome/Edge/Brave browser

## Setup

Choose **one** of the two options below:

---

### Vencord Plugin

> **⚠️ Warning:** Vencord is a third-party client modification that violates Discord's Terms of Service. Using it may result in account suspension or ban. **Use at your own risk.**

No separate server needed! The plugin runs inside Discord.

**Requirements:** [Git](https://git-scm.com/), [Node.js](https://nodejs.org/) v18+, [pnpm](https://pnpm.io/)

> **Note:** Custom plugins require building Vencord from source. See the [official guide](https://docs.vencord.dev/installing/).

1. **Clone and build Vencord** (if not already):
   ```bash
   git clone https://github.com/Vendicated/Vencord
   cd Vencord
   pnpm i
   pnpm build
   pnpm inject
   ```

2. **Get a Discord Application ID**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application → Copy the **Application ID**

3. **Install the plugin**
   - Copy the `vencord-plugin` folder to `Vencord/src/userplugins/ytmusicRpc`
   - Rebuild: `pnpm build`
   - Restart Discord

4. **Configure**
   - Discord Settings → Vencord → Plugins → YTMusicRPC
   - Enter your Application ID

See [vencord-plugin/README.md](vencord-plugin/README.md) for detailed instructions.

### Install the browser extension

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → Select the `extension/` folder

### Use It

1. Make sure Discord is running (with Vencord plugin OR Node.js server)
2. Play music on [YouTube Music](https://music.youtube.com)
3. Your Discord status updates automatically!

## Project Structure

```
YTM-RPC/
├── vencord-plugin/         # Vencord plugin
│   └── ytmusicRpc.ts
└── extension/              # Browser extension
    ├── manifest.json
    ├── background.js
    ├── content.js
    └── popup.html/js
```

## Troubleshooting

### Extension not connecting
- Make sure Vencord plugin is enabled
- Check that port 8765 AND 8766 are not in use by another app

### Discord status not updating
- Enable "Display current activity" in Discord Settings → Activity Privacy
- Verify your Application ID is correct

### Extension not detecting music
- Make sure you're on [music.youtube.com](https://music.youtube.com)
- Refresh the YouTube Music page
- Reload the extension

## License

GPL 3.0 Liscence
