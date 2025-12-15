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
	cmd.exe /C start "" powershell -NoExit -Command "$$host.UI.RawUI.WindowTitle = 'SERVER'; npm --prefix ./server run dev"
else
	gnome-terminal -- bash -c "npm --prefix ./server run dev; exec bash" || \
	osascript -e 'tell app "Terminal" to do script \"npm --prefix ./server run dev\"'
endif

# --- Run Client ---
client:
ifeq ($(OS),Windows_NT)
	cmd.exe /C start "" powershell -NoExit -Command "$$host.UI.RawUI.WindowTitle = 'CLIENT'; npm --prefix ./client run dev"
else
	gnome-terminal -- bash -c "npm --prefix ./client run dev; exec bash" || \
	osascript -e 'tell app "Terminal" to do script \"npm --prefix ./client run dev\"'
endif

# --- Run Both ---
start: 
	$(MAKE) server 
	$(MAKE) client

# --- Stop Both ---
stop:
ifeq ($(OS),Windows_NT)
	-@taskkill /F /IM node.exe >nul 2>&1
	-@taskkill /F /IM node.exe >nul 2>&1
	-@taskkill /FI "WINDOWTITLE eq SERVER*"
	-@taskkill /FI "WINDOWTITLE eq CLIENT*"
else
	-pkill -f "npm --prefix ./server run dev"
	-pkill -f "npm --prefix ./client run dev"
endif
