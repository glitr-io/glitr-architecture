import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// // Create an AWS resource (S3 Bucket)
// const bucket = new aws.s3.Bucket("my-bucket");

// // Export the name of the bucket
// export const bucketName = bucket.id;

// const selected = pulumi.output(aws.route53.getZone({
//     name: "xoron.io",
//     privateZone: true,
// }));

// const www = new aws.route53.Record("www", {
//     records: ["10.0.0.1"],
//     ttl: 300,
//     type: "A",
//     zoneId: selected.zoneId,
// });

const fwd = new aws.route53.ResolverRule("fwd", {
    domainName: "xoron.io",
    // resolverEndpointId: aws_route53_resolver_endpoint_foo.id,
    ruleType: "FORWARD",
    tags: {
        Environment: "Prod",
    },
    targetIps: [{
        ip: "https://google.com",
    }],
});