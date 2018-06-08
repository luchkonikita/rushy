# Rushy

This is a tiny wrapper around [Lighthouse](https://github.com/GoogleChrome/lighthouse) with some conveniences
to run continious audits on your website pages.

## Installation

You'll need to have Google Chrome installed, as Lighthouse runs audits using it.
To install `rushy` just do:

```
yarn global add rushy
```

## Usage

```
rushy --config=/path/to/your/config.json
```

Configuration .json file should look like:

```
{
  "urls": ["http://example.com"],
  "storeDir": "./reports",
  "skipAudits": ["speed-index-metric"],
  "reporter": "html"
}
```

Available reporters are `csv` and `html`.

Make sure to provide configuration suitable for your needs.

When completed, the audit will be stored as a .csv file.
What do next is up to you. For example, you can:
- commit reports to your git repository
- upload somewhere
- build historical data, charts, etc...

