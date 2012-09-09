#!/bin/bash

. setenvs.bash

./drop-create-esko.sh

mongo ontrail create-index.js

lein run
