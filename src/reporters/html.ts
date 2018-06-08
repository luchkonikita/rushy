import * as path from 'path'
import * as pug from 'pug'
import { humanize } from 'inflection'
import BaseReporter from './base_reporter'

const template = path.join(process.cwd(), 'templates', 'html.pug')

export default class HTMLReporter extends BaseReporter implements Reporter {
  write(report: ReportsList, destFileName: string): string {
    const rows = Object.keys(report).map(url => {
      const results = this.config.auditKeys.map(key => report[url][key])
      return [url].concat(results)
    })

    const html = pug.renderFile(template, { header: this.header, rows })
    return this.writeReport(html, destFileName)
  }

  private get header(): string[] {
    return ['Page'].concat(this.config.auditKeys.map(k => humanize(k.split('-').join(' ')))) // Header row
  }

  get ext(): string {
    return 'html'
  }
}
