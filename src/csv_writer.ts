import * as fs from 'fs'
import * as path from 'path'
import * as stringifyCSV from 'csv-stringify/lib/sync'
import { humanize } from 'inflection'

import Config from './config'
import { ReportsList } from './runner'

export default class CSVWriter {
  private config: Config

  constructor(config: Config) {
    this.config = config
  }

  write(report: ReportsList, destFileName: string): string {
    const rows = Object.keys(report).map(url => {
      const results = this.config.auditKeys.map(key => report[url][key])
      return [url].concat(results)
    })
    const csv = stringifyCSV([this.header].concat(rows), { header: true })

    const { storeDir } = this.config
    if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir)
    const fileName = path.join(storeDir, destFileName)
    fs.writeFileSync(fileName, csv)
    return path.join(__dirname, fileName)
  }

  get header(): string[] {
    return ['Page'].concat(this.config.auditKeys.map(k => humanize(k.split('-').join(' ')))) // Header row
  }
}
