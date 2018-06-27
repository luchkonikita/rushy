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

Configuration .json file should look something like:

```
{
  "urls": ["http://example.com"],
  "storeDir": "./reports",
  "reporter": "html",
  "reportQuery": {
    "Time to First Byte": "$.audits['time-to-first-byte'].rawValue"
  }
}
```

Make sure to provide configuration suitable for your needs. More info can be found [here](https://github.com/luchkonikita/rushy/blob/master/src/config.ts#L18).

When completed, the audit will be stored as a .csv file.
What do next is up to you. For example, you can:
- commit reports to your git repository
- upload somewhere
- build historical data, charts, etc...

### Running in Parallel

The thing you might think about is speeding up your performance checks by making them parallel. Currently, the way to achieve that is to run `rushy` on a few machines or different containers so each instance only works on its own slice of an entire URL list.

To do so, please run the tool as the following:

```
rushy --worker 0 --worker-count=2 --config=[path/to/config.json]
```

Where `--worker` is zero-based worker number and `--worker-count` stands for the total number of workers you spawn.

Internally, rushy splits the URL list in a 100% deterministic and fair way so it loads your workers evenly and each URL is never checked twice.

#### Using with Docker

In case you want to run checks in a Docker container you might use [oleggromov/rushy](https://hub.docker.com/r/oleggromov/rushy/) image. Please make sure to read the documentation provided in the git repo [oleggromov/rushy-docker](https://github.com/oleggromov/rushy-docker).
