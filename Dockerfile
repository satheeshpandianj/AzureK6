FROM loadimpact/k6:latest

ENV STAGES=5s:1,1m:3,10s:0 \
    SCRIPT=getConfiguration.js \
    PROJECT=Commerce \
    APINAME=GetConfiguration \
    ENVNAME=QA

COPY ./src /src

WORKDIR /src

# Override the entry point of the base k6 image
ENTRYPOINT []

CMD ["sh", "-c", "k6 run --stage $STAGES --out influxdb=http://104.40.213.24:8086/Volvo -e ENV=$ENVNAME -e PROJECT=$PROJECT -e APINAME=$APINAME $SCRIPT "]