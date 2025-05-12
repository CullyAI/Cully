# 🚀 Run Cully Locally
Once you have your expo account configured with an apple developer account, follow these steps:
## 1. Set up the backend environment
If you are on Linux or MacOS:
`./backend/setup.sh`
If you are on Windows:
`backend\setup.bat`
## 2. Start the backend server
`./backend/run.py`
## 3. Launch the app on your device
`eas build --platform ios --profile development`
After the build completes, scan the QR code using your iOS device to install and test the app
