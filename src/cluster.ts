import * as eks from "@pulumi/eks";
// import { executionAsyncId } from "async_hooks";
// import { ConditionalForwader } from "@pulumi/aws/directoryservice";
// import { IdentityNotificationTopic } from "@pulumi/aws/ses";

export const createCluster = (name: String, vpc: any) => new eks.Cluster(`${name}-cluster`, {
    vpcId: vpc.vpcId,
    subnetIds: vpc.subnetIds,
    desiredCapacity: 1,
    minSize: 1,
    maxSize: 1,
    // storageClasses: "gp2",
    deployDashboard: false,
});
