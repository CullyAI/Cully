# Setup script for macOS/Linux

# Remove existing virtual environment if needed
if [ -d "venv" ]; then
    echo "🗑️  Removing existing virtual environment..."
    rm -rf venv
fi

# Create new virtual environment
echo "🚀 Creating a new virtual environment..."
python3 -m venv venv


# Activate virtual environment
source venv/bin/activate

# Install Homebrew if not installed
if ! command -v brew &> /dev/null; then
    echo "🍺 Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    eval "$(/opt/homebrew/bin/brew shellenv)"
fi

# Install PostgreSQL dependencies
echo "📦 Installing PostgreSQL and libpq..."
brew install postgresql libpq
brew link --force libpq

# Install required dependencies
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Virtual environment is set up and dependencies are installed!"