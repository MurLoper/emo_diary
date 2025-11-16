const Diary = require('../models/Diary');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * 日记控制器
 */

/**
 * 获取日记列表
 */
exports.getDiaries = async (req, res, next) => {
  try {
    const userId = req.userId;
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      tag,
      startDate,
      endDate,
      search
    } = req.query;

    // 构建查询条件
    const query = { userId };

    // 标签筛选
    if (tag && tag !== '全部') {
      query.tags = tag;
    }

    // 日期范围筛选
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // 搜索
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // 分页查询
    const skip = (page - 1) * limit;
    const diaries = await Diary.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Diary.countDocuments(query);

    return successResponse(res, {
      diaries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取单条日记
 */
exports.getDiary = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const diary = await Diary.findOne({ _id: id, userId });

    if (!diary) {
      return errorResponse(res, '日记不存在', 404);
    }

    return successResponse(res, diary);
  } catch (error) {
    next(error);
  }
};

/**
 * 创建日记
 */
exports.createDiary = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { title, content, images, tags, location, weather, mood } = req.body;

    // 验证必填字段
    if (!content) {
      return errorResponse(res, '日记内容不能为空', 400);
    }

    // 创建日记
    const diary = await Diary.create({
      userId,
      title,
      content,
      images: images || [],
      tags: tags || [],
      location,
      weather,
      mood
    });

    // 更新用户日记数量
    await User.findByIdAndUpdate(userId, {
      $inc: { diaryCount: 1 }
    });

    return successResponse(res, diary, '日记创建成功', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新日记
 */
exports.updateDiary = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, content, images, tags, location, weather, mood } = req.body;

    const diary = await Diary.findOne({ _id: id, userId });

    if (!diary) {
      return errorResponse(res, '日记不存在', 404);
    }

    // 更新字段
    if (title !== undefined) diary.title = title;
    if (content !== undefined) diary.content = content;
    if (images !== undefined) diary.images = images;
    if (tags !== undefined) diary.tags = tags;
    if (location !== undefined) diary.location = location;
    if (weather !== undefined) diary.weather = weather;
    if (mood !== undefined) diary.mood = mood;

    await diary.save();

    return successResponse(res, diary, '日记更新成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 删除日记
 */
exports.deleteDiary = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const diary = await Diary.findOne({ _id: id, userId });

    if (!diary) {
      return errorResponse(res, '日记不存在', 404);
    }

    await diary.deleteOne();

    // 更新用户日记数量
    await User.findByIdAndUpdate(userId, {
      $inc: { diaryCount: -1 }
    });

    return successResponse(res, null, '日记删除成功');
  } catch (error) {
    next(error);
  }
};

/**
 * AI 润色日记
 */
exports.polishDiary = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return errorResponse(res, '内容不能为空', 400);
    }

    // TODO: 集成AI服务进行内容润色
    // 目前返回模拟数据
    const polishedContent = `${content}\n\n（AI润色功能开发中，当前为演示模式）`;

    return successResponse(res, {
      original: content,
      polished: polishedContent
    }, '润色完成');
  } catch (error) {
    next(error);
  }
};

/**
 * 获取日记统计
 */
exports.getDiaryStats = async (req, res, next) => {
  try {
    const userId = req.userId;

    const total = await Diary.countDocuments({ userId });

    // 本月日记数
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonth = await Diary.countDocuments({
      userId,
      createdAt: { $gte: startOfMonth }
    });

    // 连续记录天数
    const allDiaries = await Diary.find({ userId })
      .sort({ createdAt: -1 })
      .select('createdAt');

    let continuousDays = 0;
    let lastDate = null;

    for (const diary of allDiaries) {
      const diaryDate = new Date(diary.createdAt);
      diaryDate.setHours(0, 0, 0, 0);

      if (!lastDate) {
        lastDate = diaryDate;
        continuousDays = 1;
      } else {
        const diffDays = Math.floor((lastDate - diaryDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          continuousDays++;
          lastDate = diaryDate;
        } else if (diffDays > 1) {
          break;
        }
      }
    }

    return successResponse(res, {
      total,
      thisMonth,
      continuousDays
    });
  } catch (error) {
    next(error);
  }
};
