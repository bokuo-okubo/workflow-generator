.PHONY: build-image
build-image:
	docker build . -t bko712/workflow-generator

.PHONY: push-image
push-image:
	docker push bko712/workflow-generator

.PHONY: run
run:
	bash exec.bash

.PHONY: all
all: build-image run
