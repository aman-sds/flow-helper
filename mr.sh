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

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
PREV_COMMENT=$(git log -1 | grep -o "[A-Z]: [A-Za-z ]*[^ #]" | cut -c 4-)
TARGET_BRANCH="dev"
STATE="PR"

readinput -e -p "Comment: " -i "${PREV_COMMENT}" COMMENT
readinput -e -p "Spent time (30m|h): " SPENT
readinput -e -p "Work type (FEATURE, FIX, REFACTOR): " -i "FEATURE" TYPE
readinput -e -p "State (IP - In progress, PR - Peer review): " -i "${STATE}" STATE
readinput -e -p "Branch: " -i ${CURRENT_BRANCH} BRANCH
readinput -e -p "MR title (fill if need create a new request or update an exist): " MR_TITLE
readinput -e -p "Target branch: " -i ${TARGET_BRANCH} TARGET_BRANCH

if [[ ${TARGET_BRANCH} != ${CURRENT_BRANCH} ]] && [[ ${BRANCH} != ${CURRENT_BRANCH} ]]
then
    git pull
    git checkout ${TARGET_BRANCH}
fi

if [[ ${CURRENT_BRANCH} != ${BRANCH} ]]
then
    git checkout -b ${BRANCH} || git checkout ${BRANCH}
fi

if [[ ${STATE} == "IP" ]]
then
    STATE='In progress'
else
    STATE='Peer review'
fi

git commit -a -m"$TYPE: $COMMENT #$BRANCH State ${STATE} work Development $SPENT"

if [[ -z ${MR_TITLE} ]]
then
    git push --set-upstream origin ${BRANCH}
else
    git push -o merge_request.create -o merge_request.title="#$BRANCH: $MR_TITLE" -o merge_request.target=${TARGET_BRANCH} --set-upstream origin ${BRANCH}
fi

# Auto sync with target branch
#if [[${TARGET_BRANCH} != ${BRANCH}]]
#then
#    git pull origin ${TARGET_BRANCH}
#    git push
#fi
