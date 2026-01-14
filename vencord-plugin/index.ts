/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin, { OptionType, PluginNative } from "@utils/types";
import { ApplicationAssetUtils, FluxDispatcher } from "@webpack/common";

const Native = VencordNative.pluginHelpers.YTMusicRPC as PluginNative<typeof import("./native")>;

let applicationId = "";
let pollInterval: ReturnType<typeof setInterval> | null = null;
let lastDataHash = "";

function hashData(data: any) {
    return [
        data.title,
        data.artist,
        data.isPaused,
        Math.floor(data.currentTime),
        Math.floor(data.duration),
        data.url
    ].join("|");
}

async function getApplicationAsset(key: string): Promise<string> {
    if (!applicationId) return "";
    return (await ApplicationAssetUtils.fetchAssetIds(applicationId, [key]))[0];
}

function setActivity(activity: any | null) {
    try {
        FluxDispatcher.dispatch({
            type: "LOCAL_ACTIVITY_UPDATE",
            activity: activity,
            socketId: "YTM-RPC",
        });
    } catch (e) {
        console.error("[YTM-RPC] Failed to set activity:", e);
    }
}

async function createActivity(data: any) {
    if (!applicationId) return null;

    let largeImage: string | undefined;
    if (data.thumbnail) {
        let url = data.thumbnail.replace("http://", "https://");
        if (url.includes("lh3.googleusercontent.com") && !url.includes("-rj")) {
            url = url.replace(/=w\d+(-h\d+)?/, "=w544-h544-rj");
        }
        try {
            largeImage = await getApplicationAsset(url);
            console.log("[YTM-RPC] Asset ID:", largeImage);
        } catch (e) {
            console.log("[YTM-RPC] Failed to get asset, using URL directly");
            largeImage = url;
        }
    }

    const songUrl = data.url || "https://music.youtube.com";

    const activity: any = {
        application_id: applicationId,
        name: "YouTube Music",
        type: 2,
        details: data.title?.substring(0, 128) || "Unknown",
        state: data.artist?.substring(0, 128) || "Unknown Artist",
        assets: {
            large_image: largeImage,
            large_text: data.title || "YouTube Music",
        },
    };

    if (!data.isPaused && data.duration > 0) {
        const now = Date.now();
        activity.timestamps = {
            start: Math.floor(now - (data.currentTime * 1000)),
            end: Math.floor(now + ((data.duration - data.currentTime) * 1000)),
        };
    }

    activity.buttons = [
        { label: "Listen on YouTube Music", url: songUrl },
        { label: "by : louchat", url: "https://louchat.neurallab.ovh/" }
    ];

    return activity;
}

async function pollForUpdates() {
    try {
        const shouldClear = await Native.getShouldClear();
        if (shouldClear) {
            setActivity(null);
            lastDataHash = "";
            return;
        }

        const data = await Native.getLatestData();
        if (!data) return;

        const hash = hashData(data);
        if (hash === lastDataHash) return; // skip if nothing changed
        lastDataHash = hash;

        const activity = await createActivity(data);
        setActivity(activity);
        console.log("[YTM-RPC] Updated:", data.title);
    } catch (e) {
        console.error("[YTM-RPC] Poll error:", e);
    }
}

export default definePlugin({
    name: "YTMusicRPC",
    description: "Display your YouTube Music activity as Discord status. Works with the YTM-RPC browser extension.",
    authors: [Devs.Ven],

    options: {
        applicationId: {
            type: OptionType.STRING,
            description: "Your Discord Application ID (from Developer Portal)",
            default: "",
        },
        port: {
            type: OptionType.NUMBER,
            description: "HTTP port for extension connection",
            default: 8766,
        },
    },

    async start() {
        const settings = Vencord.Settings.plugins.YTMusicRPC;
        applicationId = settings?.applicationId || "";
        const port = settings?.port || 8766;

        if (!applicationId) {
            console.warn("[YTM-RPC] No Application ID configured! Go to Settings > Plugins > YTMusicRPC");
            return;
        }

        console.log("[YTM-RPC] Starting with Application ID:", applicationId);

        if (!Native || !Native.startServer) {
            console.error("[YTM-RPC] Native module not loaded! Make sure native.ts exists.");
            return;
        }

        const result = await Native.startServer(port);
        if (!result?.success) {
            console.error("[YTM-RPC] Failed to start HTTP server:", result?.error || "Unknown error");
            return;
        }

        pollInterval = setInterval(pollForUpdates, 1000);
    },

    stop() {
        console.log("[YTM-RPC] Stopping...");

        if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
        }

        Native.stopServer();
        setActivity(null);
    },
});
