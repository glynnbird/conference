#!/bin/bash

# check that ccurl is installed
hash ccurl 2>/dev/null || { echo >&2 "Need 'ccurl' installed. Try 'sudo npm install -g ccurl'"; exit 1; }

echo "Creating the database"
ccurl -X PUT /conference

echo "Adding the quizes"
#ccurl -X POST -d @quizes.json /geoquiz/_bulk_docs

echo "Adding design docs"
#ccurl -X POST -d @design.json /geoquiz/_bulk_docs

