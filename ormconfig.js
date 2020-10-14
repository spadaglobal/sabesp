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
