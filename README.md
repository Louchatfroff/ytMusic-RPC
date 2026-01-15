# YTM-RPC - YouTube Music Discord Rich Presence

The one going to achieve **parity** with spotify rich presence...

## Features

**Shows current song, artist, and album art on Discord**
> Using **precise** metadata fetching directly from youtube music and **high quality** album cover images !

**Progress bar with elapsed/remaining time**
> Smart Timestamp Synchronization : The RPC updates playback time every second, freezes instantly on pause, and resyncs to the exact position after seeking or ads, **preventing drift and desync** common in other YT Music RPCs. A slight delay can sometime be noticed but it's never consistent and is due to both youtube data fetch and discord limitations and desyncs.

**Fast updates using clunckless and optimized code**
> The code tries to run **smoothly**, no user interaction needed after initial setup and **low ram usage**.

**Vencord plugin**
> **No server** needs to run in background, it runs directly in discord, using low ram and already existing discord protocols, it assures **stability** and **flawless communication** between the two parts of the software.

## How does that work ?

There are two parts to this program :

**Chromium Extension**
> Divided in 3 different scripts: content, background and popup, they all have a different purpose :
> - **content** : Injected in music.youtube.com along with the whole extension, acts as a data retriever, observing DOM and media session changes and collects the data from the music every changes and formats the collected data to json.
> - **background** : Acts as a bridge between the browser and Vencord, sends updated fetched data via local HTTP to the discord plugin.
> - **popup** : User interface, shows the current state of the music, connection and possible errors.

> **Note:** Album art is fetched directly from the YouTube Music page or extracted URLs and no official YouTube Music API is used; DOM extraction + browser network data is the source.

**Vencord Plugin**
> Uses 2 different scripts: native and index, working together to finalize the data flow :
> - Hook into Discord’s internal IPC to update rich presence.
> - Maintain local state of most recent metadata from the extension.
> - Perform smart timestamp synchronization: incrementing elapsed time every second, correctly handling seeking/ads/pauses, resyncing after drift or external state changes.
> - Use the extracted data to compute: startTimestamp, endTimestamp, cover art URL, artist & title strings.
> - Send one presence update per tick or on state change, respecting Discord’s rate limits (hence the very small delay on the RPC itself)
> - Vencord leverages internal Rich Presence hooks: similar logic to discord-rpc but native in-process, avoiding external RPC daemons or socket listeners and generates presence that Discord desktop app displays as user activity.


## Requirements

- [Git](https://git-scm.com/), [Node.js](https://nodejs.org/) v18+, [pnpm](https://pnpm.io/)
- Discord desktop app (or Vencord)
- Chromium based web browser
> **Tip:** Update to the **latest** stable release, risk 0 isn't a thing !

## Setup

**Replicate** the following instructions **precisely** :

---

### Vencord Plugin

> **⚠️ Warning:** Vencord is a third-party client modification that violates Discord's Terms of Service. Using it may result in account suspension or ban. **Use at your own risk.**

No separate server needed! The plugin runs inside Discord.

**Requirements:** [Git](https://git-scm.com/), [Node.js](https://nodejs.org/) v18+, [pnpm](https://pnpm.io/)
> **Tip:** As previously said, update to the **latest** stable release, risk 0 will never exist!

> **Note:** Custom plugins require building Vencord from source. See the [official guide](https://docs.vencord.dev/installing/).

1. **Clone and build Vencord** (if not already):
   ```bash
   git clone https://github.com/Vendicated/Vencord
   cd Vencord
   pnpm install --frozen-lockfile
   pnpm build --dev
   pnpm inject
   ```

2. **Get a Discord Application ID**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application → Copy the **Application ID**

3. **Install the plugin**
   - Copy the `vencord-plugin` folder to `Vencord/src/userplugins/ytmusicRpc`
   - Rebuild: `pnpm build --dev`
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
## Project Logic

```
YouTube Music (The Start)    → Input, user plays music in YT Music
          │
          ▼
Browser Extension (Browser)  → Informational backend, detects song info, play state, and thumbnails; sends updates to the native server
          │
          ▼
Native HTTP Server (Discord) → Logic backend, minimal local server; stores latest data and exposes it to Vencord plugin
          │
          ▼
Vencord Plugin (Discord)     → Client, reads latest music data, calculates timestamps, updates Discord activity
          │
          ▼
Discord Status  (Goal)       → Output, displays current song, artist, album art, and buttons in Discord
```
## Troubleshooting

**Extension not connecting**
> - Make sure Vencord plugin is enabled
> - Check that port 8765 AND **8766** are not in use by another app

**Discord status not updating**
> - Enable "Display current activity" in Discord Settings → Activity Privacy
> - Verify your Application ID is correct

**Extension not detecting music**
> - Make sure you're on [music.youtube.com](https://music.youtube.com)
> - Refresh the YouTube Music page
> - Reload the extension

## Non-Issues !!!

**Album covers not loading.**
> Normal behavior when high quality covers aren't available, desision made from accesibility over quantity.

**Small delay (<1s)**
> Due to Youtube Music and Discord restrictions, currently trying to find a way around it to match (or surpass) quality with stock discord integrations.

**Progress bar dissapearing on ad/pause**
> Intended behavior to avoid desync and loss of precision from Discord auto advancing timestamps.

**Buttons not showing.**
> Okay this is an issue, currently working on it, I'm just bad at this, sorry, sincerly.

## Future features

**Multi-Platform compatibility**
Yes ! More platforms as input and output ! Let's see what the future gives us !

**Customisable RPC**
> Common, wouldn't it be so cool?

**Links to song, artist and album on imdb or similar.**
> Self explainatory.

## Slight Disclaimer
> Yes, external tools were used to sort the code. It couldnt be that clean if it was me lol.

## License

GPL 3.0 Licence
