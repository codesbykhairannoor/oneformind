const { Client } = require('ssh2');

const conn = new Client();

const commands = `
echo "fs.file-max = 500000" >> /etc/sysctl.conf
echo "net.core.somaxconn = 65535" >> /etc/sysctl.conf
echo "net.core.netdev_max_backlog = 65535" >> /etc/sysctl.conf
echo "net.ipv4.tcp_max_syn_backlog = 65535" >> /etc/sysctl.conf
echo "net.ipv4.tcp_fin_timeout = 10" >> /etc/sysctl.conf
echo "net.ipv4.tcp_keepalive_time = 30" >> /etc/sysctl.conf
echo "net.ipv4.tcp_keepalive_intvl = 10" >> /etc/sysctl.conf
echo "net.ipv4.tcp_keepalive_probes = 3" >> /etc/sysctl.conf
echo "net.ipv4.ip_local_port_range = 1024 65535" >> /etc/sysctl.conf
echo "net.core.rmem_max = 16777216" >> /etc/sysctl.conf
echo "net.core.wmem_max = 16777216" >> /etc/sysctl.conf
sysctl -p

echo "* soft nofile 500000" >> /etc/security/limits.conf
echo "* hard nofile 500000" >> /etc/security/limits.conf
echo "root soft nofile 500000" >> /etc/security/limits.conf
echo "root hard nofile 500000" >> /etc/security/limits.conf

echo "VPS Tuning Completed Successfully!"
sysctl net.core.somaxconn
`;

conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec(commands, (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: '116.206.196.23',
  port: 22,
  username: 'root',
  password: 'Khairanaja09',
  readyTimeout: 30000
});

conn.on('error', (err) => {
    console.error('Connection error:', err);
});
