# Roava OnBoarding Services

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Code Structure
The code struture is shown below. Where "Products" represent a banking product
```bash
products.microservice/src/
├── config
├── db
├── products
│ ├── dto                       # dto definitions
│ ├── exceptions                # modules exception definitions
│ ├── guards
│ ├── interceptors              # request interceptors/filters
│ ├── middleware                # middlewares e.g. authenticate
│ ├── pipe                      # nestjs pipes e.g. validation
│ ├── products.command.ts       # incoming commands
│ ├── products.entity.ts        # entity, domain definition, enums
│ ├── products.event.ts         # event definitions / schemas
│ ├── products.handler.ts       # event handlers
│ ├── products.module.ts        # required nestjs module file
│ ├── products.proto            # service interface/protobuf for cmds
│ ├── products.repository.ts    # repos for data persistance
│ ├── products.service.ts       # service dispatches commands
│ └── products.saga.ts          # saga definitions
├── app.module.ts
└── main.ts
```
