import { getLighthouseReport } from './lighthouse'
import Config from './config'

interface IAudit {
  name: string
  rawValue: number | boolean
}

export interface IAuditReport {
  'time-to-first-byte'?: number
  'first-meaningful-paint'?: number
  'first-interactive'?: number
  'consistently-interactive'?: number
  'total-byte-weight'?: number
  'speed-index-metric'?: number
}

export type ReportsList = { [index: string]: IAuditReport }

export default class Runner {
  private config: Config

  constructor(config: Config) {
    this.config = config
  }

  async runAudit(url): Promise<IAuditReport> {
    const results = await getLighthouseReport(url, { port: this.config.chromePort }, this.config.lighthouseOpts)
    delete results.artifacts

    const urlReport: IAuditReport = {}
    this.config.auditKeys.forEach(key => {
      const data = results.audits[key] as IAudit
      urlReport[key] = data.rawValue
    })
    return urlReport
  }
}
