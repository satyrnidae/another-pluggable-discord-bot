# another-pluggable-discord-bot

This is another plugin-ready bot framework for Discord.  Nothing special, just wanted to write something overly complicated in TypeScript.

## Pre-Requisites

### Required

- Node.js v10.15 or higher (I recommend grabbing the current LTS release)
- Global install of TypeScript 3.7.5+ (install via npm)

## Optional

- Global install of ts-node (optional)
- GLobal install of ts-node-dev (in case you want to restart each time you build the files)
- Recommend using Visual Studio Code and using that for build / run

## Setting Up

To set up the development environment:

- Clone the repository via git
- Run `npm i` in your preferred command interpreter to install all dependencies
- Open the folder in Visual Studio Code (if desired)
- Copy `/config/config.init.json` to `/config/config.json` and edit the copied file to include your bot token / default config options.  _**DO NOT CHECK THIS FILE IN AFTER EDITING.**_ It is in the `.gitignore` file, but _make extra sure_ the config file containing your token doesn't fall into another person's hands.

Now you should be all set! Build with `tsc` to transpile to Javascript, and run with `npm run-script debug`.  If you're using Visual Studio Code, these commands can be executed with the keyboard shortcuts `Ctrl+Shift+B` and `F5` by default.

## Developing Modules

Heh, as a modular bot framework this is probably the most important part, but it is also definitely _not_ ready for prime-time.  Develop at your own risk; there is no way to build against a specific API version / release and no way to verify installed modules.  I'm slowly working up to this functionality though, once all core functionality is complete.
