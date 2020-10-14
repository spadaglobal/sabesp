## To connect to a database in a dev environment, you need to create an ormconfig.js with this following information below:

```
module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    process.env.NODE_ENV === 'development'
      ? './src/modules/**/infra/typeorm/entities/*.ts'
      : './dist/modules/**/infra/typeorm/entities/*.js',
  ],
  migrations: [
    process.env.NODE_ENV === 'development'
      ? './src/shared/infra/typeorm/migrations/*.ts'
      : './dist/shared/infra/typeorm/migrations/*.js',
  ],
  cli: {
    migrationsDir:
      process.env.NODE_ENV === 'development'
        ? './src/shared/infra/typeorm/migrations'
        : './dist/shared/infra/typeorm/migrations',
  },
};
```

### Also, in a dev environment, you need to create a .env file, and you can do it following the example file called .env.example
