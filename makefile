.PHONY: env server client start stop

# --- Build Env ---
env:
ifeq ($(OS),Windows_NT)
	cd server && npm install && cd ..
	cd client && npm install && cd ..
else
	cd server && npm install && cd ..
	cd client && npm install && cd ..
endif

# --- Run Server ---
server:
ifeq ($(OS),Windows_NT)
	cmd.exe /C start "" powershell -NoExit -Command "$$host.UI.RawUI.WindowTitle = 'SERVER'; npm --prefix ./server start"
else
	gnome-terminal -- bash -c "server/.venv/bin/python server/src/app.py; exec bash" || \
	osascript -e 'tell app "Terminal" to do script \"npm --prefix ./server start\"'
endif

# --- Run Client ---
client:
ifeq ($(OS),Windows_NT)
	cmd.exe /C start "" powershell -NoExit -Command "$$host.UI.RawUI.WindowTitle = 'CLIENT'; npm --prefix ./client start"
else
	gnome-terminal -- bash -c "npm --prefix ./client start; exec bash" || \
	osascript -e 'tell app "Terminal" to do script \"npm --prefix ./client start\"'
endif

# --- Run Both ---
start: 
	$(MAKE) server 
	$(MAKE) client

# --- Stop Both ---
stop:
ifeq ($(OS),Windows_NT)
	-@taskkill /F /IM python.exe >nul 2>&1
	-@taskkill /F /IM node.exe >nul 2>&1
	-@taskkill /FI "WINDOWTITLE eq SERVER*"
	-@taskkill /FI "WINDOWTITLE eq CLIENT*"
else
	-pkill -f "python server/src/app.py"
	-pkill -f "npm --prefix ./client start"
endif
