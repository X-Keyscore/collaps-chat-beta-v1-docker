module.exports = {
  apps : [{
    script: 'index.js',
    watch: '.'
  },],
  deploy : {
    production : {
      user : 'sergio',
      host:'192.168.1.152',
      ref  : 'origin/main',
      repo : 'git@github.com:FIntLyncix/collaps-api.git',
      path : '/home/sergio/Documents/collaps-api',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
