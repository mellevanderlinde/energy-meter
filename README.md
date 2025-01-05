# Energy Data on AWS with Raspberry Pi

This repository creates a service on a Raspberry Pi to store home energy usage data on AWS DynamoDB by reading the [P1 port](https://nl.wikipedia.org/wiki/P1-poort). This port sends data approximately every 10 seconds, but the data is saved every 5 minutes.

## Setup

### 1. Deploy to AWS

Run this on your desktop device (i.e., not on the Raspberry Pi).

```
pnpm install
cd apps/infra
npx cdk deploy -c email=you@example.com
```

Go to the created [IAM user](https://us-east-1.console.aws.amazon.com/iam/home?region=eu-west-1#/users/details/energy-meter?section=security_credentials), click "Create access key" and follow the steps in the console. Temporarily store the access key and secret access key. 

### 2. Setup Raspberry Pi

Run this on the Raspberry Pi.

#### 2.1 Clone Repository

```
cd ~ && mkdir Projects && cd Projects
git clone https://github.com/mellevanderlinde/energy-meter.git
cd energy-meter
```

#### 2.2 Set AWS Credentials

```
cp apps/meter/.env.template apps/meter/.env
nano apps/meter/.env
```

Use the editor to fill `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` with the values that belong to the AWS IAM user that was created in step 1.

#### 2.3 Start Docker Service

Create a service that always runs in the background. The service is restarted after a reboot.

```
docker compose up --build --detach
```

## Monitor

The webpage can be used to monitor energy usage. This requires AWS credentials to read from DynamoDB, unless `MOCK_DATA=true` is specified.

```
pnpm install
pnpm dev

# use mock data
MOCK_DATA=true pnpm dev
```