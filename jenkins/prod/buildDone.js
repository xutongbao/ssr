const axios = require('axios')
const { getBaseURL, getJenkinsProjectName } = require('../util/tools')

const { host, baseURL } = getBaseURL()

//项目名称
const name = '服务端渲染'

const port = 82

// 发邮件
const email = async ({ recordData }) => {
  const emailData = {
    type: 'jenkins',
    title: '构建成功-线上环境',
    name,
    gitRepositorieName: process.env.gitRepositorieName,
    jenkinsProjectName: getJenkinsProjectName({ cd: process.env.cd }),
    branch: process.env.branch,
    url: `${host}:${port}`,
    hashUrl: `${host}/${recordData.info.hash}`,
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
const handleAddRecord = async () => {
  const dataItem = {
    name,
    gitRepositorieName: process.env.gitRepositorieName,
    jenkinsProjectName: getJenkinsProjectName({ cd: process.env.cd }),
    branch: process.env.branch,
    projectType: 'node',
    url: `${host}:${port}`,
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

setTimeout(async () => {
  const recordData = await handleAddRecord()
  await email({ recordData })
}, 3000)
