# !/bin/bash

docker run --rm -it \
  -v "$(pwd)/bpmn:/app/input" \
  -v "$(pwd)/out:/app/output" \
  bko712/workflow-generator
