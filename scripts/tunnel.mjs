import { spawn } from 'child_process';

const PORT = process.env.PORT || 4173;

console.log(`Starting public tunnel to port ${PORT}...`);
console.log('(Uses pinggy.io - no signup required, tunnel expires in 60 min)\n');

const ssh = spawn('ssh', [
  '-o', 'StrictHostKeyChecking=no',
  '-o', 'ServerAliveInterval=30',
  '-R', `0:localhost:${PORT}`,
  '-p', '443',
  'a.pinggy.io',
], { stdio: ['ignore', 'pipe', 'pipe'] });

ssh.stdout.on('data', (data) => {
  const text = data.toString();
  const match = text.match(/(https?:\/\/\S+\.run\.pinggy-free\.link)/);
  if (match) {
    console.log('\n========================================');
    console.log('  外网访问地址:');
    console.log(`  ${match[1]}`);
    console.log('  任何联网设备均可打开此链接');
    console.log('  隧道有效期: 60 分钟');
    console.log('========================================\n');
  }
});

ssh.stderr.on('data', (data) => {
  // pinggy sends informational messages to stderr
  const text = data.toString();
  if (!text.includes('Warning:') && !text.includes('Pseudo-terminal')) {
    process.stderr.write(data);
  }
});

ssh.on('close', (code) => {
  console.log(`Tunnel closed (code ${code})`);
  process.exit(code);
});

process.on('SIGINT', () => {
  ssh.kill();
  process.exit();
});
