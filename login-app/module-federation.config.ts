import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'login-app',
  exposes: {
    './Routes': 'login-app/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
