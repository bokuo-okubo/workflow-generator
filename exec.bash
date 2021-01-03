# !/bin/bash

docker run --rm -it \
  -v "$(pwd)/bpmn:/input" \
  -v "$(pwd)/out:/output" \
  bko712/workflow-generator
