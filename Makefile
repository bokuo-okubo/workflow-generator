.PHONY: build-image
build-image:
	docker build \
		-f docker_files/bin.Dockerfile \
		-t bko712/workflow-generator \
		.

.PHONY: push-image
push-image:
	docker push bko712/workflow-generator

.PHONY: run
run:
	bash exec.bash

.PHONY: all
all: build-image run push-image

.PHONY: build-pup
build-pup:
	docker build \
		-f docker_files/pup.Dockerfile  \
		-t bko712/pptr-jp \
		.

.PHONY: push-pup
push-pup:
	docker push bko712/pptr-jp

.PHONY: build-all
build-all: build-pup push-pup all