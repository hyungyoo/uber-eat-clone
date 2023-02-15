# user-eat-clone

- dockerization
  - back-end
  - front-end
  - reverse proxy server
    </br>
    </br>

# start

- dev

  - npm run start:dev : nest start --wath in docker container
  - npm run start:local: nest start --watch in local with Dbeaver, Postico2

- test
  - npm run test:watch : jest --watch
  - npm run test:cov
  - npm run test:e2e

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
