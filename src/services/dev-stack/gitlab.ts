import * as k8s from "@pulumi/kubernetes";
import * as aws from "@pulumi/aws";

export const createGitlab = (defaultName: String, namespaceName: any, cluster: any) => {
    const name = `${defaultName}-gitlab`;

    // Create a nextcloud Deployment
    const appLabels = { appClass: name };

    const gitlabVolumeData = new aws.ebs.Volume(`${name}-gitlab-volume-data`, {
        availabilityZone: "eu-west-2a",
        size: 1,
        encrypted: true,
        tags: {
            name: name,
        },
    });

    const gitlabVolumeOpt = new aws.ebs.Volume(`${name}-gitlab-volume-opt`, {
        availabilityZone: "eu-west-2a",
        size: 1,
        encrypted: true,
        tags: {
            name: name,
        },
    });

    const gitlabVolumeLogs = new aws.ebs.Volume(`${name}-gitlab-volume-logs`, {
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
                                image: "gitlab/gitlab-ce:latest",
                                ports: [
                                    { name: "http", containerPort: 80 },
                                    { name: "ssh", containerPort: 22 },
                                    { name: "ssl", containerPort: 443 }
                                ],
                                volumeMounts: [
                                    {
                                        name: "gitlab-volume-data",
                                        mountPath: "/etc/gitlab"
                                    },
                                    {
                                        name: "gitlab-volume-opt",
                                        mountPath: "/var/opt/gitlab"
                                    },
                                    {
                                        name: "gitlab-volume-logs",
                                        mountPath: "/var/log/gitlab"
                                    },
                                ]
                            }
                        ],
                        volumes: [
                            {
                                name: "gitlab-volume-data",
                                awsElasticBlockStore: {
                                    volumeID: gitlabVolumeData.id
                                }
                            },
                            {
                                name: "gitlab-volume-opt",
                                awsElasticBlockStore: {
                                    volumeID: gitlabVolumeOpt.id
                                }
                            },
                            {
                                name: "gitlab-volume-logs",
                                awsElasticBlockStore: {
                                    volumeID: gitlabVolumeLogs.id
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

    const service = new k8s.core.v1.Service(name,
        {
            metadata: {
                labels: appLabels,
                namespace: namespaceName,
            },
            spec: {
                type: "LoadBalancer",
                ports: [
                    { name: "http", port: 80, targetPort: "http" },
                    { name: "ssh", port: 22, targetPort: "ssh" },
                    { name: "ssl", port: 443, targetPort: "ssl" },
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
