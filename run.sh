#!/bin/bash

# https://stackoverflow.com/questions/12264238/restart-process-on-file-change-in-linux
# XXX fix sometimes on save restart twice

sigint_handler()
{
  kill $PID
  exit
} 

trap sigint_handler SIGINT

while true; do
#  echo ""
#  echo ""
#  echo ""
#  echo ""
#  echo ">>>> tail of index.js"
#  tail index.js
  echo run $@
  $@ &
  PID=$!
  inotifywait -e modify -e move -e create -e delete -e attrib --recursive --include '\.js$|\.html$|\.css$|\.sh$' `pwd`
  # TODO handle if PID
  kill $PID
  #sleep 4
done

