import * as fs from 'fs'

const DEFAULT_AUDITS = [
  'time-to-first-byte',
  'first-meaningful-paint',
  'first-interactive',
  'consistently-interactive',
  'total-byte-weight',
  'speed-index-metric'
]

const DEFAULT_CONFIG = {
  skipAudits: [],
  storeDir: 'tmp'
}

/*
 * @example
 *
 * Expects a .json file with fields like:
 * ```
 *   {
 *    "urls": ["http://example.com"],
 *    "storeDir": "./reports",
 *    "skipAudits": ["speed-index-metric"],
 *    "reporter": "html"
 *   }
 * ```
 *
 * Note that the default reporter is `csv`.
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

  get auditKeys(): string[] {
    return DEFAULT_AUDITS
      .filter(k => !this.config.skipAudits.includes(k))
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

  get concurrency(): number {
    return this.config.concurrency ? parseInt(this.config.concurrency, 10) : 1
  }

  get reporter(): 'csv' | 'html' {
    return this.config.reporter || 'csv'
  }

  get storeDir(): string {
    return this.config.storeDir
  }
}
