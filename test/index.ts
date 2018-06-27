import { test } from 'ava'
import * as fs from 'fs'
import * as sinon from 'sinon'
import * as chromeLauncher from 'chrome-launcher'
import * as lighthouse from '../src/lighthouse'
import generateReport from '../src/generate_report'

test.beforeEach(t => {
  t.context.chromeStub = {
    port: 9222,
    kill: sinon.spy()
  }

  t.context.lighthouseResultsStub = {
    reportCategories: [
      { score: 42 }
    ],
    audits: {
      'time-to-first-byte': {
        rawValue: 'time-to-first-byte value'
      },
      'first-meaningful-paint': {
        rawValue: 'first-meaningful-paint value'
      },
      'first-interactive': {
        rawValue: 'first-interactive value'
      },
      'consistently-interactive': {
        rawValue: 'consistently-interactive value'
      },
      'total-byte-weight': {
        rawValue: 'total-byte-weight value'
      },
      'speed-index-metric': {
        rawValue: 'speed-index-metric value'
      },
      'very-custom-audit': {
        rawValue: 'very-custom-audit value'
      }
    },
    timing: {
      total: 100.2
    }
  }

  t.context.chromeLaunchStub = sinon.stub(chromeLauncher, 'launch')
    .returns(Promise.resolve(t.context.chromeStub))
  t.context.lighthouseLaunchStub = sinon.stub(lighthouse, 'getLighthouseReport')
    .returns(Promise.resolve(t.context.lighthouseResultsStub))
})

test.afterEach(t => {
  t.context.chromeLaunchStub.restore()
  t.context.lighthouseLaunchStub.restore()
})

test.serial('generate report', async t => {
  await generateReport('./test/config_all.json', 'report_all', 0, 1)
  const csv = fs.readFileSync('test/tmp/report_all.csv').toString()

  const expectedCsv = [
    // tslint:disable max-line-length
    'Page,Score,Time to First Byte,First Meaningful Paint,First Interactive,Consistently Interactive,Total Byte Weight,Speed Index,Total Time',
    'https://example.com,42,time-to-first-byte value,first-meaningful-paint value,first-interactive value,consistently-interactive value,total-byte-weight value,speed-index-metric value,100',
    ''
    // tslint:enable max-line-length
  ].join('\n')

  t.true(t.context.chromeStub.kill.called)
  t.is(csv, expectedCsv)
})

test.serial('generate report with custom query', async t => {
  await generateReport('./test/config_custom_query.json', 'report_custom_query', 0, 1)
  const csv = fs.readFileSync('test/tmp/report_custom_query.csv').toString()

  const expectedCsv = [
    'Page,Score,Custom Audit',
    'https://example.com,42,very-custom-audit value',
    ''
  ].join('\n')

  t.is(csv, expectedCsv)
})

test.serial('generate report with html reporter', async t => {
  await generateReport('./test/config_html.json', 'report_html', 0, 1)
  const html = fs.readFileSync('test/tmp/report_html.html').toString()

  t.true(html.includes('<th>Time to First Byte</th>'))
  t.true(html.includes('<td>time-to-first-byte value</td>'))
})
