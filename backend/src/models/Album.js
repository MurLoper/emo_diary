const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  template: {
    type: String,
    enum: ['classic', 'magazine', 'timeline', 'minimal', 'collage', 'polaroid'],
    default: 'classic'
  },
  diaryIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Diary'
  }],
  cover: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  diaryCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 创建复合索引
albumSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Album', albumSchema);
