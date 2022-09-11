#!/bin/sh

#  ci_post_xcodebuild.sh
#  Feeder-iOS
#
#  Created by Joe Diragi on 9/10/22.
#

cd /Volumes/workspace/ci/

# Find xcresult archive and unzip it
for f in *test-without-building*.xcresult.zip
do
  echo "Found xcresult: $f"
  unzip "$f"
  xcresult="${f%.*}"

done

if [ -n "${xcresult}" ]; then
    # Get ActionTestPlanRunSummaries ID
    echo "Getting StandardOutputAndStandardError.txt ID..."
    FOUND=false
    RAW=false
    while graph= read -r line; do
      if [[ $FOUND == true ]]; then
        if [[ $RAW == true ]]; then
          SOEID=${line:6}
          echo "Found: $SOEID"
          break
        else
          RAW=true
        fi
      fi
      if [[ $line == *"StandardOutputAndStandardError.txt"* ]]; then
        FOUND=true
      fi
    done <<< $(xcrun xcresulttool graph --path "$xcresult")
else
    echo "Xcresult file not found. Sending debug info to your account..."
    touch tree.log
    echo "Date: $(date +%m.%d.%y-%H:%M:%S)" >> tree.log
    echo "PWD: $(PWD)"
    while tree= read -r line; do
      echo "$line" >> tree.log
    done <<< $(find /Volumes/ -print | sed -e "s;[^/]*/;|____;g;s;____|; |;g")
    exit 1
fi

if [ -n "${SOEID}" ]; then
  # Get export data
  tests=0
  fails=0
  while out= read -r line; do
    if [[ $line == *"Executed "*" test"* ]]; then
      echo "Found line: "$line
      [[ $line =~ 'Executed ([^\s]+) test(.+)with ([^\s]+) failures' ]]
      tests=$((tests+$match[1]))
      fails=$((fails+$match[3]))
    fi
  done <<< $(xcrun xcresulttool get --path "$xcresult" --format raw --id "$SOEID")
else
  echo "Couldn't find StandardOutputAndStandardError Id"
  touch xcresult-graph.log
  echo "Date: $(date +%m.%d.%y-%H:%M:%S)" >> tree.log
  echo "PWD: $(PWD)"
  while graph= read -r line; do
    echo "$line" >> xcresult-graph.log
  done <<< $(xcrun xcresulttool graph --path "$xcresult")
  exit 1
fi

if [[ -n "${XCCBADGE_USERNAME}" && -n "${XCCBADGE_PROJECT}" ]]; then
  if [ $tests > 0 ]; then
    ## TODO: Get auth token from server using xcode secure env
    
    # Send it to the server
    BADGER_URL=https://xccbadge.deno.dev/$XCCBADGE_USERNAME/$XCCBADGE_PROJECT/builder/tests-passing
    RESPONSE=$(curl --write-out '%{http_code}' --silent --output /dev/null -X POST $BADGER_URL -d "{ \"total\": ${tests}, \"failing\": ${fails} }")

    if [[ $RESPONSE == 200 ]]; then
      echo "Sent tests to server. Thanks for using XCCBadger <3"
      exit 0
    else
      echo "Couldn't send tests to server. Check your credentials."
      echo "Got error from server: ${RESPONSE}"
      exit 1
    fi
  else
    echo "Didn't find any tests. Either none were run or something went wrong."
    exit 1
  fi
else
  echo "Missing XCCBADGE_USERNAME and/or XCCBADGE_PROJECT environment variables"
  exit 1
fi
