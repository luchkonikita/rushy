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
      }
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
  await generateReport('./test/config_all.json', 'report_all')
  const csv = fs.readFileSync('test/tmp/report_all.csv').toString()

  const expectedCsv = [
    // tslint:disable max-line-length
    'Page,Time to first byte,First meaningful paint,First interactive,Consistently interactive,Total byte weight,Speed index metric',
    'https://example.com,time-to-first-byte value,first-meaningful-paint value,first-interactive value,consistently-interactive value,total-byte-weight value,speed-index-metric value',
    ''
    // tslint:enable max-line-length
  ].join('\n')

  t.true(t.context.chromeStub.kill.called)
  t.is(csv, expectedCsv)
})

test.serial('generate report with skipped audits', async t => {
  await generateReport('./test/config_skipped.json', 'report_skipped')
  const csv = fs.readFileSync('test/tmp/report_skipped.csv').toString()

  const expectedCsv = [
    'Page,First meaningful paint,Total byte weight,Speed index metric',
    'https://example.com,first-meaningful-paint value,total-byte-weight value,speed-index-metric value',
    ''
  ].join('\n')

  t.is(csv, expectedCsv)
})

test.serial('generate report with html reporter', async t => {
  await generateReport('./test/config_html.json', 'report_html')
  const html = fs.readFileSync('test/tmp/report_html.html').toString()

  t.true(html.includes('<th>Time to first byte</th>'))
  t.true(html.includes('<td>time-to-first-byte value</td>'))
})
