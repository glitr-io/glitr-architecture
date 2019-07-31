import * as awsx from "@pulumi/awsx";

// Create an EKS cluster with non-default configuration
export const createVpc = (name: String) => new awsx.Network(`${name}-vpc`, {
    usePrivateSubnets: false
});

export default createVpc;