import * as fs from 'fs'
import * as path from 'path'

import Config from '../config'

export default class BaseReporter {
  protected config: Config

  constructor(config: Config) {
    this.config = config
  }

  protected writeReport(report: string, destFileName: string): string {
    const { storeDir } = this.config
    if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir)
    const fileName = path.join(storeDir, destFileName)
    fs.writeFileSync(fileName, report)
    return path.join(process.cwd(), fileName)
  }
}
