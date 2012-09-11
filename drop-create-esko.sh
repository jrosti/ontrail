#!/bin/bash

. setenvs.bash

mongo ontrail remove-esko.js

lein run :create-user Peppi null ja.ri.ros.ti@gmail.com true 
lein run :create-user Urpo Urpo urpo@ante.ro false

lein run :import Peppi trainlog-long-ex2.html
lein run :import Urpo geo.html