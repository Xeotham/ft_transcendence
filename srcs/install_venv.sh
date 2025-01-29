#!/bin/bash

# Check if requirements.txt exists
if [ ! -f requirements.txt ]; then
  echo "requirements.txt not found!"
  exit 1
fi

if [ -d .venv ]; then
  echo ".venv already exists!"
  exit 0
fi

# Create a virtual environment named 'venv'
python3 -m venv .venv

# Activate the virtual environment
source .venv/bin/activate

# Install the dependencies from requirements.txt
pip install -r requirements.txt

# Deactivate the virtual environment
deactivate

echo "Virtual environment created and dependencies installed successfully."
