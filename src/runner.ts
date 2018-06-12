import { query } from 'jsonpath'
import * as chromeLauncher from 'chrome-launcher'
import { getLighthouseReport } from './lighthouse'
import { isNumber } from 'lodash'
import Config from './config'

export default class Runner {
  private config: Config
  private chrome: chromeLauncher.LaunchedChrome

  constructor(config: Config) {
    this.config = config
  }

  async start() {
    this.chrome = await chromeLauncher.launch({ ...this.config.chromeOpts })
  }

  async stop() {
    await this.chrome.kill()
  }

  async runAudit(url): Promise<IAuditReport> {
    const results = await getLighthouseReport(url, { port: this.chrome.port }, this.config.lighthouseOpts)
    delete results.artifacts

    const urlReport: IAuditReport = {}
    Object.keys(this.config.reportQuery).forEach(k => {
      const value = query(results, this.config.reportQuery[k])[0]
      urlReport[k] = isNumber(value) ? Math.round(value) : value
    })

    return urlReport
  }
}
