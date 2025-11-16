const Album = require('../models/Album');
const Diary = require('../models/Diary');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * 创建图文集
 */
exports.createAlbum = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { title, description, template, diaryIds } = req.body;

    // 验证必需字段
    if (!title || !diaryIds || diaryIds.length === 0) {
      return errorResponse(res, '标题和日记列表不能为空', 400);
    }

    // 验证所选日记是否都属于该用户
    const diaries = await Diary.find({
      _id: { $in: diaryIds },
      userId
    });

    if (diaries.length !== diaryIds.length) {
      return errorResponse(res, '部分日记不存在或无权访问', 403);
    }

    // 提取封面图（取第一篇有图片的日记的第一张图）
    let cover = '';
    for (const diary of diaries) {
      if (diary.images && diary.images.length > 0) {
        cover = diary.images[0];
        break;
      }
    }

    // 提取所有标签
    const allTags = [];
    diaries.forEach(diary => {
      if (diary.tags && diary.tags.length > 0) {
        allTags.push(...diary.tags);
      }
    });
    const uniqueTags = [...new Set(allTags)].slice(0, 3);

    // 创建图文集
    const album = await Album.create({
      userId,
      title,
      description: description || '精选日记合集',
      template: template || 'classic',
      diaryIds,
      cover,
      tags: uniqueTags,
      diaryCount: diaryIds.length
    });

    return successResponse(res, { album }, '创建图文集成功', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取图文集列表
 */
exports.getAlbums = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const albums = await Album.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Album.countDocuments({ userId });

    return successResponse(res, {
      albums,
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
 * 获取图文集详情
 */
exports.getAlbumById = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const album = await Album.findOne({ _id: id, userId });

    if (!album) {
      return errorResponse(res, '图文集不存在', 404);
    }

    // 获取图文集中的所有日记
    const diaries = await Diary.find({
      _id: { $in: album.diaryIds },
      userId
    }).sort({ date: -1 });

    return successResponse(res, {
      album,
      diaries
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新图文集
 */
exports.updateAlbum = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { title, description, template, diaryIds } = req.body;

    const album = await Album.findOne({ _id: id, userId });

    if (!album) {
      return errorResponse(res, '图文集不存在', 404);
    }

    // 更新字段
    if (title) album.title = title;
    if (description !== undefined) album.description = description;
    if (template) album.template = template;

    if (diaryIds && diaryIds.length > 0) {
      // 验证日记是否都属于该用户
      const diaries = await Diary.find({
        _id: { $in: diaryIds },
        userId
      });

      if (diaries.length !== diaryIds.length) {
        return errorResponse(res, '部分日记不存在或无权访问', 403);
      }

      album.diaryIds = diaryIds;
      album.diaryCount = diaryIds.length;

      // 更新封面图
      let cover = '';
      for (const diary of diaries) {
        if (diary.images && diary.images.length > 0) {
          cover = diary.images[0];
          break;
        }
      }
      album.cover = cover;

      // 更新标签
      const allTags = [];
      diaries.forEach(diary => {
        if (diary.tags && diary.tags.length > 0) {
          allTags.push(...diary.tags);
        }
      });
      album.tags = [...new Set(allTags)].slice(0, 3);
    }

    await album.save();

    return successResponse(res, { album }, '更新图文集成功');
  } catch (error) {
    next(error);
  }
};

/**
 * 删除图文集
 */
exports.deleteAlbum = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const album = await Album.findOne({ _id: id, userId });

    if (!album) {
      return errorResponse(res, '图文集不存在', 404);
    }

    await album.deleteOne();

    return successResponse(res, null, '删除图文集成功');
  } catch (error) {
    next(error);
  }
};
