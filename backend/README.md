# Brand safety backend API

# Install package
Run `npm install`

# Rename file `.env.example` to `.env`

# Run gen api docs
Run `npm run start-gendoc`

# Run api
Run `npm run start`

# DB Migrations example
Run `cd backend/modules/core`

Run `npx sequelize-cli db:migrate --config=../../configs/config.json`

## Migration Skeleton
Run `npx sequelize-cli migration:generate --name migration-skeleton`

## Create Model

`npx sequelize-cli model:generate --name User --attributes realName:string,address:string --models-path=../models`

# Running seed all
`npx sequelize-cli db:seed:all --config=../../configs/config.json`

# Run jwt keygen
`npm run keygen-jwt`

# Run keygen
`npm run keygen-rsa`
#### private & public keys will be stored in dir `storage/keys`
