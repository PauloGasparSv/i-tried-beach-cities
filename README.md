# Find All Beach cities that also have at least an Airport

Bottom line, I can't do it. But what i can do is search for all the airports in the world in wikipedia, catalog them and find out where they are located.

I can't do any more than that because when I tried to generate an GeoLocation api key from google it requested a payment method. And since I would have to share my apiKey and a bunch of reqs would be made, i don't think it is a good idea.

Sooooo, this code does that. I thought of looking for each one of the locations on google with some keyworkd like "beach" but i was not able to get any result from this.

So thats it. #sad

## Requirements

- Node.js v8.16.1^ (lts/carbon or higher)
- Npm
- Read and Write permissions on the folder
- Boa vontade

## How to run
Inside the projects folder, install alls dependencies with npm using
```sh
npm install
```

Then, you can choose to run by either using
```sh
node app.js
```

or

```sh
npm start
```

If required, run with the env variable NO_CACHE turned on to remove the .cache folder and download all the pages from scratch.
```sh
NO_CACHE=1 node app.js
```

## Git
This project was coded using git and i included the .git files and folders inside of it. So you can ` git log ` or whatever.

### Special thanks
Myself and spiderman