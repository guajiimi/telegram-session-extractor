# Telegram Session Extractor

A Chrome Extension (Manifest V3) that extracts Telegram Mini App session data — `initData`, `query_id`, cookies, and user info from Telegram Web.

## Features

- **Multi-strategy extraction**: sessionStorage, window globals, URL hash, iframe scanning, localStorage
- **Dark/Light mode** toggle with smooth transitions
- **English/Indonesian** language support (🌐 button)
- **One-click copy** for individual fields or full JSON export
- **Cookie/token scanning** for session-related cookies
- **Frame scanning** across all iframes on the page
- **Persistent storage** — remembers last extracted session

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the extension folder
5. The extension icon will appear in your toolbar

## Usage

1. Open a Telegram Mini App in your browser (via web.telegram.org or a mini app link)
2. Click the extension icon in your toolbar
3. Press **Extract All** to scan for session data
4. View results across the User, InitData, Token, and Frames tabs
5. Click any field to copy, or use the JSON button to export everything

## Tabs

| Tab | Description |
|-----|-------------|
| **User** | User ID, name, username, phone, premium status, query ID |
| **InitData** | Full initData string (the raw Telegram Mini App session token) |
| **Token** | Session-related cookies and auth tokens |
| **Frames** | Data found in iframes (useful for embedded mini apps) |

## Extraction Strategies

The extension tries multiple strategies in order:

1. `sessionStorage.__telegram__initParams`
2. `sessionStorage.tapps/launchParams`
3. `sessionStorage.telegram-apps/launch-params` (newer SDK)
4. `window.__telegram__initParams`
5. `Telegram.WebView.initParams`
6. `Telegram.WebApp.initData`
7. URL hash parameters
8. URL search parameters
9. Full sessionStorage scan
10. Full localStorage scan

## Credits

Based on the original work by [Thog](https://t.me/thogairdrops).

## License

MIT
