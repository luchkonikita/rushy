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
    this.config.auditKeys.forEach(key => {
      const data = results.audits[key] as IAudit
      urlReport[key] = isNumber(data.rawValue) ? Math.round(data.rawValue) : data.rawValue
    })
    return urlReport
  }
}
