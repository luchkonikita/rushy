import * as path from 'path'
import * as pug from 'pug'
import BaseReporter from './base_reporter'

const template = path.join(process.cwd(), 'templates', 'html.pug')

export default class HTMLReporter extends BaseReporter implements Reporter {
  write(report: ReportsList, destFileName: string): string {
    const urls = Object.keys(report).sort()
    const reportKeys = Object.keys(this.config.reportQuery)
    const header = ['Page'].concat(reportKeys)

    const rows = urls.map(url => {
      const results = reportKeys.map(key => report[url][key])
      return [url].concat(results)
    })

    const html = pug.renderFile(template, { header, rows })
    return this.writeReport(html, destFileName)
  }

  get ext(): string {
    return 'html'
  }
}
