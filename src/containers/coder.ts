import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const startContainers = (name: String) => {
    const listener = new awsx.elasticloadbalancingv2.NetworkListener(`${name}-nginx-lb`, { port: 8443 });
    const nginx = new awsx.ecs.FargateService(`${name}-nginx`, {
        taskDefinitionArgs: {
            containers: {
                nginx: {
                    image: "codercom/code-server",
                    memory: 256,
                    portMappings: [listener],
                },
            },
        },
        desiredCount: 1,
    });
    
    return {
        listener,
        nginx
    };
};

export default startContainers;
