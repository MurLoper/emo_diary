import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTheme } from '../App';
import { ArrowLeft, Image as ImageIcon, X, Sparkles, Save } from 'lucide-react';

export default function CreateDiary({ onBack }: { onBack: () => void }) {
  const { theme, diaries, setDiaries, userPoints, setUserPoints } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAIPolish, setShowAIPolish] = useState(false);

  const tagCategories = {
    mood: ['开心', '快乐', '幸福', '满足', 'emo', '低落', '焦虑', '平静', '激动', '感动'],
    activity: ['日常', '美食', '旅行', '运动', '学习', '工作', '阅读', '看剧', '购物'],
    social: ['好友', '家人', '恋人', '独处', '聚会', '约会'],
    weather: ['晴天', '雨天', '阴天', '雪天', '多云'],
  };

  const mockImages = [
    'https://images.unsplash.com/photo-1654281436853-fc0f3fe2d4e2?w=400',
    'https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?w=400',
    'https://images.unsplash.com/photo-1596748401458-0df74b2baf9b?w=400',
  ];

  const handleAddImage = () => {
    if (images.length < 9) {
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      setImages([...images, randomImage]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAIPolish = () => {
    if (userPoints >= 10 && content) {
      setShowAIPolish(true);
      setTimeout(() => {
        setContent(content + '\n\n（AI优化后的版本）这是一个充满温馨与欢笑的时刻，每一帧都值得珍藏。');
        setUserPoints(userPoints - 10);
        setShowAIPolish(false);
      }, 1500);
    }
  };

  const handleSave = () => {
    if (!title || !content) {
      return;
    }

    const newDiary = {
      id: Date.now(),
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      tags: selectedTags,
      images,
    };

    setDiaries([newDiary, ...diaries]);
    setUserPoints(userPoints + 5);
    onBack();
  };

  return (
    <div className="flex flex-col h-full">
      {/* 头部 - 固定 */}
      <div 
        className="px-6 pt-12 pb-4 flex-shrink-0"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeft size={24} style={{ color: theme.colors.textPrimary }} />
          </button>
          <h1 className="text-xl">写日记</h1>
          <button
            onClick={handleSave}
            disabled={!title || !content}
            className="px-4 py-2 rounded-lg transition-opacity"
            style={{
              backgroundColor: theme.colors.primary,
              color: '#FFFFFF',
              opacity: !title || !content ? 0.5 : 1,
            }}
          >
            <Save size={20} />
          </button>
        </div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* 标题输入 */}
        <div>
          <input
            type="text"
            placeholder="给这一天起个标题..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl outline-none bg-transparent"
            style={{ color: theme.colors.textPrimary }}
          />
        </div>

        {/* 日期 */}
        <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
          {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>

        {/* 图片上传 */}
        <div>
          <h3 className="mb-3">添加照片 ({images.length}/9)</h3>
          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                <ImageWithFallback
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
            {images.length < 9 && (
              <button
                onClick={handleAddImage}
                className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:border-current"
                style={{ 
                  borderColor: theme.colors.border,
                  color: theme.colors.textSecondary 
                }}
              >
                <ImageIcon size={24} />
                <span className="text-xs">添加</span>
              </button>
            )}
          </div>
        </div>

        {/* 内容输入 */}
        <div>
          <textarea
            placeholder="记录此刻的心情..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[200px] outline-none bg-transparent resize-none"
            style={{ color: theme.colors.textPrimary }}
          />
        </div>

        {/* AI润色 */}
        <button
          onClick={handleAIPolish}
          disabled={!content || userPoints < 10 || showAIPolish}
          className="w-full p-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          style={{ 
            backgroundColor: `${theme.colors.accent}20`,
            color: theme.colors.accent 
          }}
        >
          <Sparkles size={20} />
          <span>{showAIPolish ? 'AI润色中...' : `AI润色 (消耗10积分)`}</span>
        </button>

        {/* 标签选择 */}
        <div>
          <h3 className="mb-3">选择标签</h3>
          {Object.entries(tagCategories).map(([category, tags]) => (
            <div key={category} className="mb-4">
              <h4 className="text-sm mb-2" style={{ color: theme.colors.textSecondary }}>
                {category === 'mood' ? '心情' : category === 'activity' ? '活动' : category === 'social' ? '社交' : '天气'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="px-3 py-1.5 rounded-full text-sm transition-all"
                    style={{
                      backgroundColor: selectedTags.includes(tag) ? theme.colors.primary : theme.colors.surface,
                      color: selectedTags.includes(tag) ? '#FFFFFF' : theme.colors.textPrimary,
                      border: `1px solid ${selectedTags.includes(tag) ? theme.colors.primary : theme.colors.border}`,
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 草稿提示 */}
        <div 
          className="text-center text-sm py-4"
          style={{ color: theme.colors.textSecondary }}
        >
          内容会自动保存为草稿
        </div>
      </div>
    </div>
  );
}
