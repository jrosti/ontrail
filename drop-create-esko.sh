#!/bin/bash

. setenvs.bash

mongo ontrail dropdb.js
lein run :import esko trainlog-long-ex2.html