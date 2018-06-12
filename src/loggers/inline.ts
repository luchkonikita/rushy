import * as ora from 'ora'

export default class InlineLogger implements Logger {
  spinner: any

  info(text: string, options = { persist: false }) {
    this.log(text, { ...options, symbol: '✅ ' })
  }

  error(text: string, options = { persist: false }) {
    this.log(text, { ...options, symbol: '❌ ' })
  }

  private log(text: string, options = { persist: false, symbol: '⚠️ ' }) {
    this.ensureStarted()

    if (options.persist) {
      this.spinner.stopAndPersist({ symbol: options.symbol, text })
    } else {
      this.spinner.text = text
    }
  }

  private ensureStarted() {
    if (!this.spinner) {
      this.spinner = ora().start()
    }
  }
}
