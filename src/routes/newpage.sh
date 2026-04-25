#!/bin/bash

# 检查当前目录是否是 routes
if [ "$(basename "$PWD")" = "routes" ]; then
    # 检查参数1是否存在
    if [ $# -ge 1 ] && [ -n "$1" ]; then
        mkdir -v -p "$1"
        touch "$1/+page.svelte"
    fi
fi
