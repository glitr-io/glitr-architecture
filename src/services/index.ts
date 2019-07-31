import * as k8s from "@pulumi/kubernetes";
import { createNginx } from './nginx';
import { createNextCloud } from './nextCloud';
import { createCaddy } from './caddy/caddy';
import { createGitlab } from './dev-stack/gitlab';
import { createVerdaccio } from './dev-stack/verdaccio';

export const startServices = (name: String, cluster: any) => {
    // Create a Kubernetes Namespace
    const ns = new k8s.core.v1.Namespace(`${name}-namespace`, {}, { provider: cluster.provider });
    const volume = { id: 'test' }; // createVolume(name);
    
    const namespaceName = ns.metadata.apply(m => m.name);
    const volumeId = volume.id;

    return {
        namespaceName,
        services: [
            createNginx(name, namespaceName, cluster),
            // createGitlab(name, namespaceName, cluster),
            // createVerdaccio(name, namespaceName, cluster),
            // createNextCloud(name, namespaceName, cluster),
            createCaddy(name, namespaceName, cluster)
        ]
    }
}
