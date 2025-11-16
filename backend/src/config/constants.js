/**
 * 常量定义
 */

// 积分获取规则
const POINTS_RULES = {
  CHECKIN: 10,              // 每日签到
  CREATE_DIARY: 5,          // 创建日记
  CREATE_ALBUM: 20,         // 创建图文集
  SHARE_DIARY: 10,          // 分享日记
  INVITE_FRIEND: 100,       // 邀请好友
  COMPLETE_TUTORIAL: 50,    // 完成新手教程
};

// 积分消费
const POINTS_COST = {
  PREMIUM_THEME: 500,       // 高级主题
  ALBUM_TEMPLATE: 200,      // 图文集模板
  EXPORT_PDF: 50,           // 导出PDF
  AI_POLISH: 10,            // AI润色（每次）
};

// 签到奖励规则
const CHECKIN_BONUS = {
  7: 20,                    // 连续7天额外奖励
  30: 100,                  // 连续30天额外奖励
  100: 500,                 // 连续100天额外奖励
};

// 签到解锁主题
const CHECKIN_THEME_UNLOCK = {
  'spring-festival': 7,     // 春节主题需连续签到7天
  'mid-autumn': 15,         // 中秋主题需连续签到15天
  'anniversary': 100,       // 周年主题需连续签到100天
};

// 标签分类
const TAG_CATEGORIES = {
  mood: ['开心', '快乐', '幸福', '满足', 'emo', '低落', '焦虑', '平静', '激动', '感动'],
  activity: ['日常', '美食', '旅行', '运动', '学习', '工作', '阅读', '看剧', '购物'],
  social: ['好友', '家人', '恋人', '独处', '聚会', '约会'],
  special: ['纪念日', '节日', '生日', '第一次', '告别', '重逢'],
  weather: ['晴天', '雨天', '阴天', '雪天', '多云'],
};

// 图文集模板
const ALBUM_TEMPLATES = {
  classic: {
    name: '经典简约',
    layout: 'grid',
    imageRatio: '1:1',
    textPosition: 'bottom',
  },
  magazine: {
    name: '杂志风格',
    layout: 'masonry',
    imageRatio: 'auto',
    textPosition: 'overlay',
  },
  timeline: {
    name: '时间线',
    layout: 'vertical',
    imageRatio: '16:9',
    textPosition: 'right',
  },
  minimal: {
    name: '极简主义',
    layout: 'single',
    imageRatio: '3:4',
    textPosition: 'separate',
  },
};

// 错误码
const ERROR_CODES = {
  // 通用错误 1xxx
  INTERNAL_ERROR: 1000,
  INVALID_PARAMS: 1001,
  NOT_FOUND: 1002,
  UNAUTHORIZED: 1003,
  FORBIDDEN: 1004,

  // 用户相关 2xxx
  USER_NOT_FOUND: 2001,
  USER_BANNED: 2002,
  INSUFFICIENT_POINTS: 2003,

  // 主题相关 3xxx
  THEME_NOT_FOUND: 3001,
  THEME_ALREADY_OWNED: 3002,
  THEME_NOT_OWNED: 3003,
  THEME_UNLOCK_FAILED: 3004,

  // 日记相关 4xxx
  DIARY_NOT_FOUND: 4001,
  DIARY_CREATE_FAILED: 4002,

  // 图文集相关 5xxx
  ALBUM_NOT_FOUND: 5001,
  ALBUM_CREATE_FAILED: 5002,

  // 文件上传相关 6xxx
  FILE_TOO_LARGE: 6001,
  INVALID_FILE_TYPE: 6002,
  UPLOAD_FAILED: 6003,
};

module.exports = {
  POINTS_RULES,
  POINTS_COST,
  CHECKIN_BONUS,
  CHECKIN_THEME_UNLOCK,
  TAG_CATEGORIES,
  ALBUM_TEMPLATES,
  ERROR_CODES,
};
