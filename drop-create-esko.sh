#!/bin/bash

. setenvs.bash

mongo ontrail dropdb.js
lein run :import esko esko ja.ri.ros.ti@gmail.com trainlog-long-ex2.html