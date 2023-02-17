# user-eat-clone

- dockerization
  - back-end
  - front-end
  - reverse proxy server
    </br>
    </br>

# start

- dev

  - npm run start:dev : with Dbeaver, Postico2, postgres in local
  - env file must be in src of backend : .dev.env

- test

  - npm run test:cov
  - npm run test:e2e
  - env file must be in src of backend : .e2e.env

- prod
  - make in root folder
    - docker-compose up --build
    - npm run start:prod with docker
  - env file must be in root folder : .prod.env

## Backend

- nestjs
- graphql API to avoid over / under fetching
- typeORM (data mapper pattern)
- JPA API
- mailgun
- e2e, unit test with jest

</br>
</br>

## frontend

- reactjs or nextjs
- SWR for caching
- css with tailwind framework

</br>
</br>

## reverse proxy server

- nginx
