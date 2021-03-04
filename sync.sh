#!/bin/bash
cp -rf ./node_modules/@axmit/flow-helper/scripts/common/. ./

if [[ $1 == 'FE' ]]
then
    cp -rf ./node_modules/@axmit/flow-helper/scripts/FE/infrastructure/. ./
elif [[ $1 == 'BE' ]]
then
    cp -rf ./node_modules/@axmit/flow-helper/scripts/BE/infrastructure/. ./
    mv ./node_modules/@axmit/flow-helper/scripts/BE/npmignore .npmignore
else
    echo "Please set FE or BE as a parameter to full sync"
fi



