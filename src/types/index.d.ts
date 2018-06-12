interface IAudit {
  name: string
  rawValue: any
}

type IAuditReport = { [index: string]: any }

type ReportsList = { [index: string]: IAuditReport }

interface Reporter {
  write(report: ReportsList, destFileName: string): string
}
