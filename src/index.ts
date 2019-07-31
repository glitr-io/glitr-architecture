import { startServices } from './services';
import { startContainers } from './containers';

export const createServices = (name: string, cluster: any) => startServices(name, cluster);

export const createContainers = (name: string) => startContainers(name);