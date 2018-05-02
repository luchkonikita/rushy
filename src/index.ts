#!/usr/bin/env node

import * as optimist from 'optimist'
import generateReport from './generate_report'

const configFileName = optimist.argv.config
const destFileName = `${(new Date()).toISOString()}.csv`

generateReport(configFileName, destFileName)
  .then(() => process.exit())
