const axios = require('axios')
const { getBaseURL, getJenkinsProjectName } = require('../util/tools')

const { host, port, baseURL } = getBaseURL()

//项目名称
const name = '服务端渲染'

// 发邮件
const email = async ({ runData, recordData }) => {
  const { resultPort } = runData
  const emailData = {
    type: 'jenkins',
    title: '构建成功-测试环境',
    name,
    gitRepositorieName: process.env.gitRepositorieName,
    jenkinsProjectName: getJenkinsProjectName({ cd: process.env.cd }),
    branch: process.env.branch,
    url: `${host}:${resultPort}`,
    hashUrl: `${host}/${recordData.info.hash}/ssr`,
    remarks: '自动，服务端渲染'
  }
  await axios
    .post(`${baseURL}/api/log/email`, {
      ...emailData
    })
    .then((res) => {
      console.log('E-Mail sent successfully!')
    })
    .catch((error) => {
      console.error(error)
    })
}

// 添加构建记录
const handleAddRecord = async ({ runData }) => {
  const { resultPort } = runData
  const dataItem = {
    name,
    gitRepositorieName: process.env.gitRepositorieName,
    jenkinsProjectName: getJenkinsProjectName({ cd: process.env.cd }),
    branch: process.env.branch,
    projectType: 'ssr',
    url: `${host}:${resultPort}/ssr`,
    remarks: '自动，服务端渲染'
  }
  return await axios
    .post(`${baseURL}/api/jenkins/add`, {
      dataItem
    })
    .then((res) => {
      console.log('Record added successfully!')
      return res.data.data
    })
    .catch((error) => {
      console.error(error)
    })
}

//运行项目
const run = async () => {
  return await axios
    .post(`${baseURL}/api/jenkins/run`, {
      gitRepositorieName: process.env.gitRepositorieName,
      branch: process.env.branch,
      isSsr: true
    })
    .then((res) => {
      if (res.data.state === 1) {
        console.log('Start successful!')
        return res.data.data
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

setTimeout(async () => {
  const runData = await run()
  console.log('runData:', runData)
  const recordData = await handleAddRecord({ runData })
  await email({ runData, recordData })
}, 3000)
