#!/bin/bash

. setenvs.bash

mongo ontrail remove-esko.js

lein run :create-user Esko Esko nomail@com false 
lein run :import Esko trainlog-long-ex2.html
