import * as stringifyCSV from 'csv-stringify/lib/sync'
import { humanize } from 'inflection'
import BaseReporter from './base_reporter'

export default class CSVReporter extends BaseReporter implements Reporter {
  write(report: ReportsList, destFileName: string): string {
    const rows = Object.keys(report).map(url => {
      const results = this.config.auditKeys.map(key => report[url][key])
      return [url].concat(results)
    })
    const csv = stringifyCSV([this.header].concat(rows), { header: true })

    return this.writeReport(csv, destFileName)
  }

  private get header(): string[] {
    return ['Page'].concat(this.config.auditKeys.map(k => humanize(k.split('-').join(' ')))) // Header row
  }

  get ext(): string {
    return 'csv'
  }
}
