#!/bin/bash

# Parse command line options
while [[ $# -gt 0 ]]; do
    key="$1"

    case $key in
        -v|--version)
            input="$2"
            shift
            ;;
        -h|--help)
            echo "Usage: download.bash [OPTIONS]"
            echo "Options:"
            echo "  -v, --version    Specify the version"
            echo "  -h, --help       Show this help message"
            exit 0
            ;;
        *)
            echo "Invalid option: $key" >&2
            exit 1
            ;;
    esac
    shift
done

# Check if version is provided
if [[ -z $input ]]; then
    echo "Version is required. Please specify the version using -v or --version option." >&2
    exit 1
fi

# Strip leading "v" from input if it starts with "v"
if [[ $input == v* ]]; then
    input="${input#v}"
fi

# Echo the input variable
curl -L "https://github.com/pocketbase/pocketbase/releases/download/v${input}/pocketbase_${input}_linux_amd64.zip" -o pocketbase.zip && unzip pocketbase.zip && rm pocketbase.zip
