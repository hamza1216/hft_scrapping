#!/bin/bash

find /opt/legacyresearch-bot-api/bot-api-* -maxdepth 0 -type d -printf '%T+ %p\n' | sort | awk '{print $2}' | head -1 | sudo xargs rm -rf 
