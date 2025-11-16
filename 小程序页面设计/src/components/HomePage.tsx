import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTheme } from '../App';
import { ChevronLeft, ChevronRight, TrendingUp, BookOpen, Image as ImageIcon, Sparkles, Palette } from 'lucide-react';

export default function HomePage() {
  const { theme, diaries, albums, userPoints, continuousDays, setCurrentPage } = useTheme();
  const [bannerIndex, setBannerIndex] = useState(0);

  const banners = [
    {
      id: 1,
      title: '记录美好瞬间',
      subtitle: '用心晴日记记录每一个精彩时刻',
      image: 'https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0ZWwlMjBkaWFyeSUyMG5vdGVib29rfGVufDF8fHx8MTc2MzE3NjkwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      title: '主题随心换',
      subtitle: '12+精美主题，打造专属风格',
      image: 'https://images.unsplash.com/photo-1654281436853-fc0f3fe2d4e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwYWVzdGhldGljJTIwZmxvd2Vyc3xlbnwxfHx8fDE3NjMxNTI4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      title: 'AI智能润色',
      subtitle: '让你的文字更加精彩动人',
      image: 'https://images.unsplash.com/photo-1596748401458-0df74b2baf9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwam91cm5hbGluZ3xlbnwxfHx8fDE3NjMxNzY5MDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];



  const nextBanner = () => {
    setBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* 头部 */}
      <div 
        className="px-6 pt-12 pb-6"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <h1 className="text-2xl mb-2">心晴日记</h1>
        <p style={{ color: theme.colors.textSecondary }}>记录生活，感受美好</p>
      </div>

      {/* Banner轮播 */}
      <div className="px-6 py-6">
        <div 
          className="relative rounded-2xl overflow-hidden shadow-lg"
          style={{ backgroundColor: theme.colors.surface }}
        >
          <div className="relative h-48">
            <ImageWithFallback
              src={banners[bannerIndex].image}
              alt={banners[bannerIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
              <h2 className="text-white text-xl mb-1">{banners[bannerIndex].title}</h2>
              <p className="text-white/90 text-sm">{banners[bannerIndex].subtitle}</p>
            </div>
          </div>

          {/* 轮播控制 */}
          <button
            onClick={prevBanner}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center"
            style={{ color: theme.colors.primary }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center"
            style={{ color: theme.colors.primary }}
          >
            <ChevronRight size={20} />
          </button>

          {/* 指示器 */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  backgroundColor: index === bannerIndex ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 主题商店快捷入口 */}
      <div className="px-6 py-4">
        <div 
          className="p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-transform active:scale-98"
          style={{ 
            background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.primary}10 100%)`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}
          onClick={() => setCurrentPage('theme')}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${theme.colors.primary}20` }}
            >
              <Palette size={24} style={{ color: theme.colors.primary }} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{userPoints} 积分</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${theme.colors.accent}20`, color: theme.colors.accent }}>
                  连签{continuousDays}天
                </span>
              </div>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                主题商店 · 解锁更多精美主题
              </p>
            </div>
          </div>
          <ChevronRight size={20} style={{ color: theme.colors.textSecondary }} />
        </div>
      </div>

      {/* 快捷功能 */}
      <div className="px-6 py-4">
        <h3 className="mb-4">快捷功能</h3>
        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => setCurrentPage('create')}>
            <QuickActionCard
              icon={<BookOpen size={32} />}
              title="写日记"
              description={`已有${diaries.length}篇日记`}
              color={theme.colors.primary}
            />
          </div>
          <div onClick={() => setCurrentPage('album')}>
            <QuickActionCard
              icon={<ImageIcon size={32} />}
              title="创建图文集"
              description={`已创建${albums.length}个图文集`}
              color={theme.colors.secondary}
            />
          </div>
        </div>
      </div>

      {/* 最近日记 */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3>最近日记</h3>
          <span className="text-sm" style={{ color: theme.colors.textSecondary }}>查看全部</span>
        </div>
        <div className="space-y-3">
          {diaries.slice(0, 3).map((diary) => (
            <div
              key={diary.id}
              className="p-4 rounded-xl"
              style={{ 
                background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.secondary}08 100%)`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <div className="flex items-start gap-3">
                {diary.images && diary.images.length > 0 && (
                  <ImageWithFallback
                    src={diary.images[0]}
                    alt={diary.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="mb-1">{diary.title}</h4>
                  <p 
                    className="text-sm mb-2 line-clamp-2"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {diary.content}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {diary.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded"
                        style={{
                          backgroundColor: `${theme.colors.primary}20`,
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
    </div>
  );
}

function QuickActionCard({ icon, title, description, color }: any) {
  const { theme } = useTheme();
  
  return (
    <div
      className="p-4 rounded-xl cursor-pointer transition-transform hover:scale-105 active:scale-95"
      style={{ 
        background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${color}08 100%)`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
      }}
    >
      <div 
        className="w-12 h-12 rounded-full mb-3 flex items-center justify-center"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <h4 className="mb-1">{title}</h4>
      <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
        {description}
      </p>
    </div>
  );
}
