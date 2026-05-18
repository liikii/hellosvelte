export const testTaskData = {
    "total_count": 30, "data": [
        {
            "id": 1,
            "super_suite_name": "核心功能回归测试",
            "user_name": "zhangwei",
            "test_host": "192.168.1.10",
            "test_host_usr": "tester",
            "test_host_pwd": "pass1234",
            "create_time": "2026-04-15T08:30:00",
            "status_code": 1,
            "celery_id": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
        },
        {
            "id": 2,
            "super_suite_name": "API接口全量验证",
            "user_name": "lina",
            "test_host": "10.0.0.50",
            "test_host_usr": "apiuser",
            "test_host_pwd": "apipass2026",
            "create_time": "2026-04-16T10:15:00",
            "status_code": 0,
            "celery_id": "b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9"
        },
        {
            "id": 3,
            "super_suite_name": "安全扫描任务集",
            "user_name": "wangqiang",
            "test_host": "172.16.5.20",
            "test_host_usr": "secadmin",
            "test_host_pwd": "secure!pwd",
            "create_time": "2026-04-17T14:20:00",
            "status_code": -1,
            "celery_id": ""
        },
        {
            "id": 4,
            "super_suite_name": "数据库迁移验证套件",
            "user_name": "liuyang",
            "test_host": "10.10.20.30",
            "test_host_usr": "dbuser",
            "test_host_pwd": "db#test2026",
            "create_time": "2026-04-18T09:45:00",
            "status_code": 2,
            "celery_id": "c3d4e5f6-g7h8-9012-i3j4-k5l6m7n8o9p0"
        },
        {
            "id": 5,
            "super_suite_name": "UI自动化冒烟测试",
            "user_name": "chenjing",
            "test_host": "192.168.50.60",
            "test_host_usr": "uitester",
            "test_host_pwd": "ui@test2026",
            "create_time": "2026-04-19T11:00:00",
            "status_code": 1,
            "celery_id": "d4e5f6g7-h8i9-0123-j4k5-l6m7n8o9p0q1"
        },
        {
            "id": 6,
            "super_suite_name": "支付流程端到端测试",
            "user_name": "zhou_ting",
            "test_host": "192.168.100.200",
            "test_host_usr": "payuser",
            "test_host_pwd": "pay$gateway2026",
            "create_time": "2026-04-20T16:30:00",
            "status_code": 0,
            "celery_id": "e5f6g7h8-i9j0-1234-k5l6-m7n8o9p0q1r2"
        },
        {
            "id": 7,
            "super_suite_name": "日志监控集成测试",
            "user_name": "yangfan",
            "test_host": "172.20.1.15",
            "test_host_usr": "loguser",
            "test_host_pwd": "logpass!2026",
            "create_time": "2026-04-21T13:20:00",
            "status_code": -1,
            "celery_id": ""
        },
        {
            "id": 8,
            "super_suite_name": "多语言兼容性验证",
            "user_name": "huanglei",
            "test_host": "10.5.5.5",
            "test_host_usr": "langtest",
            "test_host_pwd": "multilang2026",
            "create_time": "2026-04-22T10:10:00",
            "status_code": 1,
            "celery_id": "f6g7h8i9-j0k1-2345-l6m7-n8o9p0q1r2s3"
        },
        {
            "id": 9,
            "super_suite_name": "高可用故障切换测试",
            "user_name": "wusong",
            "test_host": "192.168.30.40",
            "test_host_usr": "hauser",
            "test_host_pwd": "failover@2026",
            "create_time": "2026-04-23T15:45:00",
            "status_code": 2,
            "celery_id": "g7h8i9j0-k1l2-3456-m7n8-o9p0q1r2s3t4"
        },
        {
            "id": 10,
            "super_suite_name": "性能压测主流程",
            "user_name": "linmei",
            "test_host": "10.0.1.100",
            "test_host_usr": "perfuser",
            "test_host_pwd": "perf@2026",
            "create_time": "2026-04-24T09:00:00",
            "status_code": 0,
            "celery_id": "h8i9j0k1-l2m3-4567-n8o9-p0q1r2s3t4u5"
        },
        // {
        //     "id": 11,
        //     "super_suite_name": "第三方服务联调",
        //     "user_name": "zhaoxin",
        //     "test_host": "172.31.0.10",
        //     "test_host_usr": "thirdparty",
        //     "test_host_pwd": "tp!connect2026",
        //     "create_time": "2026-04-25T11:30:00",
        //     "status_code": 1,
        //     "celery_id": "i9j0k1l2-m3n4-5678-o9p0-q1r2s3t4u5v6"
        // },
        // {
        //     "id": 12,
        //     "super_suite_name": "移动端兼容测试",
        //     "user_name": "sunyan",
        //     "test_host": "192.168.200.10",
        //     "test_host_usr": "mobiletest",
        //     "test_host_pwd": "mobile#2026",
        //     "create_time": "2026-04-26T14:00:00",
        //     "status_code": -1,
        //     "celery_id": ""
        // },
        // {
        //     "id": 13,
        //     "super_suite_name": "配置中心同步验证",
        //     "user_name": "qianlei",
        //     "test_host": "10.20.30.40",
        //     "test_host_usr": "configusr",
        //     "test_host_pwd": "cfgsync2026",
        //     "create_time": "2026-04-27T16:15:00",
        //     "status_code": 2,
        //     "celery_id": "j0k1l2m3-n4o5-6789-p0q1-r2s3t4u5v6w7"
        // },
        // {
        //     "id": 14,
        //     "super_suite_name": "定时任务调度测试",
        //     "user_name": "hefang",
        //     "test_host": "192.168.10.20",
        //     "test_host_usr": "cronuser",
        //     "test_host_pwd": "scheduler2026",
        //     "create_time": "2026-04-28T08:45:00",
        //     "status_code": 1,
        //     "celery_id": "k1l2m3n4-o5p6-7890-q1r2-s3t4u5v6w7x8"
        // },
        // {
        //     "id": 15,
        //     "super_suite_name": "缓存一致性验证",
        //     "user_name": "dongjie",
        //     "test_host": "172.18.0.5",
        //     "test_host_usr": "cacheusr",
        //     "test_host_pwd": "redis!2026",
        //     "create_time": "2026-04-29T10:20:00",
        //     "status_code": 0,
        //     "celery_id": "l2m3n4o5-p6q7-8901-r2s3-t4u5v6w7x8y9"
        // },
        // {
        //     "id": 16,
        //     "super_suite_name": "文件上传下载测试",
        //     "user_name": "pengli",
        //     "test_host": "10.100.0.1",
        //     "test_host_usr": "fileuser",
        //     "test_host_pwd": "upload@2026",
        //     "create_time": "2026-04-30T13:10:00",
        //     "status_code": 1,
        //     "celery_id": "m3n4o5p6-q7r8-9012-s3t4-u5v6w7x8y9z0"
        // },
        // {
        //     "id": 17,
        //     "super_suite_name": "权限控制边界测试",
        //     "user_name": "jiangtao",
        //     "test_host": "192.168.15.25",
        //     "test_host_usr": "rbacuser",
        //     "test_host_pwd": "auth!test2026",
        //     "create_time": "2026-05-01T09:30:00",
        //     "status_code": 2,
        //     "celery_id": "n4o5p6q7-r8s9-0123-t4u5-v6w7x8y9z0a1"
        // },
        // {
        //     "id": 18,
        //     "super_suite_name": "消息队列消费验证",
        //     "user_name": "xuma",
        //     "test_host": "172.25.5.10",
        //     "test_host_usr": "mquser",
        //     "test_host_pwd": "kafka2026!",
        //     "create_time": "2026-05-02T11:45:00",
        //     "status_code": -1,
        //     "celery_id": ""
        // },
        // {
        //     "id": 19,
        //     "super_suite_name": "容器化部署回归",
        //     "user_name": "liusiyu",
        //     "test_host": "10.200.1.100",
        //     "test_host_usr": "dockerusr",
        //     "test_host_pwd": "container#2026",
        //     "create_time": "2026-05-03T15:00:00",
        //     "status_code": 0,
        //     "celery_id": "o5p6q7r8-s9t0-1234-u5v6-w7x8y9z0a1b2"
        // },
        // {
        //     "id": 20,
        //     "super_suite_name": "全链路追踪测试",
        //     "user_name": "gaofeng",
        //     "test_host": "192.168.5.50",
        //     "test_host_usr": "tracing",
        //     "test_host_pwd": "jaeger2026",
        //     "create_time": "2026-05-04T16:20:00",
        //     "status_code": 1,
        //     "celery_id": "p6q7r8s9-t0u1-2345-v6w7-x8y9z0a1b2c3"
        // }
    ]
}