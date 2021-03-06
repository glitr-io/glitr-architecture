import * as k8s from "@pulumi/kubernetes";

export const createNginx = (defaultName: String, namespaceName: any, cluster: any) => {
    const name = `${defaultName}-nginx`;

    // Create a NGINX Deployment
    const appLabels = { appClass: name };

    const deployment = new k8s.apps.v1.Deployment(name,
        {
            metadata: {
                namespace: namespaceName,
                labels: appLabels,
            },
            spec: {
                replicas: 1,
                selector: { matchLabels: appLabels },
                template: {
                    metadata: {
                        labels: appLabels,
                    },
                    spec: {
                        containers: [
                            {
                                name: name,
                                image: "nginx:latest",
                                ports: [{ name: "http", containerPort: 80 }]
                            }
                        ]
                    }
                }
            },
        },
        {
            provider: cluster.provider,
        }
    );

    // Create a LoadBalancer Service for the NGINX Deployment
    const service = new k8s.core.v1.Service(name,
        {
            metadata: {
                labels: appLabels,
                namespace: namespaceName,
            },
            spec: {
                type: "LoadBalancer",
                ports: [{ port: 80, targetPort: "http" }],
                selector: appLabels,
            },
        },
        {
            provider: cluster.provider,
        }
    );

    return {
        deployment,
        service
    };
}
