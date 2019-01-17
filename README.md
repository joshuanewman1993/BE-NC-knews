# API Sever : BE2-NC-Knews App

## Northcoders News API Server

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisities:

`1) git clone - https://github.com/joshuanewman1993/BE2-NC-Knews.git`

`2) cd BE2-NC-Knews - Access the folder file`

`3) npm install - Install all dependencies needed`

## Running server in Development

To create a config file in order to connect to the database you will need to run the following command. This will create a knexfile file where you will need to input the manidtory information,

`npm run create:config`

Once you have done the knex file please run the following commands:

`npm create:db - This will create a SQL file which will allow you to connect to the database`

`npm run devseed:run - This will seed your database will the necessary data`

`npm run dev - This will start the server where you will be accessing the port on 9090`

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

-   Node
-   Express
-   Knex

## Contributing

-   Joshua Newman

## License

-   Northcoders

## Acknowledgements

-   Northcoders
-   FT Cohort28-Nov-2018
-   Mitch
-   All the northcoders tutors!
