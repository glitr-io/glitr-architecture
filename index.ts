// Copyright 2016-2019, Pulumi Corporation.  All rights reserved.

import * as pulumi from '@pulumi/pulumi';
// import { createVpc } from './src/network';
// import { createCluster } from './src/cluster';
import {
    // createServices,
    createContainers
} from './src'

export const name = "glitr-architecture";

export const containers = createContainers(name);

// const vpc = createVpc(name);
// const cluster = createCluster(name, vpc);

// Export the clusters' kubeconfig.
// export const kubeconfig = cluster.kubeconfig

// const {
//     namespaceName: namespaceName2,
//     services: services2
// } = createServices(name, cluster);


// export const namespaceName = namespaceName2;

// export const services = services2.map(({ deployment, service }) => ({
//     deploymentName: deployment.metadata.apply((m: any) => m.name),
//     serviceName: service.metadata.apply((m: any) => m.name),
//     serviceHostname: service.status.apply((s: any) => s.loadBalancer.ingress[0].hostname)
// }));
