# Twitch Chat History Scraper

When reviewing past videos, Twitch does not provide an option to retrieve the
entire transcript for the chat section. This script does that.

## How to Use

You will need:

- Node.js (version 6+)
- [A Twitch Client ID](https://www.twitch.tv/kraken/oauth2/clients/new)

1. Run `npm install`.
2. Copy `config/default.yml` to `config/local.yml`.
3. Add your Twitch Client ID into `config/local.yml`.
4. Run `index.js`.

This creates a transcript in JSON form (`transcript.json` by default).

To convert it to a human readable form, a utility script `format-transcript.js`
has been provided.
