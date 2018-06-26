import Config from './config'
import InlineLogger from './loggers/inline'
import SerialLogger from './loggers/serial'
import CSVReporter from './reporters/csv'
import HTMLReporter from './reporters/html'
import Runner from './runner'
import getEvenSlice from './helpers/get_even_slice'
import ProgressLogger from './helpers/progress_logger'

export default async function generateReport(configFile: string,
                                             destFileName: string,
                                             worker: number,
                                             workerCount: number) {
  const config = new Config(configFile)
  const logger = config.logger === 'inline' ? new InlineLogger() : new SerialLogger()
  const reporter = config.reporter === 'csv' ? new CSVReporter(config) : new HTMLReporter(config)

  const report: ReportsList = {}

  logger.info('Launching Chrome')

  const runner = new Runner(config)
  await runner.start()

  process.on('SIGINT', async () => {
    logger.error('Interrupted', { persist: true })
    // Kill Chrome processes on interruption
    await runner.stop()
  })

  const urlSlice = getEvenSlice(config.urls, workerCount, worker)
  const progressLogger = new ProgressLogger(urlSlice, config.logger, logger)

  logger.info(`Starting processing ${urlSlice.length} URLs`)

  for (const url of urlSlice) {
    progressLogger.update(url)

    try {
      report[url] = await runner.runAudit(url)
    } catch (error) {
      logger.error(`Something went wrong for ${url}: ${error}`, { persist: true })
      report[url] = {}
    }
  }

  logger.info('Shutting down Chrome')
  await runner.stop()

  logger.info('Saving report')
  const reportFileName = reporter.write(report, `${destFileName}.${reporter.ext}`)

  logger.info(`Report saved to ${reportFileName}`, { persist: true })
}
