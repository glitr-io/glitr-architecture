import * as k8s from "@pulumi/kubernetes";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

export const createCaddy = (defaultName: String, namespaceName: any, cluster: any) => {
    const name = `${defaultName}-caddy`;

    // Create a nextcloud Deployment
    const appLabels = { appClass: name };

    // const volume = new aws.ebs.Volume(`${name}-volume`, {
    //     availabilityZone: "eu-west-2a",
    //     size: 1,
    //     encrypted: true,
    //     tags: {
    //         name: name,
    //     },
    // });

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
                                image: "735429896325.dkr.ecr.eu-west-2.amazonaws.com/glitr-ingress:latest",
                                imagePullPolicy: "Always",
                                ports: [
                                    { name: "http", containerPort: 80 },
                                    { name: "https", containerPort: 443 }
                                ],
                                // volumeMounts: [{
                                //     name: "volume",
                                //     mountPath: "/root/.caddy"
                                // }]
                            }
                        ],
                        // volumes: [
                        //     {
                        //         name: "volume",
                        //         awsElasticBlockStore: {
                        //             volumeID: 'vol-0e0f1918796d753a4' // volume.id
                        //         }
                        //     }
                        // ]
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
                ports: [
                    { port: 80, targetPort: "http", name: 'http' },
                    { port: 443, targetPort: "https", name: 'https' }
                ],
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
