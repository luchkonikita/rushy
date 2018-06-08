import * as chromeLauncher from 'chrome-launcher'
import * as ora from 'ora'
import { inflect } from 'inflection'

import Config from './config'
import CSVReporter from './reporters/csv'
import HTMLReporter from './reporters/html'
import Runner from './runner'

export default async function generateReport(configFile: string, destFileName: string) {
  const spinner = ora('Lauching Chrome').start()

  const config = new Config(configFile)
  const reporter = config.reporter === 'csv'
    ? new CSVReporter(config)
    : new HTMLReporter(config)
  const chrome = await chromeLauncher.launch({ ...config.chromeOpts })

  // Ensure Chrome is closed
  process.on('SIGINT', async () => {
    spinner.stopAndPersist({
      symbol: '👹',
      text: 'Interrupted'
    })

    await chrome.kill()
  })

  config.chromePort = chrome.port

  const runner = new Runner(config)

  const report: ReportsList = {}
  let processed = 0
  let remaining = config.urls.length

  for (const url of config.urls) {
    spinner.text = [
      `Running audit on ${url}`,
      '',
      `  Processed: ${processed} ${inflect('page', processed)}`,
      `  Remaining: ${remaining} ${inflect('page', remaining)}`
    ].join('\n')

    report[url] = await runner.runAudit(url)
    remaining--
    processed++
  }

  await chrome.kill()

  spinner.text = 'Saving report'
  const reportFileName = reporter.write(report, `${destFileName}.${reporter.ext}`)

  spinner.stopAndPersist({
    symbol: '⚡️',
    text: `Report saved to ${reportFileName}`
  })
}
