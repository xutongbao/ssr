module.exports = {
  apps: [
    {
      name: `${process.env.name}`,
      // exec_mode: 'cluster',
      //工作线程数量,如果给定的数字为0，PM2则会根据你CPU核心的数量来生成对应的工作线程。
      // instances: 2, 
      script: './node_modules/next/dist/bin/next',
      args: `start -p ${process.env.PORT}`
    }
  ]
}
