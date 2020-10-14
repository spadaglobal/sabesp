import app from '@shared/http/app';

app.listen(process.env.PORT || process.env.APP_SERVER_PORT, () => {
  console.log('Server is running');
});
