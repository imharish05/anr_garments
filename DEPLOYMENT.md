# Deployment setup

This repository has three apps: `Client` (storefront), `Admin` (admin panel), and `Server` (API). Deploy the two Vite apps as separate Vercel projects and the API as a Render web service. TiDB Cloud uses the MySQL protocol already supported by Sequelize here.

## 1. TiDB Cloud

Create a TiDB Cloud Serverless cluster and a database/schema for this app. In its connection details, enable TLS and allow the Render service to connect (for initial setup, use the provider's recommended network access settings). Copy the host, port, username, password, and database name into Render:

- `DB_HOST`: TiDB endpoint hostname
- `DB_PORT`: TiDB port (usually `4000`)
- `DB_USER`, `DB_PASSWORD`, `DB_NAME`: credentials and schema
- `DB_SSL`: `true`

The application creates/synchronizes tables on server startup and may seed empty tables. Use a new, empty schema for first deployment. Back up any existing database before connecting this app.

## 2. Render API

Create a Blueprint from this repository using `render.yaml`, or create a Node web service with root directory `Server`, build command `npm install`, start command `npm start`, and health check `/health`. Fill all `sync: false` values in Render's environment settings. Set:

- `CLIENT_URL`: storefront Vercel production origin
- `ADMIN_URL`: admin Vercel production origin
- `STORAGE_TYPE`: `cloudinary`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `JWT_SECRET`: a long, random secret (Render generates one in the blueprint)

Add other integration secrets only when using those features, such as `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and email settings. After deploy, note the Render service URL, e.g. `https://anr-garments-api-n0gf.onrender.com`.

## 3. Vercel storefront

Create a Vercel project with root directory `Client`, framework preset Vite, build command `npm run build`, and output directory `dist`. Set these build environment variables:

- `VITE_API_BASE_URL`: `https://<render-service>.onrender.com/api`
- `VITE_SERVER_URL`: `https://<render-service>.onrender.com`

`Client/vercel.json` handles client-side routes. Add the resulting production domain to Render's `CLIENT_URL`.

## 4. Vercel admin

Create a second Vercel project with root directory `Admin`, framework preset Vite, build command `npm run build`, and output directory `dist`. Set:

- `VITE_API_BASE_URL`: `https://<render-service>.onrender.com/api`
- `VITE_SERVER_URL`: `https://<render-service>.onrender.com`
- `VITE_CLIENT_URL`: storefront production origin

Add its production domain to Render's `ADMIN_URL`. Redeploy both Vercel projects whenever build environment values change.

## Image storage switch

Set `STORAGE_TYPE=cloudinary` on Render and provide all three Cloudinary credentials. To use local storage on a machine/server you control, set `STORAGE_TYPE=local`; new uploads are saved under `Server/uploads` and the Cloudinary credentials are not used. This switch affects new uploads only: existing database image URLs continue pointing to their current storage, and moving the existing image library requires copying the files and updating image URLs. Render's normal filesystem is ephemeral, so local mode there is only suitable for temporary testing; use a persistent disk or Cloudinary for durable production images.

Never commit `.env` files or put Cloudinary/API secrets in Vercel `VITE_*` variables. Vite variables are public in the browser bundle.
