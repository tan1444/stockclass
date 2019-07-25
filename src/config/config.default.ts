export = (appInfo: any) => {
  const config: any = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_123456';

  config.host = 'http://112.16.98.16:8003';

  // add your config here
  config.middleware = [
  ];

  config.development = {
    watchDirs: [
      'app',
      'lib',
      'config',
      'schedule',
      'app.ts',
      'agent.ts',
      'interface.ts'
    ],
    overrideDefault: true
  };


  config.sequelize = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'unitesys',
    dialect: 'mysql',
  };

  config.jwt = {
    secret: "seari",
    seconds: 60 * 30
  };

  config.wx = {
    grant_type: 'client_credential',
    noncestr: 'Wm3WZYTPz0wzccnW',
    accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token',
    ticketUrl: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
    mediaUrl: 'http://file.api.weixin.qq.com/cgi-bin/media/get?',
    templateMsgUrl: 'https://api.weixin.qq.com/cgi-bin/message/template/send?',
    cache_duration: 1000 * 72,
    template_id_bill: 'WXu3pPpHSrXzuu4PlDkigLV7oV7UvpvmAiSav1YlhRM',
    template_url: 'http://kcy.shsaijing.com/wx/bill',
    appid: 'wx184d3a236b083c23',
    appsecret: '486f950ee207ef3d94c367db82ad579a'
  }

  config.security = {
    csrf: {
      enable: false
    }
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0
    }
  };

  config.multipart = {
    fileExtensions: [
      '.xlsx',
      '.xls',
      '.doc',
      '.docx'
    ]
  }

  config.view = {
    mapping: {
      '.ejs': 'ejs',
    },
  };

  config.session = {
    key: 'EGG_SESS',  //eggjs默认session的key
    maxAge: 1000 * 60 * 30,
    httpOnly: true,
    encrypt: true,
    renew: false  //每次访问页面都会给session会话延长时间
  };

  config.aliSdk = {
    accessKeyId: 'LTAIMSAjQgO1YlNr',
    accessKeySecret: 'Z84tc1bGhW6JyFSofY6EDuiffbSHYK',
    endpoint: 'https://live.aliyuncs.com/',
    aliId: '1472871581885326',
    apiVersion: '2016-11-01'
  };

  config.aliVod = {
    pushKey: 'Qdok8F7dZx',
    pushDomain: 'tui.hzzhsq.com',
    pullKey: 'd3hWoPivyq',
    pullDomain: 'bo.hzzhsq.com',
  };

  config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: 'egg-example-api',
      description: 'example for swaggerdoc',
      version: '1.0.0',
    },
    securityDefinitions: {
      apikey: {
        type: 'apiKey',
        name: 'token',
        in: 'header',
      },
      // oauth2: {
      //   type: 'oauth2',
      //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
      //   flow: 'password',
      //   scopes: {
      //     'write:access_token': 'write access_token',
      //     'read:access_token': 'read access_token',
      //   },
      // },
    },
    schemes: ['http', 'https'],
    enable: true,
    enableSecurity: true,
    routerMap: false,
  };

  return config;
};
