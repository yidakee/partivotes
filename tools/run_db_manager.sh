#!/bin/bash
# Script to run the PartiVotes Database Manager with proper environment setup

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the absolute path of the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
VENV_DIR="$SCRIPT_DIR/venv"

echo -e "${BLUE}====================================${NC}"
echo -e "${BLUE}  PartiVotes Database Manager      ${NC}"
echo -e "${BLUE}====================================${NC}"

# Check if virtual environment exists
if [ ! -d "$VENV_DIR" ]; then
    echo -e "${YELLOW}Virtual environment not found. Creating one...${NC}"
    
    # Check if python3 is installed
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}Error: Python 3 is not installed. Please install Python 3 and try again.${NC}"
        exit 1
    fi
    
    # Create virtual environment
    python3 -m venv "$VENV_DIR"
    
    if [ ! -d "$VENV_DIR" ]; then
        echo -e "${RED}Error: Failed to create virtual environment. Please check your Python installation.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Virtual environment created successfully.${NC}"
    
    # Activate the virtual environment
    source "$VENV_DIR/bin/activate"
    
    # Install required packages
    echo -e "${YELLOW}Installing required packages...${NC}"
    pip install -q pymongo python-dotenv tabulate
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to install required packages.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Required packages installed successfully.${NC}"
else
    # Activate the virtual environment
    source "$VENV_DIR/bin/activate"
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to activate virtual environment.${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Virtual environment activated.${NC}"
fi

# Check if .env file exists
ENV_FILE="$PROJECT_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Warning: .env file not found. MongoDB connection may fail.${NC}"
    echo -e "${YELLOW}Creating a basic .env file with default settings...${NC}"
    
    # Create a basic .env file
    cat > "$ENV_FILE" << EOF
# MongoDB Connection Settings
MONGODB_URI=mongodb://localhost:27017/partivotes
MONGODB_USER=
MONGODB_PASS=
EOF
    
    echo -e "${GREEN}.env file created with default settings.${NC}"
    echo -e "${YELLOW}Please edit $ENV_FILE to set your MongoDB credentials if needed.${NC}"
fi

# Change to the project directory
cd "$PROJECT_DIR"

echo -e "${GREEN}Starting PartiVotes Database Manager...${NC}"
echo -e "${YELLOW}Press Ctrl+C to exit at any time.${NC}"
echo ""

# Run the database manager in interactive mode
python "$SCRIPT_DIR/db_manager.py" interactive

# Capture exit code
EXIT_CODE=$?

# Deactivate the virtual environment when done
deactivate

# Check if the script exited with an error
if [ $EXIT_CODE -ne 0 ]; then
    echo -e "${RED}Database Manager exited with an error (code: $EXIT_CODE).${NC}"
    echo -e "${YELLOW}If you're experiencing issues, please check your MongoDB connection settings in the .env file.${NC}"
else
    echo -e "${GREEN}Database Manager closed successfully.${NC}"
fi

exit $EXIT_CODE
