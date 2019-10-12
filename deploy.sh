#!/bin/bash
docker build -t istepura/fibonator_client:latest  -t istepura/fibonator_client:$GIT_SHA -f ./client/Dockerfile ./client
docker build -t istepura/fibonator_api:latest -t istepura/fibonator_api:$GIT_SHA -f ./server/Dockerfile ./server
docker build -t istepura/fibonator_worker:latest -t istepura/fibonator_worker:$GIT_SHA -f ./worker/Dockerfile ./worker

docker push istepura/fibonator_client:latest
docker push istepura/fibonator_api:latest
docker push istepura/fibonator_worker:latest

docker push istepura/fibonator_client:$GIT_SHA
docker push istepura/fibonator_api:$GIT_SHA
docker push istepura/fibonator_worker:$GIT_SHA

kubectl apply -f k8s

kubectl set image deployments/server-deployment server=istepura/fibonator_api:$GIT_SHA
kubectl set image deployments/client-deployment client=istepura/fibonator_client:$GIT_SHA
kubectl set image deployments/worker-deployment worker=istepura/fibonator_worker:$GIT_SHA

