const modeUrlObj = {
    // 生产环境
    'production': {
        baseURL: '  http://www.cstos.cstcloud.cn/csthub',
      /*  baseURL: '  http://39.100.253.62:80/csthub',*/
        authBaseURL: ''
    },
    // 开发环境
    'development': {
      /*  baseURL: '  http://39.100.253.62:80/csthub',*/
     /*   baseURL: ' http://192.168.1.120:80/csthub',*/
        baseURL: '  http://www.cstos.cstcloud.cn/csthub',
       /* baseURL: '  http://www.cstos.cstcloud.cn/csthub',*/
        authBaseURL: ''
    },
    // 测试环境
    'test': {
        baseURL: '  http://www.cstos.cstcloud.cn/csthub',
        authBaseURL: ''
    }
}
export default modeUrlObj[process.env.NODE_ENV]
