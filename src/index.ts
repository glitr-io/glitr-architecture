import { startServices } from './services';
import { startContainers } from './containers';
import { startApiGateway } from './dns/api-gateway';

export const createServices = (name: string, cluster: any) => startServices(name, cluster);

export const createContainers = (name: string) => startContainers(name);

export const createApiGateway = (name: string) => startApiGateway(name);
