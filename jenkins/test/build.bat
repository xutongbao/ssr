@REM 安装依赖
call yarn
echo install done

@REM 设置git仓库名称
set gitRepositorieName=ssr

@REM 复制编译好的的代码到新目录
xcopy %cd% \temp\%gitRepositorieName%\%branch:/=\%\ /Y /E /exclude:exclude.txt

@REM 设置环境变量并执行js脚本发送邮件通知、添加构建记录
set computername=%computername%
set cd=%cd%
call node .\jenkins\test\buildDone
echo test success

