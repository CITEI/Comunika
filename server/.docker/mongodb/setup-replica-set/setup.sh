#!/bin/bash

echo ******************************************************
echo Starting the replica set
echo ******************************************************

sleep 20 | echo Sleeping
mongo "mongodb://mongo1:${DB_PORT:-27017}" replicaSet.js