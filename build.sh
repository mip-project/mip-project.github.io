
set +e

# 压缩
echo "------zip to v2-----"

if [ -s newV3.zip ]; then
    rm -r newV3.zip
fi

cd v2
zip -r -q ../newV3.zip ./*
cd ..

echo "------上传bos-----"

edp bos newV3.zip bos://assets/mip2/zip

set -e
