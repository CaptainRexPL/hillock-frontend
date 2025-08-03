# Hillock frontend

A website for my API that I'm using in my other projects

# IMPORTANT NOTE
At the time of me writing this, the website it not being hosted anywhere (which is going to change soon). But once this happens, you should know that before you create an account, you first need to create an invite code for yourself (please read ["usage of the production version" here](https://github.com/CaptainRexPL/hillock-public) for more info).

Why would you possibly need to do that? Well, initially Hillock was meant to be private with very restricted access (hence the invite codes). But since I made one public instance, the easiest solution was to make the endpoint accessible by anyone.

## Authors
- CaptainRexPL - main creator
- DarkTPL - the author of the current favicon

## Requirements

* Node.js (>= 18.x)
* npm (>= 9.x) or yarn
* optional: personal instance of Hillock API

## Setting up

### Clone the repository
```bash
git clone https://github.com/CaptainRexPL/hillock-frontend
cd hillock-frontend
```

### Install dependencies
Make sure you have Node.js ≥ 18 installed.

Then install project dependencies:
```bash
npm install
```

### Start the application
If you want to start it in development mode, use:
```bash
npm run dev
```
Otherwise, use this command:
```bash
npm run build
```

## TODO
* add a way to reset your password
* add a proper way to set things up with an env file (currently everything is hard-coded lol)
* add multiple new views to fully use all Hillock features
* seriously change the visual design of the website

