#!/bin/bash

lein uberjar
s3cmd put target/ontrail-0.0.2-standalone.jar s3://ontrail/dist/
git push origin master
