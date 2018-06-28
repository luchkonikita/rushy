#!/usr/bin/env node

import * as optimist from 'optimist'
import generateReport from './generate_report'
import { existsSync } from 'fs'

const argv = optimist
  .usage('$0 --config=[file] --worker=[num] --worker-count=[num]')
  .demand(['config'])
  .default('worker', 0)
  .default('worker-count', 1)
  .check(options => {
    if (!existsSync(options.config)) {
      throw new Error(`Can't load config from ${options.config}`)
    }

    if (options['worker-count'] <= 0) {
      throw new Error('--worker-count must be >= 1')
    }

    if (options.worker < 0 || options.worker >= options['worker-count']) {
      throw new Error('--worker must be < --worker-count && > 0')
    }

    return true
  })
  .argv

const configFileName = argv.config
const workerCount = argv['worker-count']
const worker = argv.worker
const destFileName = (workerCount > 1 ? `worker_${worker}_` : '') + (new Date()).toISOString()

generateReport(configFileName, destFileName, worker, workerCount)
  .then(() => process.exit())
