import React, { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTheme } from '../App';
import { Search, Filter, Calendar, ArrowUp, ArrowLeft, Tag, Clock, Cloud, Heart, X } from 'lucide-react';

export default function DiaryList() {
  const { theme, diaries } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState('全部');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const allTags = ['全部', '开心', '快乐', 'emo', '工作', '美食', '旅行', '好友', '家人'];

  const filteredDiaries = diaries.filter((diary) => {
    const matchesSearch = diary.title.includes(searchText) || diary.content.includes(searchText);
    const matchesTag = selectedTag === '全部' || diary.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setShowBackToTop(scrollContainerRef.current.scrollTop > 300);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 如果选中了日记，显示详情页
  if (selectedDiary) {
    return <DiaryDetailPage diary={selectedDiary} onBack={() => setSelectedDiary(null)} />;
  }

  return (
    <div ref={scrollContainerRef} className="h-full pb-6 overflow-y-auto">
      {/* 头部 */}
      <div 
        className="px-6 pt-12 pb-6 sticky top-0 z-20 backdrop-blur-lg"
        style={{ backgroundColor: `${theme.colors.surface}F0` }}
      >
        <h1 className="text-2xl mb-4">我的日记</h1>
        
        {/* 搜索框 */}
        <div 
          className="flex items-center gap-2 p-3 rounded-xl mb-4"
          style={{ backgroundColor: theme.colors.background }}
        >
          <Search size={20} style={{ color: theme.colors.textSecondary }} />
          <input
            type="text"
            placeholder="搜索日记..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: theme.colors.textPrimary }}
          />
        </div>

        {/* 标签筛选 */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className="px-4 py-2 rounded-full whitespace-nowrap transition-all"
              style={{
                backgroundColor: selectedTag === tag ? theme.colors.primary : theme.colors.surface,
                color: selectedTag === tag ? '#FFFFFF' : theme.colors.textPrimary,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 日记列表 */}
      <div className="px-6 pt-6 space-y-4">
        {filteredDiaries.length === 0 ? (
          <div className="text-center py-16">
            <div 
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${theme.colors.primary}20` }}
            >
              <Calendar size={40} style={{ color: theme.colors.primary }} />
            </div>
            <p style={{ color: theme.colors.textSecondary }}>还没有日记哦，快去创建吧！</p>
          </div>
        ) : (
          filteredDiaries.map((diary) => (
            <DiaryCard key={diary.id} diary={diary} onClick={() => setSelectedDiary(diary)} />
          ))
        )}
      </div>

      {/* 返回顶部按钮 */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
          style={{
            backgroundColor: theme.colors.primary,
            color: '#FFFFFF',
            zIndex: 20,
          }}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}

function DiaryCard({ diary, onClick }: any) {
  const { theme } = useTheme();

  return (
    <div
      onClick={onClick}
      className="p-5 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      style={{ 
        background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.primary}08 100%)`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
      }}
    >
      {/* 日期 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
          {diary.date}
        </span>
        <div className="flex gap-2">
          {diary.tags.slice(0, 2).map((tag: string, index: number) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded"
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

      {/* 标题 */}
      <h3 className="text-lg mb-2">{diary.title}</h3>

      {/* 内容 */}
      <p 
        className="text-sm mb-3 line-clamp-3"
        style={{ color: theme.colors.textSecondary }}
      >
        {diary.content}
      </p>

      {/* 图片网格 */}
      {diary.images && diary.images.length > 0 && (
        <div className={`grid gap-2 ${diary.images.length === 1 ? 'grid-cols-1' : diary.images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {diary.images.slice(0, 3).map((image: string, index: number) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <ImageWithFallback
                src={image}
                alt={`${diary.title} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 2 && diary.images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white">+{diary.images.length - 3}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 日记详情页
function DiaryDetailPage({ diary, onBack }: { diary: any; onBack: () => void }) {
  const { theme } = useTheme();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* 头部 - 固定 */}
      <div 
        className="px-6 pt-12 pb-4 flex-shrink-0 sticky top-0 z-10"
        style={{ backgroundColor: theme.colors.surface, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg transition-transform active:scale-95"
            style={{ color: theme.colors.textPrimary }}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl">日记详情</h2>
          <div className="w-10" />
        </div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {/* 日期和时间 */}
        <div className="flex items-center gap-4 mb-6 pt-4">
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ backgroundColor: `${theme.colors.primary}15` }}
          >
            <Calendar size={16} style={{ color: theme.colors.primary }} />
            <span style={{ color: theme.colors.primary }}>{diary.date}</span>
          </div>
          {diary.time && (
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ backgroundColor: theme.colors.surface, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}
            >
              <Clock size={16} style={{ color: theme.colors.textSecondary }} />
              <span className="text-sm" style={{ color: theme.colors.textSecondary }}>{diary.time}</span>
            </div>
          )}
        </div>

        {/* 标题 */}
        <h1 className="text-2xl mb-4" style={{ color: theme.colors.textPrimary }}>
          {diary.title}
        </h1>

        {/* 天气和心情 */}
        <div className="flex items-center gap-3 mb-6">
          {diary.weather && (
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: theme.colors.surface, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}
            >
              <Cloud size={16} style={{ color: theme.colors.textSecondary }} />
              <span className="text-sm" style={{ color: theme.colors.textSecondary }}>{diary.weather}</span>
            </div>
          )}
          {diary.mood && (
            <div 
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: theme.colors.surface, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}
            >
              <Heart size={16} style={{ color: theme.colors.primary }} />
              <span className="text-sm" style={{ color: theme.colors.textPrimary }}>{diary.mood}</span>
            </div>
          )}
        </div>

        {/* 标签 */}
        {diary.tags && diary.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {diary.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm flex items-center gap-1"
                style={{
                  backgroundColor: `${theme.colors.primary}15`,
                  color: theme.colors.primary,
                }}
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 正文内容 */}
        <div 
          className="p-6 rounded-2xl mb-6 whitespace-pre-wrap leading-relaxed"
          style={{ 
            backgroundColor: theme.colors.surface,
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            color: theme.colors.textPrimary
          }}
        >
          {diary.content}
        </div>

        {/* 图片网格 */}
        {diary.images && diary.images.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg" style={{ color: theme.colors.textPrimary }}>图片 ({diary.images.length})</h3>
            <div className="grid grid-cols-2 gap-3">
              {diary.images.map((image: string, index: number) => (
                <div 
                  key={index} 
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${diary.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 图片查看器 */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 backdrop-blur-sm transition-transform active:scale-95"
          >
            <X size={24} className="text-white" />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center p-6">
            <ImageWithFallback
              src={diary.images[selectedImageIndex]}
              alt={`${diary.title} - ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            />
            
            {/* 图片导航 */}
            {diary.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm">
                {diary.images.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(index);
                    }}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      backgroundColor: index === selectedImageIndex ? '#FFFFFF' : '#FFFFFF50',
                      transform: index === selectedImageIndex ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            )}

            {/* 左右切换按钮 */}
            {diary.images.length > 1 && (
              <>
                {selectedImageIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(selectedImageIndex - 1);
                    }}
                    className="absolute left-6 p-3 rounded-full bg-black/50 backdrop-blur-sm transition-transform active:scale-95"
                  >
                    <ArrowLeft size={24} className="text-white" />
                  </button>
                )}
                {selectedImageIndex < diary.images.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(selectedImageIndex + 1);
                    }}
                    className="absolute right-6 p-3 rounded-full bg-black/50 backdrop-blur-sm transition-transform active:scale-95"
                  >
                    <ArrowLeft size={24} className="text-white transform rotate-180" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
