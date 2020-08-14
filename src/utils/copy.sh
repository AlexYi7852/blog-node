#!/bin/sh
cd /Users/yiye/Desktop/node/blog-node/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log