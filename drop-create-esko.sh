#!/bin/bash

. setenvs.bash

mongo ontrail dropdb.js
lein run :import esko esko esko.morko@iki.fi trainlog-long-ex2.html