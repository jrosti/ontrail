#!/bin/bash

lein uberjar
s3cmd put target/* s3://ontrail/dist
git push origin master