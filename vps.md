Microsoft Windows [Version 10.0.22631.6199]
(c) Microsoft Corporation. All rights reserved.

C:\Users\Axioo>cd D:/Downloads

C:\Users\Axioo>d;
'd' is not recognized as an internal or external command,
operable program or batch file.

C:\Users\Axioo>d:

D:\Downloads>ssh-keygen -t ed25519
Generating public/private ed25519 key pair.
Enter file in which to save the key (C:\Users\Axioo/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in C:\Users\Axioo/.ssh/id_ed25519
Your public key has been saved in C:\Users\Axioo/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:ueYPo8vTaFR7ADtmZGAPuCDEwpcPtJdyxVbKCuhzSYo axioo@DESKTOP-SST1US0
The key's randomart image is:
+--[ED25519 256]--+
|+..o=.....       |
|+oo=.oBo.        |
|oo.*o*o=         |
|o + *.* o.       |
|E+ o + oSo       |
|  o   . ...      |
|     . o=.       |
|     .++.o       |
|     .+o...      |
+----[SHA256]-----+

D:\Downloads>type C:\Users\Axioo\.ssh\id_ed25519.pub
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDwDYrKrSNB/Va/JC2IDc1fCSPBrm6ORPuIs4afl8YM6 axioo@DESKTOP-SST1US0

D:\Downloads>ssh root@116.206.196.23
The authenticity of host '116.206.196.23 (116.206.196.23)' can't be established.
ED25519 key fingerprint is SHA256:s3HXwZmBTJTOyHzUk2yi3UbX9FfsciISrxUSHmia+e4.
This key is not known by any other names.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '116.206.196.23' (ED25519) to the list of known hosts.
Please login as the user "Khairanaja09" rather than the user "root".

Kh@iranaConnection to 116.206.196.23 closed.

D:\Downloads>jssh Khairanaja09@116.206.196.23
'jssh' is not recognized as an internal or external command,
operable program or batch file.

D:\Downloads>ssh Khairanaja09@116.206.196.23
Welcome to Ubuntu 22.04.5 LTS (GNU/Linux 5.15.0-179-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Tue Sep  1 23:29:27 WIB 2026

  System load:  0.03              Processes:             106
  Usage of /:   4.7% of 57.97GB   Users logged in:       0
  Memory usage: 5%                IPv4 address for eth0: 116.206.196.23
  Swap usage:   0%


Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
New release '24.04.4 LTS' available.
Run 'do-release-upgrade' to upgrade to it.



The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

Khairanaja09@KhairanVPS:~$ curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash

==========================================
   Coolify Installation - 20260901-232950
==========================================

Welcome to Coolify Installer!
This script will install everything for you. Sit back and relax.
Source code: https://github.com/coollabsio/coolify/blob/v4.x/scripts/install.sh
Using default registry URL: docker.io
---------------------------------------------
| Operating System  | ubuntu 22.04
| Docker            | latest
| Coolify           | 4.3.14
| Helper            | 1.0.16
| Realtime          | 1.0.17
| Docker Pool       | 10.0.0.0/8 (size 24)
| Registry URL      | docker.io
---------------------------------------------


============================================================
[2026-09-01 23:29:51] Step 1/9: Installing required packages
============================================================
1/9 Installing required packages (curl, wget, git, jq, openssl)...
[2026-09-01 23:30:34] Required packages installed successfully
     Done.

============================================================
[2026-09-01 23:30:34] Step 2/9: Checking OpenSSH server configuration
============================================================
2/9 Checking OpenSSH server configuration...
 - OpenSSH server is installed.
 - SSH PermitRootLogin is enabled.

============================================================
[2026-09-01 23:30:34] Step 3/9: Checking Docker installation
============================================================
3/9 Checking Docker installation...
 - Docker is not installed. Installing Docker. It may take a while.
 - Until then, here's a joke for you:

"We messed up the keming again guys."

# Executing docker install script, commit: 42dcae692436f34526524ed46d3b32885c9355f5
+ sh -c apt-get -qq update >/dev/null
+ sh -c DEBIAN_FRONTEND=noninteractive apt-get -y -qq install ca-certificates curl >/dev/null
+ sh -c install -m 0755 -d /etc/apt/keyrings
+ sh -c curl -fsSL "https://download.docker.com/linux/ubuntu/gpg" -o /etc/apt/keyrings/docker.asc
+ sh -c chmod a+r /etc/apt/keyrings/docker.asc
+ sh -c echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu jammy stable" > /etc/apt/sources.list.d/docker.list
+ sh -c apt-get -qq update >/dev/null
+ apt_flags=-y -qq
+ [ -n  ]
+ sh -c DEBIAN_FRONTEND=noninteractive apt-get -y -qq install docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-ce-rootless-extras docker-buildx-plugin docker-model-plugin >/dev/null
Using systemd to manage Docker service
+ sh -c systemctl enable --now docker.service 2>/dev/null
INFO: Docker daemon enabled and started

+ sh -c docker version
Client: Docker Engine - Community
 Version:           29.7.2
 API version:       1.55
 Go version:        go1.26.5
 Git commit:        a7dcaa6
 Built:             Wed Aug  5 18:28:48 2026
 OS/Arch:           linux/amd64
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          29.7.2
  API version:      1.55 (minimum version 1.40)
  Go version:       go1.26.5
  Git commit:       6a43e3d
  Built:            Wed Aug  5 18:28:48 2026
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          v2.3.4
  GitCommit:        db8809540e1a7a9da5d518876894933ff55692ab
 runc:
  Version:          1.4.3
  GitCommit:        v1.4.3-0-gbb14dabe
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0

================================================================================

To run Docker as a non-privileged user, consider setting up the
Docker daemon in rootless mode for your user:

    dockerd-rootless-setuptool.sh install

Visit https://docs.docker.com/go/rootless/ to learn about rootless mode.


To run the Docker daemon as a fully privileged service, but granting non-root
users access, refer to https://docs.docker.com/go/daemon-access/

WARNING: Access to the remote API on a privileged Docker daemon is equivalent
         to root access on the host. Refer to the 'Docker daemon attack surface'
         documentation for details: https://docs.docker.com/go/attack-surface/

================================================================================

 - Docker installed successfully.
 - Docker version 29.7.2 meets minimum requirement (24+).

============================================================
[2026-09-01 23:31:39] Step 4/9: Checking Docker configuration
============================================================
4/9 Checking Docker configuration...
 - Network pool configuration: 10.0.0.0/8/24
 - To override existing configuration: DOCKER_POOL_FORCE_OVERRIDE=true
 - Creating new Docker configuration with network pool: 10.0.0.0/8/24
 - Configuration updated - restarting Docker daemon...
 - Docker daemon restarted successfully

============================================================
[2026-09-01 23:31:41] Step 5/9: Downloading required files from CDN
============================================================
5/9 Downloading required files from CDN...
[2026-09-01 23:31:41] Downloading configuration files in parallel...
[2026-09-01 23:31:43] All configuration files downloaded successfully
     Done.

============================================================
[2026-09-01 23:31:43] Step 6/9: Setting up environment variable file
============================================================
6/9 Setting up environment variable file...
 - No .env file found, copying .env.production to .env
[2026-09-01 23:31:43] Environment file setup completed
     Done.

============================================================
[2026-09-01 23:31:43] Step 7/9: Checking and updating environment variables
============================================================
7/9 Checking and updating environment variables...
 - Updated value of APP_ID as the current value was empty
 - Updated value of APP_KEY as the current value was empty
 - Updated value of DB_PASSWORD as the current value was empty
 - Updated value of REDIS_PASSWORD as the current value was empty
 - Updated value of PUSHER_APP_ID as the current value was empty
 - Updated value of PUSHER_APP_KEY as the current value was empty
 - Updated value of PUSHER_APP_SECRET as the current value was empty
 - Added DOCKER_ADDRESS_POOL_BASE and its value as the variable was missing
 - Added DOCKER_ADDRESS_POOL_SIZE and its value as the variable was missing
[2026-09-01 23:31:43] Environment variables check completed
     Done.

============================================================
[2026-09-01 23:31:43] Step 8/9: Checking SSH key for localhost access
============================================================
8/9 Checking SSH key for localhost access...
 - Generating SSH key.
[2026-09-01 23:31:43] SSH key check completed
     Done.

============================================================
[2026-09-01 23:31:43] Step 9/9: Installing Coolify
============================================================
9/9 Installing Coolify (4.3.14)...
 - It could take a while based on your server's performance, network speed, stars, etc.
 - Please wait.
 - Until then, here's a joke for you:

Being a self-taught developer is almost the same as being a cut neck chicken because you have no sense of direction in the beginning.


==========================================
   Coolify Upgrade - 2026-09-01-23-31-43
==========================================

1/6 Downloading latest configuration files...
     Done.

2/6 Updating environment configuration...
     Done.
563e7f872eaf5854bb8f9fd10db3f071e86ebce95e3128259feec218a2a0ca70

3/6 Pulling Docker images...
     This may take a few minutes depending on your connection.
     - Pulling docker.io/coollabsio/coolify-helper:1.0.16...
     - Pulling docker.io/coollabsio/coolify-realtime:1.0.17...
     - Pulling docker.io/coollabsio/coolify:4.3.14...
     - Pulling postgres:15-alpine...
     - Pulling redis:7-alpine...
     All images pulled successfully.

4/6 Stopping containers and starting new ones...
     This step will restart all Coolify containers.
     Check the log file for details: /data/coolify/source/upgrade-2026-09-01-23-31-43.log

5/6 Containers are being restarted in the background...
6/6 Upgrade process initiated!

==========================================
   Coolify upgrade to 4.3.14 in progress
==========================================

   The upgrade will continue in the background.
   Coolify will be available again shortly.
   Log file: /data/coolify/source/upgrade-2026-09-01-23-31-43.log
 - Coolify installed successfully.
 - Waiting for Coolify to be ready...
 - Upgrade in progress: Starting new containers (0s)
 - Upgrade in progress: Starting new containers (10s)
[2026-09-01 23:34:14] Upgrade completed: Upgrade complete
 - Upgrade complete!
 - Verifying Coolify is healthy...
[2026-09-01 23:34:14] Coolify container is healthy
 - Coolify is ready!

   ____                            _         _       _   _                 _
  / ___|___  _ __   __ _ _ __ __ _| |_ _   _| | __ _| |_(_) ___  _ __  ___| |
 | |   / _ \| '_ \ / _` | '__/ _` | __| | | | |/ _` | __| |/ _ \| '_ \/ __| |
 | |__| (_) | | | | (_| | | | (_| | |_| |_| | | (_| | |_| | (_) | | | \__ \_|
  \____\___/|_| |_|\__, |_|  \__,_|\__|\__,_|_|\__,_|\__|_|\___/|_| |_|___(_)
                   |___/


Your instance is ready to use!

You can access Coolify through your Public IPV4: http://116.206.196.23:8000

If your Public IP is not accessible, you can use the following Private IPs:

http://10.0.0.1:8000
http://10.0.1.1:8000
http://fd7c:be4b:c2bf::1:8000

WARNING: It is highly recommended to backup your Environment variables file (/data/coolify/source/.env) to a safe location, outside of this server (e.g. into a Password Manager).


============================================================
[2026-09-01 23:34:15] Installation Complete
============================================================
[2026-09-01 23:34:15] Coolify installation completed successfully
[2026-09-01 23:34:15] Version: 4.3.14
[2026-09-01 23:34:15] Log file: /data/coolify/source/installation-20260901-232950.log
Khairanaja09@KhairanVPS:~$