import chalk from 'chalk'

export default class SerialLogger implements Logger {
  info(text: string, options = { persist: false }) {
    if (options.persist) {
      console.info(chalk.green(text))
    } else {
      console.info(text)
    }
  }

  error(text: string, options = { persist: false }) {
    console.info(chalk.red(text))
  }
}
