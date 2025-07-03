#!/bin/sh
docker buildx build \
  --platform linux/amd64 \
  -t igorthefox/swift-take-medicine:latest \
  --push \
  .