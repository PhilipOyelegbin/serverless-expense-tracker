#!/bin/bash

set -e

echo ">>> Starting serverless offline..."

cd packages/backend

serverless offline start