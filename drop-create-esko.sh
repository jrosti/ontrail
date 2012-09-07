#!/bin/bash

. setenvs.bash

mongo ontrail dropdb.js
lein run :import Esko Esko ja.ri.ros.ti@gmail.com true trainlog-long-ex2.html
lein run :import Urpo Urpo urpo@ante.ro false geo.html