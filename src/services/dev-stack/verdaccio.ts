import * as k8s from "@pulumi/kubernetes";
import * as aws from "@pulumi/aws";

export const createVerdaccio = (defaultName: String, namespaceName: any, cluster: any) => {
    const name = `${defaultName}-verdaccio`;

    // Create a nextcloud Deployment
    const appLabels = { appClass: name };

    const volume = new aws.ebs.Volume(`${name}-volume`, {
        availabilityZone: "eu-west-2a",
        size: 1,
        encrypted: true,
        tags: {
            name: name,
        },
    });

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
                                image: "verdaccio/verdaccio",
                                ports: [{ name: "main", containerPort: 4873 }],
                                volumeMounts: [{
                                    name: "verdaccio-volume",
                                    mountPath: "/opt/verdaccio-build"
                                }]
                            }
                        ],
                        volumes: [
                            {
                                name: "verdaccio-volume",
                                awsElasticBlockStore: {
                                    volumeID: volume.id
                                }
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
                ports: [{ port: 80, targetPort: "main" }],
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
