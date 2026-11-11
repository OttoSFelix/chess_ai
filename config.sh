#!/bin/bash
poetry -C tira-ai-local/background-service install
poetry -C tira-ai-local/background-service run invoke build
npm approve-scripts --all
npm install --prefix tira-ai-local/app
echo "\nConfiguration complete!"
