import * as stringifyCSV from 'csv-stringify/lib/sync'
import BaseReporter from './base_reporter'

export default class CSVReporter extends BaseReporter implements Reporter {
  write(report: ReportsList, destFileName: string): string {
    const urls = Object.keys(report).sort()
    const reportKeys = Object.keys(this.config.reportQuery)
    const header = ['Page'].concat(reportKeys)

    const rows = urls.map(url => {
      const results = reportKeys.map(key => report[url][key])
      return [url].concat(results)
    })

    const csv = stringifyCSV([header].concat(rows), { header: true })
    return this.writeReport(csv, destFileName)
  }

  get ext(): string {
    return 'csv'
  }
}
