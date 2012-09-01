#!/bin/bash
echo "Continually compiling less files in dir server"
PATH=$PATH:node_modules/less/bin
node_modules/less-watcher/bin/less-watcher -p "" -d resources/public