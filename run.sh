#!/bin/bash

# 查询名为newsnow的容器（包含正在运行和已停止的）
container_info=$(docker ps -a | grep newsnow)

# 判断是否找到对应的容器
if [ -n "$container_info" ]; then
    # 获取容器ID（假设容器名称唯一，提取第一列作为容器ID）
    container_id=$(echo $container_info | awk '{print $1}')
    # 停止容器
    docker stop $container_id
    # 删除容器
    docker rm $container_id
    echo "已成功移除newsnow容器。"
else
    echo "未找到名为newsnow的容器，无需进行移除操作。"
fi
DOCKER_IMAGE_NAME_VERSION="v1"
if [ -n "$1" ] ;then
  DOCKER_IMAGE_NAME_VERSION="$1"
fi
docker run  -d -p 11007:4444 --name newsnow aolifu/newsnow:$DOCKER_IMAGE_NAME_VERSION