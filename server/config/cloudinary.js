const cloudinary = require("cloudinary").v2;

const normalizeEnvValue = (value) =>
  typeof value === "string" ? value.trim().replace(/^['"]|['"]$/g, "") : "";

const cloudinaryConfig = {
  cloud_name: normalizeEnvValue(process.env.CLOUDINARY_CLOUD_NAME),
  api_key: normalizeEnvValue(process.env.CLOUDINARY_API_KEY),
  api_secret: normalizeEnvValue(process.env.CLOUDINARY_API_SECRET),
  secure: true,
};

const missingCloudinaryVars = Object.entries(cloudinaryConfig)
  .filter(([key, value]) => key !== "secure" && !value)
  .map(([key]) => key);

if (missingCloudinaryVars.length > 0) {
  throw new Error(
    `Missing Cloudinary configuration: ${missingCloudinaryVars.join(", ")}`
  );
}

cloudinary.config({
  ...cloudinaryConfig,
});

module.exports = cloudinary;
