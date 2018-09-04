
set +e

# 安装包
echo "-----npm install------"
npm install

# 编译
echo "-----pull doc------"
cd ../mip2
git pull origin master

# 编译
echo "-----build------"
cd ../mip-project.github.io
npm run build:css
npm run build

# 杀进程
echo "-----kill------"
kill `lsof -t -i:9527`

# 压缩
# echo "------zip to v2-----"
# rm -r newV2.zip
# cd v2
# zip -r ../newV2.zip ./*
# cd ..

# bec 云更新
echo "------zip to v2-----"
npm run cp:bce
cd ../mip_online/bec-www.mipengine.org
git add .
git commit -am "refresh v2 new"
git pull origin master
git push origin master

echo "------ server -----"
edp webserver

set -e
