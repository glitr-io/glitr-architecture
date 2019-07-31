import * as k8s from "@pulumi/kubernetes";
import * as aws from "@pulumi/aws";

export const createNextCloud = (defaultName: String, namespaceName: any, cluster: any) => {
    const name = `${defaultName}-nextcloud`;

    // Create a nextcloud Deployment
    const appLabels = { appClass: name };

    const volume = new aws.ebs.Volume(name, {
        availabilityZone: "eu-west-2a",
        size: 3,
        encrypted: true,
        tags: {
            name: name,
        }
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
                                image: "nextcloud:latest",
                                ports: [{ name: "http", containerPort: 80 }],
                                volumeMounts: [{
                                    name: "nextcloud-volume",
                                    mountPath: "/var/www/html"
                                }]
                            }
                        ],
                        volumes: [
                            {
                                name: "nextcloud-volume",
                                awsElasticBlockStore: {
                                    volumeID: volume.id, // 'vol-0756e865df71ab986',
                                    fsType: 'ext4'
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
