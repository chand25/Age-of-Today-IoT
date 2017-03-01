BIN := ./node_modules/.bin/
.PHONY: build

build:
	@echo "Building script.js with Browserify"
	$(BIN)browserify -r cylon-mip script.js > browser.js
