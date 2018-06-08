interface IAudit {
  name: string
  rawValue: number | boolean
}

interface IAuditReport {
  'time-to-first-byte'?: number
  'first-meaningful-paint'?: number
  'first-interactive'?: number
  'consistently-interactive'?: number
  'total-byte-weight'?: number
  'speed-index-metric'?: number
}

type ReportsList = { [index: string]: IAuditReport }

interface Reporter {
  write(report: ReportsList, destFileName: string): string
}
