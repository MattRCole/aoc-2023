#! /bin/sh

dayToRun="$1"
partToRun="0${2#0}"

if [ $dayToRun -lt '10' ]
then
    dayToRun="0${dayToRun#0}"
fi

npx nodemon --watch "./$dayToRun" --ext js,txt --exec "clear;printf '\e[3J'; node ./${dayToRun}/script-${partToRun}.js"
