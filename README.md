# Energy Data on AWS with Raspberry Pi

This repository creates a service on a Raspberry Pi to store home energy data on AWS DynamoDB by reading the [P1 port](https://nl.wikipedia.org/wiki/P1-poort).

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

#### Clone Project

```
cd ~
touch Projects
cd Projects
git clone git@github.com:mellevanderlinde/energy-meter.git
cd energy-meter
```

#### Set AWS Credentials

```
cd apps/meter
cp .env.template .env
nano .env
```

Use the editor to fill `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` with the values that belong to the AWS IAM user that was created in step 1.

#### Create Service

Create a service that always runs in the background (also after a reboot), as described on [this page](https://www.tomshardware.com/how-to/run-long-running-scripts-raspberry-pi).

```
sudo touch /etc/systemd/system/energy-meter.service
sudo nano /etc/systemd/system/energy-meter.service
```

Insert the following and save the file (be sure to replace `<user>` with the username of the Raspberry Pi).

```
[Unit]
Description=Energy Meter Service
After=multi-user.target

[Service]
Type=idle
ExecStart=/usr/bin/npm run start --prefix /home/<user>/Projects/energy-meter

[Install]
WantedBy=multi-user.target
```

Start and enable the service, so it always runs in the background.

```
sudo systemctl start energy-meter
sudo systemctl enable energy-meter
```

Verify that the service is running. This shows potential failures.

```
sudo systemctl status energy-meter
```
