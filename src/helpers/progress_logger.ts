import { padStart } from 'lodash'

export default class ProgressLogger {
  private urls: string[]
  private type: string
  private logger: Logger
  private processed: number

  constructor (urls: string[], type: string, logger: Logger) {
    this.urls = urls
    this.type = type
    this.logger = logger
    this.processed = 0
  }

  public update (url: string): void {
    this.processed++

    switch (this.type) {
      case 'inline':
        this.updateInline(url)
        break
       case 'serial':
         this.updateSerial(url)
         break
    }
  }

  private updateInline (url: string): void {
    this.logger.info([
      'Analyzing page performance:',
      `  ${url}`,
      '',
      `  Total pages     ${padStart(this.urls.length, 3)}`,
      `  Remaining pages ${padStart(this.getRemaining(), 3)}`
    ].join('\n'), { persist: false })
  }

  private updateSerial (url: string): void {
    this.logger.info(`Analyzing: ${url}, remaining: ${this.getRemaining()}`, { persist: false })
  }

  private getRemaining(): number {
    return this.urls.length - this.processed
  }
}
