export const testTaskDetailData = {"total_count": 30, "data": [
  {
    "case_id": 1001,
    "suite_name": "用户登录功能测试套件",
    "case_name": "验证正确用户名密码可登录",
    "start_time": "2026-05-09T10:00:00",
    "end_time": "2026-05-09T10:00:15",
    "status_code": 1,
    "status_desc": "用户成功登录系统，返回 200 OK 和有效 token。"
  },
  {
    "case_id": 1002,
    "suite_name": "用户登录功能测试套件",
    "case_name": "验证错误密码登录失败",
    "start_time": "2026-05-09T10:01:00",
    "end_time": "2026-05-09T10:01:08",
    "status_code": 1,
    "status_desc": "系统返回 401 Unauthorized，提示密码错误。"
  },
  {
    "case_id": 1003,
    "suite_name": "支付流程测试套件",
    "case_name": "信用卡支付成功场景",
    "start_time": "2026-05-09T11:30:00",
    "end_time": "2026-05-09T11:30:45",
    "status_code": 1,
    "status_desc": "支付请求成功，订单状态更新为已支付，第三方回调验证通过。"
  },
  {
    "case_id": 1004,
    "suite_name": "支付流程测试套件",
    "case_name": "余额不足支付失败",
    "start_time": "2026-05-09T11:32:00",
    "end_time": "2026-05-09T11:32:12",
    "status_code": 2,
    "status_desc": "系统返回错误码 PAY_INSUFFICIENT_BALANCE，订单状态保持待支付。"
  },
  {
    "case_id": 1005,
    "suite_name": "API性能基准测试",
    "case_name": "GET /api/v1/users 并发100",
    "start_time": "2026-05-09T14:00:00",
    "end_time": "2026-05-09T14:05:00",
    "status_code": 1,
    "status_desc": "平均响应时间 120ms，P99 < 300ms，无错误请求。"
  },
  {
    "case_id": 1006,
    "suite_name": "数据库迁移验证套件",
    "case_name": "v2.3 数据表结构一致性检查",
    "start_time": "2026-05-09T15:20:00",
    "end_time": "2026-05-09T15:20:30",
    "status_code": 2,
    "status_desc": "发现字段 'user_profile.extra_data' 类型不匹配：预期 JSONB，实际 TEXT。"
  },
  {
    "case_id": 1007,
    "suite_name": "安全扫描套件",
    "case_name": "SQL注入漏洞探测",
    "start_time": "2026-05-09T16:00:00",
    "end_time": "2026-05-09T16:02:00",
    "status_code": 1,
    "status_desc": "所有注入点均被 WAF 拦截或参数化查询防护，未发现漏洞。"
  },
  {
    "case_id": 1008,
    "suite_name": "定时任务测试套件",
    "case_name": "每日数据汇总任务执行",
    "start_time": "2026-05-10T02:00:00",
    "end_time": "2026-05-10T02:00:00",
    "status_code": 0,
    "status_desc": "任务尚未开始执行（计划任务）。"
  },
  {
    "case_id": 1009,
    "suite_name": "文件上传功能测试",
    "case_name": "上传10MB PDF文件",
    "start_time": "2026-05-10T09:15:00",
    "end_time": "2026-05-10T09:15:25",
    "status_code": 1,
    "status_desc": "文件成功上传至对象存储，元数据写入数据库，返回访问URL。"
  },
  {
    "case_id": 1010,
    "suite_name": "多语言UI测试套件",
    "case_name": "日文界面按钮文本校验",
    "start_time": "2026-05-10T10:30:00",
    "end_time": "2026-05-10T10:30:18",
    "status_code": 2,
    "status_desc": "按钮 '保存' 显示为 'セーブ'，但需求文档要求为 '保存する'，存在翻译偏差。"
  }
]};
