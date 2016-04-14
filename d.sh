#!/usr/bin/env bash
app="pan2influx"
if  docker ps | awk -v app="app" 'NR>1{  ($(NF) == app )  }'; then
    docker stop "$app" && docker rm -f "$app"
fi
docker build -t $app .
docker run -it -h $app --name $app $app
#docker logs $app
