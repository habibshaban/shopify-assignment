export interface Config {
  appName: string;
  environment: string;
  port: number;
}

export const config: Config = {
  appName: process.env.APP_NAME || "Cart Chain Event Manager",
  environment: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
};
