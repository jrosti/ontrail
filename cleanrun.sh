#!/bin/bash

. setenvs.bash

lein clean

./drop-create-esko.sh

mongo ontrail create-index.js

lein run
