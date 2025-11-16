import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTheme } from '../App';
import { ArrowLeft, Check, Sparkles, Maximize2 } from 'lucide-react';
import TemplateGallery from './TemplateGallery';

export default function CreateAlbum({ onBack }: { onBack: () => void }) {
  const { theme, diaries, albums, setAlbums, userPoints, setUserPoints } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDiaries, setSelectedDiaries] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);

  const templates = [
    {
      id: 'classic',
      name: '经典网格',
      description: '简洁大方的网格布局，图文并茂',
      preview: 'https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?w=400',
      features: ['网格布局', '图片优先', '均衡展示'],
      suggestedFor: '日常生活记录、旅行游记',
      color: '#FF6B9D',
    },
    {
      id: 'magazine',
      name: '杂志风格',
      description: '时尚大气的杂志排版，突出视觉',
      preview: 'https://images.unsplash.com/photo-1654281436853-fc0f3fe2d4e2?w=400',
      features: ['大图封面', '标题醒目', '艺术感强'],
      suggestedFor: '摄影作品集、美食日记',
      color: '#9B59B6',
    },
    {
      id: 'timeline',
      name: '时间线',
      description: '按时间顺序展示，讲述故事',
      preview: 'https://images.unsplash.com/photo-1596748401458-0df74b2baf9b?w=400',
      features: ['时间轴', '故事性强', '顺序清晰'],
      suggestedFor: '成长记录、项目进展',
      color: '#3498DB',
    },
    {
      id: 'minimal',
      name: '极简主义',
      description: '留白美学，突出核心内容',
      preview: 'https://images.unsplash.com/photo-1674880809857-1883c95ef06a?w=400',
      features: ['大量留白', '聚焦内容', '优雅简约'],
      suggestedFor: '心情日记、读书笔记',
      color: '#2ECC71',
    },
    {
      id: 'collage',
      name: '拼贴画册',
      description: '多图拼贴，充满活力和创意',
      preview: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400',
      features: ['多图展示', '灵活布局', '创意十足'],
      suggestedFor: '活动回顾、聚会记录',
      color: '#F39C12',
    },
    {
      id: 'polaroid',
      name: '宝丽来相册',
      description: '复古拍立得风格，怀旧温馨',
      preview: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      features: ['复古风格', '手写标注', '温暖怀旧'],
      suggestedFor: '童年回忆、家庭相册',
      color: '#E74C3C',
    },
  ];

  const toggleDiary = (id: number) => {
    if (selectedDiaries.includes(id)) {
      setSelectedDiaries(selectedDiaries.filter((i) => i !== id));
    } else {
      setSelectedDiaries([...selectedDiaries, id]);
    }
  };

  const handleCreate = () => {
    if (!title || selectedDiaries.length === 0) return;

    const selectedDiaryObjects = diaries.filter((d) => selectedDiaries.includes(d.id));
    const coverImage = selectedDiaryObjects.find((d) => d.images && d.images.length > 0)?.images[0] || 
                       'https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?w=800';
    
    const allTags = [...new Set(selectedDiaryObjects.flatMap((d) => d.tags))];

    const newAlbum = {
      id: Date.now(),
      title,
      description: description || '精选日记合集',
      date: new Date().toISOString().split('T')[0],
      cover: coverImage,
      diaryCount: selectedDiaries.length,
      tags: allTags.slice(0, 3),
      template: selectedTemplate,
      diaryIds: selectedDiaries,
    };

    setAlbums([newAlbum, ...albums]);
    setUserPoints(userPoints + 20);
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
          <h1 className="text-xl">创建图文集</h1>
          <button
            onClick={handleCreate}
            disabled={!title || selectedDiaries.length === 0}
            className="px-4 py-2 rounded-lg transition-opacity"
            style={{
              backgroundColor: theme.colors.primary,
              color: '#FFFFFF',
              opacity: !title || selectedDiaries.length === 0 ? 0.5 : 1,
            }}
          >
            创建
          </button>
        </div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* 基本信息 */}
        <div>
          <label className="block mb-2">图文集标题</label>
          <input
            type="text"
            placeholder="给图文集起个名字..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl outline-none"
            style={{ 
              backgroundColor: theme.colors.surface,
              color: theme.colors.textPrimary,
              border: `1px solid ${theme.colors.border}`
            }}
          />
        </div>

        <div>
          <label className="block mb-2">描述（可选）</label>
          <textarea
            placeholder="添加一些描述..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl outline-none resize-none h-24"
            style={{ 
              backgroundColor: theme.colors.surface,
              color: theme.colors.textPrimary,
              border: `1px solid ${theme.colors.border}`
            }}
          />
        </div>

        {/* 选择模板 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>选择模板风格</h3>
            <button
              onClick={() => setShowTemplateGallery(true)}
              className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm"
              style={{ 
                backgroundColor: theme.colors.surface,
                color: theme.colors.primary
              }}
            >
              <Maximize2 size={14} />
              <span>查看全部</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className="relative rounded-xl overflow-hidden cursor-pointer transition-all"
                style={{
                  border: `2px solid ${selectedTemplate === template.id ? template.color : theme.colors.border}`,
                  transform: selectedTemplate === template.id ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: selectedTemplate === template.id ? '0 6px 20px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {selectedTemplate === template.id && (
                    <div 
                      className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: template.color }}
                    >
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                  {/* 模板名称覆盖在图片上 */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-white text-sm mb-1">{template.name}</div>
                  </div>
                </div>
                <div className="p-3" style={{ 
                  background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${template.color}08 100%)`
                }}>
                  <div className="text-xs mb-2" style={{ color: theme.colors.textSecondary }}>
                    {template.description}
                  </div>
                  {/* 特性标签 */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ 
                          backgroundColor: `${template.color}15`,
                          color: template.color
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  {/* 推荐用途 */}
                  <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                    💡 {template.suggestedFor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 选择日记 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>选择日记</h3>
            <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
              已选 {selectedDiaries.length}/{diaries.length}
            </span>
          </div>
          <div className="space-y-2">
            {diaries.map((diary) => (
              <div
                key={diary.id}
                onClick={() => toggleDiary(diary.id)}
                className="p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.primary}${selectedDiaries.includes(diary.id) ? '15' : '05'} 100%)`,
                  border: `2px solid ${selectedDiaries.includes(diary.id) ? theme.colors.primary : theme.colors.border}`,
                  boxShadow: selectedDiaries.includes(diary.id) ? '0 4px 12px rgba(0,0,0,0.08)' : '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor: selectedDiaries.includes(diary.id) ? theme.colors.primary : theme.colors.border,
                    }}
                  >
                    {selectedDiaries.includes(diary.id) && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>
                  {diary.images && diary.images.length > 0 && (
                    <ImageWithFallback
                      src={diary.images[0]}
                      alt={diary.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 truncate">{diary.title}</h4>
                    <p className="text-sm mb-2 line-clamp-2" style={{ color: theme.colors.textSecondary }}>
                      {diary.content}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {diary.tags.slice(0, 3).map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: `${theme.colors.primary}15`,
                            color: theme.colors.primary,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI推荐提示 */}
        <div 
          className="p-4 rounded-xl flex items-start gap-3"
          style={{ backgroundColor: `${theme.colors.accent}15` }}
        >
          <Sparkles size={20} style={{ color: theme.colors.accent }} />
          <div>
            <div className="mb-1" style={{ color: theme.colors.accent }}>AI智能推荐</div>
            <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
              系统可以根据标签和内容自动推荐相似的日记组合
            </div>
          </div>
        </div>
      </div>

      {/* 模板画廊弹窗 */}
      {showTemplateGallery && (
        <TemplateGallery
          onSelectTemplate={(templateId) => {
            setSelectedTemplate(templateId);
            setShowTemplateGallery(false);
          }}
          onClose={() => setShowTemplateGallery(false)}
        />
      )}
    </div>
  );
}
