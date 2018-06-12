import * as ora from 'ora'
import { padStart } from 'lodash'

import Config from './config'
import CSVReporter from './reporters/csv'
import HTMLReporter from './reporters/html'
import Runner from './runner'

function splitIntoGroups(collection, groupSize): string[][] {
  const results: string[][] = []
  let start = 0
  let end = groupSize
  let group = collection.slice(start, end)

  while (group.length > 0) {
    results.push(group)
    start += groupSize
    end += groupSize
    group = collection.slice(start, end)
  }

  return results
}

export default async function generateReport(configFile: string, destFileName: string) {
  const spinner = ora('Launching Chrome').start()

  process.on('SIGINT', async () => {
    spinner.stopAndPersist({
      symbol: '👹',
      text: 'Interrupted'
    })
  })

  const config = new Config(configFile)
  const reporter = config.reporter === 'csv' ? new CSVReporter(config) : new HTMLReporter(config)

  spinner.text = 'Starting pool of lighthouse workers'

  const pool: Runner[] = []

  // Kill Chrome processes on interruption
  process.on('SIGINT', async () => {
    for (const worker of pool) {
      await worker.stop()
    }
  })

  for (let i = 0; i <= config.concurrency; i++) {
    const runner = new Runner(config)
    await runner.start()
    pool.push(runner)
  }

  const urlGroups = splitIntoGroups(config.urls, config.concurrency)

  const report: ReportsList = {}

  let processed = 0
  let remaining = config.urls.length

  function reportProgress() {
    spinner.text = [
      'Running pages audit',
      '',
      `  Concurrency     ${padStart(config.concurrency, 3)}`,
      `  Total pages     ${padStart(config.urls.length, 3)}`,
      '',
      `  Processed pages ${padStart(processed, 3)}`,
      `  Remaining pages ${padStart(remaining, 3)}`
    ].join('\n')
  }

  for (const group of urlGroups) {
    await Promise.all(
      group.map(async (url, i) => {
        reportProgress()

        try {
          report[url] = await pool[i].runAudit(url)
        } catch (error) {
          report[url] = {}
        }

        remaining--
        processed++
        reportProgress()
      })
    )
  }

  spinner.text = 'Shutting down workers'

  for (const worker of pool) {
    await worker.stop()
  }

  spinner.text = 'Saving report'
  const reportFileName = reporter.write(report, `${destFileName}.${reporter.ext}`)

  spinner.stopAndPersist({
    symbol: '⚡️',
    text: `Report saved to ${reportFileName}`
  })
}
