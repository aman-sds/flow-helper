#!/bin/bash
function readinput() {
  local CLEAN_ARGS=""
  while [[ $# -gt 0 ]]; do
    local i="$1"
    case "$i" in
      "-i")
        if read -i "default" 2>/dev/null <<< "test"; then
          CLEAN_ARGS="$CLEAN_ARGS -i \"$2\""
        fi
        shift
        shift
        ;;
      "-p")
        CLEAN_ARGS="$CLEAN_ARGS -p \"$2\""
        shift
        shift
        ;;
      *)
        CLEAN_ARGS="$CLEAN_ARGS $1"
        shift
        ;;
    esac
  done
  eval read $CLEAN_ARGS
}

if [[ $1 == 'FE' ]]
then
    cp -rf ./node_modules/@axmit/flow-helper/scripts/FE/boilerplate/. ./
elif [[ $1 == 'BE' ]]
then
    cp -rf ./node_modules/@axmit/flow-helper/scripts/BE/boilerplate/. ./
else
    echo "Please set FE or BE as a parameter to create"
    exit 0
fi

# yarn init
readinput -e -p "Proxy for API (example: https://dev.your_project.axmit.com/): " PROXY
sed -i "s#YOUR_PROXY#${PROXY}#g" package.json
yarn sync $1
yarn
yarn start

