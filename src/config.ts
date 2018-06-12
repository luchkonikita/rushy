import * as fs from 'fs'

const DEFAULT_CONFIG = {
  reporter: 'csv',
  storeDir: 'tmp',
  concurrency: 1,
  reportQuery: {
    'Score': '$.reportCategories[0].score',
    'Time to First Byte': '$.audits["time-to-first-byte"].rawValue',
    'First Meaningful Paint': '$.audits["first-meaningful-paint"].rawValue',
    'First Interactive': '$.audits["first-interactive"].rawValue',
    'Consistently Interactive': '$.audits["consistently-interactive"].rawValue',
    'Total Byte Weight': '$.audits["total-byte-weight"].rawValue',
    'Speed Index': '$.audits["speed-index-metric"].rawValue',
    'Total Time': '$.timing.total'
  }
}

/*
 * @example
 *
 * Expects a .json file with fields like:
 * ```
 *   {
 *     "urls": ["http://example.com"],
 *     "storeDir": "./reports",
 *     "reporter": "html",
 *     "reportQuery": {
 *       "Time to First Byte": "$.audits['time-to-first-byte'].rawValue"
 *     }
 *   }
 * ```
 *
 * Options:
 * `urls` - the list of pages to run audits on.
 * `storeDir` - the directory for storing reports.
 * `concurrency` - the number of Chrome/Lighthouse processes to launch simultaneously.
 * `reporter` - sets the report format. Can be `html` or `csv`.
 * `reportQuery` - options allows you to specify custom query against lighthouse results. Suitable for advanced usage.
 *
 */

export default class Config {
  private config: any

  constructor(configFile) {
    const userConfig = JSON.parse(fs.readFileSync(configFile).toString())
    this.config = { ...DEFAULT_CONFIG, ...userConfig }
  }

  get urls(): string[] {
    return this.config.urls
  }

  get lighthouseOpts() {
    return {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: ['performance']
      }
    }
  }

  get chromeOpts() {
    return {
      chromeFlags: ['--disable-gpu', '--headless', '--no-sandbox']
    }
  }

  get reportQuery(): any {
    return this.config.reportQuery
  }

  get concurrency(): number {
    return this.config.concurrency
  }

  get reporter(): 'csv' | 'html' {
    return this.config.reporter
  }

  get storeDir(): string {
    return this.config.storeDir
  }
}
