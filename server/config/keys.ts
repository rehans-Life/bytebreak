export default {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    DB_URI: process.env.DB_URI!.replace("<password>", process.env.DB_PASSWORD!)
}