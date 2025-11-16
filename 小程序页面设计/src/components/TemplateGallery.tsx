import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTheme } from '../App';
import { ArrowLeft, Check, Star, Sparkles, X, Eye } from 'lucide-react';

export default function TemplateGallery({ onSelectTemplate, onClose }: { onSelectTemplate: (templateId: string) => void; onClose: () => void }) {
  const { theme } = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  const templates = [
    {
      id: 'classic',
      name: '经典网格',
      description: '简洁大方的网格布局，图文并茂',
      preview: 'https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?w=400',
      features: ['网格布局', '图片优先', '均衡展示'],
      suggestedFor: '日常生活记录、旅行游记',
      color: '#FF6B9D',
      popularity: 5,
      detailedDescription: '经典网格布局采用标准的网格系统，每个日记条目占据相同的空间，图片和文字比例均衡。这种布局最适合包含大量照片的图文集，能够让读者一眼看到所有内容的全貌。',
      examples: [
        '旅行日记：展示各地风景照片',
        '美食探店：记录每家餐厅的招牌菜',
        '日常穿搭：分享每日搭配心得',
      ],
    },
    {
      id: 'magazine',
      name: '杂志风格',
      description: '时尚大气的杂志排版，突出视觉',
      preview: 'https://images.unsplash.com/photo-1654281436853-fc0f3fe2d4e2?w=400',
      features: ['大图封面', '标题醒目', '艺术感强'],
      suggestedFor: '摄影作品集、美食日记',
      color: '#9B59B6',
      popularity: 4,
      detailedDescription: '杂志风格模板采用非对称布局，大标题和大图片是核心元素。文字排版参考时尚杂志的设计风格，注重视觉冲击力和艺术感。适合展示高质量的摄影作品。',
      examples: [
        '个人摄影集：展示精心拍摄的作品',
        '高端美食：记录米其林餐厅体验',
        '时尚穿搭：展示精致的造型照',
      ],
    },
    {
      id: 'timeline',
      name: '时间线',
      description: '按时间顺序展示，讲述故事',
      preview: 'https://images.unsplash.com/photo-1596748401458-0df74b2baf9b?w=400',
      features: ['时间轴', '故事性强', '顺序清晰'],
      suggestedFor: '成长记录、项目进展',
      color: '#3498DB',
      popularity: 5,
      detailedDescription: '时间线模板以时间为主线，每个日记条目都标注了明确的时间点，非常适合记录事件发展过程或个人成长历程。时间轴会自动按照日期排序，呈现清晰的时间脉络。',
      examples: [
        '宝宝成长日记：记录孩子每个重要时刻',
        '项目开发日志：追踪项目从开始到完成',
        '健身打卡：记录每天的训练进度',
      ],
    },
    {
      id: 'minimal',
      name: '极简主义',
      description: '留白美学，突出核心内容',
      preview: 'https://images.unsplash.com/photo-1674880809857-1883c95ef06a?w=400',
      features: ['大量留白', '聚焦内容', '优雅简约'],
      suggestedFor: '心情日记、读书笔记',
      color: '#2ECC71',
      popularity: 4,
      detailedDescription: '极简主义模板遵循"少即是多"的设计理念，大量留白让视觉更加舒适，内容更加聚焦。每一页只展示核心信息，去除一切多余元素。适合文字为主的内容。',
      examples: [
        '心情日记：记录每日感悟',
        '读书笔记：整理阅读心得',
        '诗歌散文：展示文学作品',
      ],
    },
    {
      id: 'collage',
      name: '拼贴画册',
      description: '多图拼贴，充满活力和创意',
      preview: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400',
      features: ['多图展示', '灵活布局', '创意十足'],
      suggestedFor: '活动回顾、聚会记录',
      color: '#F39C12',
      popularity: 4,
      detailedDescription: '拼贴画册模板允许在一页中展示多张照片，采用灵活的拼贴布局，照片大小可以不同，营造出活泼、充满活力的视觉效果。非常适合记录热闹的活动场景。',
      examples: [
        '生日派对：展示派对现场的多个精彩瞬间',
        '旅行vlog：拼贴一天中的各种见闻',
        '活动回顾：记录公司团建的照片',
      ],
    },
    {
      id: 'polaroid',
      name: '宝丽来相册',
      description: '复古拍立得风格，怀旧温馨',
      preview: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      features: ['复古风格', '手写标注', '温暖怀旧'],
      suggestedFor: '童年回忆、家庭相册',
      color: '#E74C3C',
      popularity: 5,
      detailedDescription: '宝丽来相册模板模仿经典拍立得照片的外观，每张照片都带有白色边框，下方可以添加手写风格的标注。整体风格复古温馨，充满怀旧气息，让人想起美好的旧时光。',
      examples: [
        '童年回忆：整理儿时的老照片',
        '家庭相册：记录家人相聚的温馨时刻',
        '恋爱日记：保存两人的甜蜜瞬间',
      ],
    },
  ];

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-t-3xl overflow-hidden animate-slide-up flex flex-col"
        style={{ 
          background: theme.colors.background,
          maxHeight: '90vh',
        }}
      >
        {/* 头部 */}
        <div className="flex-shrink-0 backdrop-blur-lg" style={{ backgroundColor: `${theme.colors.surface}F0` }}>
          <div className="flex justify-center pt-4 pb-2">
            <div 
              className="w-12 h-1 rounded-full"
              style={{ backgroundColor: theme.colors.border }}
            />
          </div>
          <div className="px-6 pb-4 flex items-center justify-between">
            <h2 className="text-2xl">选择模板</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-black/5"
            >
              <X size={24} style={{ color: theme.colors.textSecondary }} />
            </button>
          </div>
        </div>

        {/* 模板列表 */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setPreviewTemplate(template);
                }}
                className="relative rounded-2xl overflow-hidden cursor-pointer transition-all"
                style={{
                  border: `2px solid ${selectedTemplate === template.id ? template.color : theme.colors.border}`,
                  background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${template.color}08 100%)`,
                  boxShadow: selectedTemplate === template.id ? '0 6px 20px rgba(0,0,0,0.12)' : '0 3px 10px rgba(0,0,0,0.06)',
                }}
              >
                <div className="flex gap-4 p-4">
                  {/* 预览图 */}
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={template.preview}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedTemplate === template.id && (
                      <div 
                        className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: template.color }}
                      >
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* 信息 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg">{template.name}</h3>
                      <div className="flex gap-0.5">
                        {Array.from({ length: template.popularity }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            fill={template.color}
                            style={{ color: template.color }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mb-3" style={{ color: theme.colors.textSecondary }}>
                      {template.description}
                    </p>
                    {/* 特性 */}
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-1 rounded"
                          style={{ 
                            backgroundColor: `${template.color}15`,
                            color: template.color
                          }}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 展开的详细信息 */}
                {selectedTemplate === template.id && (
                  <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: theme.colors.border, paddingTop: '1rem' }}>
                    <div>
                      <h4 className="text-sm mb-2" style={{ color: template.color }}>
                        <Sparkles size={14} className="inline mr-1" />
                        模板特点
                      </h4>
                      <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                        {template.detailedDescription}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm mb-2" style={{ color: template.color }}>
                        💡 适用场景
                      </h4>
                      <ul className="text-sm space-y-1" style={{ color: theme.colors.textSecondary }}>
                        {template.examples.map((example, idx) => (
                          <li key={idx}>• {example}</li>
                        ))}
                      </ul>
                    </div>
                    {/* 预览按钮 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate(template);
                      }}
                      className="w-full py-2 rounded-lg flex items-center justify-center gap-2"
                      style={{ 
                        backgroundColor: `${template.color}20`,
                        color: template.color
                      }}
                    >
                      <Eye size={16} />
                      <span>查看模板效果</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 底部确认按钮 */}
        <div 
          className="flex-shrink-0 backdrop-blur-lg border-t"
          style={{ 
            backgroundColor: `${theme.colors.surface}F0`,
            borderColor: theme.colors.border,
            padding: '24px',
            paddingBottom: '80px',
          }}
        >
          <button
            onClick={handleConfirm}
            disabled={!selectedTemplate}
            className="w-full py-4 rounded-xl transition-opacity text-center"
            style={{
              backgroundColor: selectedTemplate ? (templates.find(t => t.id === selectedTemplate)?.color || theme.colors.primary) : theme.colors.border,
              color: '#FFFFFF',
              opacity: selectedTemplate ? 1 : 0.5,
            }}
          >
            {selectedTemplate ? `使用 ${templates.find(t => t.id === selectedTemplate)?.name}` : '请选择一个模板'}
          </button>
        </div>
      </div>

      {/* 模板预览弹窗 */}
      {previewTemplate && (
        <TemplatePreview 
          template={previewTemplate} 
          onClose={() => setPreviewTemplate(null)} 
        />
      )}
    </div>
  );
}

// 模板预览组件
function TemplatePreview({ template, onClose }: { template: any; onClose: () => void }) {
  const { theme } = useTheme();

  // 模拟数据
  const mockDiaries = [
    {
      title: '美好的一天',
      date: '2025-03-15',
      content: '今天天气真好，和朋友一起去了公园，拍了很多美照。心情愉悦，感觉生活充满了阳光。',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    },
    {
      title: '咖啡时光',
      date: '2025-03-14',
      content: '在最喜欢的咖啡店度过了一个下午，读完了一本好书。',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    },
    {
      title: '夜晚的城市',
      date: '2025-03-13',
      content: '城市的夜景总是那么迷人，霓虹灯下的街道别有一番风味。',
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400',
    },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{ 
          background: theme.colors.background,
          maxHeight: '85vh',
        }}
      >
        {/* 头部 */}
        <div className="sticky top-0 z-10 backdrop-blur-lg px-6 py-4 flex items-center justify-between border-b" 
          style={{ 
            backgroundColor: `${theme.colors.surface}F5`,
            borderColor: theme.colors.border 
          }}
        >
          <div>
            <h3 className="text-lg">{template.name}</h3>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              模板预览效果
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/5"
          >
            <X size={24} style={{ color: theme.colors.textSecondary }} />
          </button>
        </div>

        {/* 预览内容 */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          <div className="p-6">
            {template.id === 'classic' && <ClassicTemplate diaries={mockDiaries} template={template} />}
            {template.id === 'magazine' && <MagazineTemplate diaries={mockDiaries} template={template} />}
            {template.id === 'timeline' && <TimelineTemplate diaries={mockDiaries} template={template} />}
            {template.id === 'minimal' && <MinimalTemplate diaries={mockDiaries} template={template} />}
            {template.id === 'collage' && <CollageTemplate diaries={mockDiaries} template={template} />}
            {template.id === 'polaroid' && <PolaroidTemplate diaries={mockDiaries} template={template} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// 经典网格模板
function ClassicTemplate({ diaries, template }: any) {
  const { theme } = useTheme();
  return (
    <div className="grid grid-cols-2 gap-3">
      {diaries.map((diary: any, idx: number) => (
        <div key={idx} className="rounded-xl overflow-hidden" style={{ 
          background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${template.color}08 100%)`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <ImageWithFallback src={diary.image} alt={diary.title} className="w-full h-32 object-cover" />
          <div className="p-3">
            <h4 className="text-sm mb-1">{diary.title}</h4>
            <p className="text-xs line-clamp-2" style={{ color: theme.colors.textSecondary }}>
              {diary.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// 杂志风格模板
function MagazineTemplate({ diaries, template }: any) {
  const { theme } = useTheme();
  return (
    <div className="space-y-6">
      {diaries.map((diary: any, idx: number) => (
        <div key={idx} className="rounded-2xl overflow-hidden" style={{ 
          background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${template.color}08 100%)`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
        }}>
          <ImageWithFallback src={diary.image} alt={diary.title} className="w-full h-48 object-cover" />
          <div className="p-4">
            <div className="text-2xl mb-2" style={{ color: template.color }}>{diary.title}</div>
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              {diary.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// 时间线模板
function TimelineTemplate({ diaries, template }: any) {
  const { theme } = useTheme();
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-0 bottom-0 w-0.5" style={{ backgroundColor: template.color }} />
      {diaries.map((diary: any, idx: number) => (
        <div key={idx} className="relative mb-6">
          <div 
            className="absolute -left-[1.875rem] top-2 w-3 h-3 rounded-full border-2"
            style={{ backgroundColor: theme.colors.background, borderColor: template.color }}
          />
          <div className="rounded-xl p-4" style={{ 
            background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${template.color}08 100%)`,
            boxShadow: '0 3px 10px rgba(0,0,0,0.06)'
          }}>
            <div className="text-xs mb-2" style={{ color: template.color }}>{diary.date}</div>
            <h4 className="mb-2">{diary.title}</h4>
            <ImageWithFallback src={diary.image} alt={diary.title} className="w-full h-32 rounded-lg object-cover mb-2" />
            <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
              {diary.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// 极简主义模板
function MinimalTemplate({ diaries, template }: any) {
  const { theme } = useTheme();
  return (
    <div className="space-y-12">
      {diaries.map((diary: any, idx: number) => (
        <div key={idx} className="text-center">
          <div className="text-xs mb-4" style={{ color: theme.colors.textSecondary }}>{diary.date}</div>
          <h4 className="text-xl mb-6">{diary.title}</h4>
          <ImageWithFallback 
            src={diary.image} 
            alt={diary.title} 
            className="w-3/4 h-40 rounded-lg object-cover mx-auto mb-6" 
          />
          <p className="text-sm max-w-xs mx-auto" style={{ color: theme.colors.textSecondary }}>
            {diary.content}
          </p>
        </div>
      ))}
    </div>
  );
}

// 拼贴画册模板
function CollageTemplate({ diaries, template }: any) {
  const { theme } = useTheme();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {diaries.map((diary: any, idx: number) => (
          <div key={idx} className="rounded-lg overflow-hidden" style={{ gridColumn: idx === 0 ? 'span 2' : 'span 1' }}>
            <ImageWithFallback 
              src={diary.image} 
              alt={diary.title} 
              className="w-full h-32 object-cover" 
            />
          </div>
        ))}
      </div>
      {diaries.map((diary: any, idx: number) => (
        <div key={idx} className="p-3 rounded-xl" style={{ backgroundColor: theme.colors.surface }}>
          <h4 className="text-sm mb-1">{diary.title}</h4>
          <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
            {diary.content}
          </p>
        </div>
      ))}
    </div>
  );
}

// 宝丽来相册模板
function PolaroidTemplate({ diaries, template }: any) {
  const { theme } = useTheme();
  return (
    <div className="space-y-6">
      {diaries.map((diary: any, idx: number) => (
        <div 
          key={idx} 
          className="p-4 rounded-lg"
          style={{ 
            backgroundColor: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: `rotate(${idx % 2 === 0 ? '2deg' : '-2deg'})`
          }}
        >
          <ImageWithFallback 
            src={diary.image} 
            alt={diary.title} 
            className="w-full h-40 object-cover mb-3" 
          />
          <div className="text-center">
            <p className="text-sm" style={{ fontFamily: 'cursive', color: '#333' }}>
              {diary.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
