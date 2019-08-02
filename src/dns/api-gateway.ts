import * as awsx from "@pulumi/awsx";

export const startApiGateway = (name: String) => new awsx.apigateway.API(`${name}-api-gateway`, {
    routes: [
        {
            path: "/aaa",
            method: "GET",
            eventHandler: async (event) => {
                const route = event.pathParameters!["route"];
                return {
                    statusCode: 200,
                    body: JSON.stringify({ route, message: 'hello world' }),
                };
            }
        }
    ]
});

