import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'main-app',
  exposes: {
    './Routes': 'main-app/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
