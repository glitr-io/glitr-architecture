FROM node

FROM pulumi/pulumi

WORKDIR /app

ADD ./ /app

RUN npm install

# ENTRYPOINT [ "pulumi" ]