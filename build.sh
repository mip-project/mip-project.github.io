
set +e

# 压缩
echo "------zip to v2-----"

if [ -s newMIP2.zip ]; then
    rm -r newMIP2.zip
fi

cd v2
zip -r -q ../newMIP2.zip ./*
cd ..

echo "------上传bos-----"

edp bos newMIP2.zip bos://assets/mip2/zip

set -e
