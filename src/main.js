//
const fs = require('fs')
const inquirer = require('inquirer')
const symbols = require('log-symbols')
const download = require('download-git-repo')
const chalk = require('chalk')
const ora = require('ora')
const program = require('commander')

const inquirerList = require('./utils/inquirerList.js')
const { rewriteFile } = require('./utils/rewriteFile.js')

program
  .version(require('../package.json').version, '-v, --version')
  .command('init <name>')
  .action((name) => {
    if (!fs.existsSync(name)) {
      inquirer.prompt(inquirerList.questionList).then((answers) => {
        console.log(answers)
        // start to download
        const spinner = ora('downloading template...')
        spinner.start()
        const downloadPath = `direct:https://github.com/hhcol620/react_antd_scss_mobile.git#master`
        download(downloadPath, name, { clone: true }, (err) => {
          if (err) {
            spinner.fail()
            console.error(
              symbols.error,
              chalk.red(
                `${err}download template fail,please check your network connection and try again`
              )
            )
            process.exit(1)
          }
          spinner.succeed()
          const meta = {
            name,
            description: answers.description,
            author: answers.author
          }
          const filePath = `${name}/package.json`
          rewriteFile(filePath, meta)
        })
      })
    } else {
      // 错误提示项目已存在，避免覆盖原有项目
      console.error(symbols.error, chalk.red('project had exist'))
    }
  })

// 必须在调用 .parse() 之前
program.on('--help', () => {
  console.log('')
  console.log('Example call:')
  console.log('  $ custom-help --help')
})

program.parse(process.argv)