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
  @example

  Expects a .json file with fields like:
  ```
  {
    "urls": ["http://example.com"],
    "storeDir": "./reports",
    "skipAudits": ["speed-index-metric"]
  }
  ```
*/

export default class Config {
  chromePort: number
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
      chromeFlags: ['--disable-gpu', '--show-paint-rects', '--headless', '--no-sandbox']
    }
  }

  get storeDir() {
    return this.config.storeDir
  }
}
