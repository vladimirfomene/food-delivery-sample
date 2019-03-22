# Food Delivery Sample

## IDE And Tools

- This application does not use any build tools just Node.js and npm
- Use any text editor or IDE of your choice to play with the code.
- You will need to have a local MongoDB server to run this application.

## App Setup

- Clone this repository by executing `git clone https://github.com/vladimirfomene/food-delivery-sample.git` in your console.
- Enter the project directory with `cd food-delivery-sample`.
- Go to your terminal and start your Mongo database by executing the following command:
  ** On windows: `net start MongoDB`
  ** With OS X: `brew services start mongodb-community@<YOUR-VERSION-NUMBER>`, replace the text in angle brackets.
  \*\* On Linux: `sudo service mongod start`
- Run `npm install` to install all the project's dependencies.
- Add your email service provider's API keys and your Cloudinary URL to the .env file in the project's root directory.

## Running the app.

- Run the app by executing `node keystone` or `npm start` in the project directory.

## Testing the application

- Visit `http://localhost:3000` to log in or sign up so as to interact with the app.
