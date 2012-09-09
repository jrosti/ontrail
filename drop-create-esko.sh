#!/bin/bash

. setenvs.bash

mongo ontrail remove-esko.js

lein run :create-user Esko Esko ja.ri.ros.ti@gmail.com true 
lein run :create-user Urpo Urpo urpo@ante.ro false

lein run :import Esko trainlog-long-ex2.html
lein run :import false geo.html