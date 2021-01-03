FROM buildkite/puppeteer:latest

COPY ./package.json .
COPY yarn.lock .
COPY ./index.js .

RUN yarn && \
  mkdir /input && \
  mkdir /output

CMD ["./index.js", "--inputDir=./input", "--outputDir=./output", "--exts=png,svg"]