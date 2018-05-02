const lighthouse = require('lighthouse')

function getLighthouseReport(url: string, opts: any, config: any): any {
	return lighthouse(url, opts, config)
}

export { getLighthouseReport }
