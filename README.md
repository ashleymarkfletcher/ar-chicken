# ar-chicken

AR chicken game created in Facebook's AR Studio.
This is a proof of concept for making basic AR games.

# Requirements

* [node.js](https://nodejs.org/en/)/[npm](https://www.npmjs.com/)

* [AR Studio](https://developers.facebook.com/products/ar-studio)

# Install

Inside scripts folder run

```bash
$ npm install
```

# Running

To run the project just run from AR Studio like you would any other project.

[Webpack](https://webpack.js.org/) used to transpile, bundle and minify the code.
The main reasons for this are that es6 features don't run on Android for AR-Studio and you can only import one script into the assets.

# Running - development

When running in development mode, Webpack watches for changes and compiles the code in the src to dist folder

```bash
$ npm run dev
```

# Running - production

Running in production is the same as dev but without the watching for file changes

```bash
$ npm run build
```

# Notes

The webpack config uses hard coded externals to keep the require statements in tact. These imports are required at run time by AR Studio so they must remain.

The Util file has some useful functions for dealing with common tasks in AR Studio, check it out!

# ToDo

* [ ] fix models going through text
* [ ] improve hit detection
* [ ] design the beginning and end screen
* [ ] add levels to gameplay

# Credits

* Chicken model \* S. Paul Michael - https://poly.google.com/view/3VTYpNYv7po
