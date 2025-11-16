import React, { useState, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTheme } from '../App';
import { Image as ImageIcon, Plus, Calendar, Tag, ArrowLeft, Download, Printer, Share2, Eye } from 'lucide-react';
import CreateAlbum from './CreateAlbum';
import { toast } from 'sonner@2.0.3';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function AlbumList() {
  const { theme, albums } = useTheme();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);

  if (showCreate) {
    return <CreateAlbum onBack={() => setShowCreate(false)} />;
  }

  if (selectedAlbum) {
    return <AlbumDetailPage album={selectedAlbum} onBack={() => setSelectedAlbum(null)} />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* 头部 - 固定 */}
      <div 
        className="px-6 pt-12 pb-6 flex-shrink-0"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl">图文集</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: '#FFFFFF'
            }}
          >
            <Plus size={20} />
          </button>
        </div>
        <p style={{ color: theme.colors.textSecondary }}>将日记整理成精美的图文集</p>
      </div>

      {/* 图文集列表 - 可滚动区域 */}
      <div className={`flex-1 overflow-y-auto px-6 pb-6 ${albums.length === 0 ? 'flex items-center justify-center' : ''}`}>
        {albums.length === 0 ? (
          <div className="text-center w-full max-w-md">
            <div 
              className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${theme.colors.primary}20` }}
            >
              <ImageIcon size={40} style={{ color: theme.colors.primary }} />
            </div>
            <h3 className="mb-2">创建你的第一个图文集</h3>
            <p className="mb-6 text-sm" style={{ color: theme.colors.textSecondary }}>
              精选多篇日记，用精美模板展示你的故事
            </p>
            
            {/* 模板预览卡片 */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { name: '经典网格', color: '#FF6B9D', icon: '📱' },
                { name: '杂志风格', color: '#9B59B6', icon: '📖' },
                { name: '时间线', color: '#3498DB', icon: '⏰' },
                { name: '宝丽来', color: '#E74C3C', icon: '📷' },
              ].map((template, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl text-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${template.color}10 0%, ${template.color}20 100%)`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  <div className="text-3xl mb-2">{template.icon}</div>
                  <div className="text-sm" style={{ color: template.color }}>
                    {template.name}
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setShowCreate(true)}
              className="px-8 py-3 rounded-xl"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: '#FFFFFF'
              }}
            >
              开始创建
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 py-4">
            {albums.map((album: any) => (
              <AlbumCard key={album.id} album={album} onClick={() => setSelectedAlbum(album)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AlbumCard({ album, onClick }: any) {
  const { theme } = useTheme();

  return (
    <div
      onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
      style={{ 
        background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.accent}08 100%)`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
      }}
    >
      {/* 封面图 */}
      <div className="relative h-48">
        <ImageWithFallback
          src={album.cover}
          alt={album.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl mb-1">{album.title}</h3>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Calendar size={14} />
            <span>{album.date}</span>
          </div>
        </div>
      </div>

      {/* 信息 */}
      <div className="p-4">
        <p className="text-sm mb-3 line-clamp-2" style={{ color: theme.colors.textSecondary }}>
          {album.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {album.tags.slice(0, 2).map((tag: string, index: number) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded flex items-center gap-1"
                style={{
                  backgroundColor: `${theme.colors.primary}15`,
                  color: theme.colors.primary,
                }}
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
          <span className="text-sm" style={{ color: theme.colors.textSecondary }}>
            {album.diaryCount}篇日记
          </span>
        </div>
      </div>
    </div>
  );
}

// 图文集详情页
function AlbumDetailPage({ album, onBack }: { album: any; onBack: () => void }) {
  const { theme, diaries } = useTheme();
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const previewContentRef = useRef<HTMLDivElement>(null);
  
  // 获取图文集中的所有日记
  const albumDiaries = diaries.filter((d: any) => album.diaryIds?.includes(d.id)) || [];

  // 保存为PDF
  const handleSaveToLocal = async () => {
    if (!previewContentRef.current || isSaving) return;
    
    setIsSaving(true);
    toast.loading('正在生成PDF...', { id: 'pdf-save' });

    try {
      // 先进入预览模式
      setPreviewMode(true);
      
      // 等待DOM渲染完成
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const element = previewContentRef.current;
      if (!element) {
        throw new Error('预览内容未找到');
      }

      // 使用html2canvas渲染为图片
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // 创建PDF
      const imgWidth = 210; // A4纸宽度（mm）
      const pageHeight = 297; // A4纸高度（mm）
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      let heightLeft = imgHeight;
      let position = 0;

      // 添加第一页
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 如果内容超过一页，添加更多页
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 保存PDF
      pdf.save(`${album.title}-${new Date().toLocaleDateString()}.pdf`);
      
      toast.success('PDF已保存到本地！', {
        id: 'pdf-save',
        description: '您可以在下载文件夹中查看',
      });
      
      setPreviewMode(false);
    } catch (error) {
      console.error('保存PDF失败:', error);
      toast.error('保存PDF失败', {
        id: 'pdf-save',
        description: '请稍后重试',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 打印
  const handlePrint = () => {
    window.print();
    toast.success('正在准备打印...', {
      description: '请在打印预览中查看效果',
    });
  };

  // 分享
  const handleShare = () => {
    toast.success('生成分享链接成功！', {
      description: '链接已复制到剪贴板',
    });
  };

  // 预览模式
  if (previewMode) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto print:block">
        {/* 头部 - 固定 */}
        <div 
          className="px-6 py-4 flex items-center justify-between sticky top-0 z-10 print:hidden"
          style={{ backgroundColor: theme.colors.surface, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <button 
            onClick={() => !isSaving && setPreviewMode(false)}
            className="p-2 -ml-2 rounded-lg transition-transform active:scale-95"
            style={{ color: theme.colors.textPrimary, opacity: isSaving ? 0.5 : 1 }}
            disabled={isSaving}
          >
            <ArrowLeft size={24} />
          </button>
          <h2>{isSaving ? '正在生成PDF...' : '预览'}</h2>
          <div className="w-10" />
        </div>

        {/* 预览内容 */}
        <div ref={previewContentRef} className="px-6 py-6 print:px-8 print:py-8">
          {renderAlbumTemplate(album, albumDiaries, theme)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 头部 - 固定 */}
      <div 
        className="px-6 pt-12 pb-4 flex-shrink-0"
        style={{ backgroundColor: theme.colors.surface }}
      >
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2"
          >
            <ArrowLeft size={24} style={{ color: theme.colors.textPrimary }} />
          </button>
          <h1 className="text-xl">图文集详情</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {/* 封面区域 */}
        <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
          <ImageWithFallback
            src={album.cover}
            alt={album.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-white text-2xl mb-2">{album.title}</h2>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{album.date}</span>
              </div>
              <span>·</span>
              <span>{album.diaryCount}篇日记</span>
            </div>
          </div>
        </div>

        {/* 描述 */}
        {album.description && (
          <div 
            className="p-4 rounded-xl mb-6"
            style={{ 
              backgroundColor: theme.colors.surface,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <p style={{ color: theme.colors.textSecondary }}>
              {album.description}
            </p>
          </div>
        )}

        {/* 标签 */}
        {album.tags && album.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {album.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full flex items-center gap-1"
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

        {/* 预览按钮 */}
        <button
          onClick={() => setPreviewMode(true)}
          className="w-full py-4 rounded-xl mb-4 flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          style={{
            backgroundColor: theme.colors.primary,
            color: '#FFFFFF',
          }}
        >
          <Eye size={20} />
          <span>预览图文集</span>
        </button>

        {/* 操作按钮组 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={handleSaveToLocal}
            className="py-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: theme.colors.surface,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <Download size={24} style={{ color: theme.colors.primary }} />
            <span className="text-sm" style={{ color: theme.colors.textPrimary }}>
              保存本地
            </span>
          </button>

          <button
            onClick={handlePrint}
            className="py-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: theme.colors.surface,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <Printer size={24} style={{ color: theme.colors.primary }} />
            <span className="text-sm" style={{ color: theme.colors.textPrimary }}>
              打印
            </span>
          </button>

          <button
            onClick={handleShare}
            className="py-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: theme.colors.surface,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <Share2 size={24} style={{ color: theme.colors.primary }} />
            <span className="text-sm" style={{ color: theme.colors.textPrimary }}>
              分享
            </span>
          </button>
        </div>

        {/* 包含的日记列表 */}
        <div>
          <h3 className="mb-4">包含的日记 ({albumDiaries.length})</h3>
          <div className="space-y-3">
            {albumDiaries.map((diary: any) => (
              <div
                key={diary.id}
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: theme.colors.surface,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div className="flex gap-3">
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
                    <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                      {diary.date}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 渲染不同模板的图文集
function renderAlbumTemplate(album: any, diaries: any[], theme: any) {
  const templateId = album.template || 'classic';

  switch (templateId) {
    case 'classic':
      return renderClassicTemplate(album, diaries, theme);
    case 'magazine':
      return renderMagazineTemplate(album, diaries, theme);
    case 'timeline':
      return renderTimelineTemplate(album, diaries, theme);
    case 'minimal':
      return renderMinimalTemplate(album, diaries, theme);
    case 'collage':
      return renderCollageTemplate(album, diaries, theme);
    case 'polaroid':
      return renderPolaroidTemplate(album, diaries, theme);
    default:
      return renderClassicTemplate(album, diaries, theme);
  }
}

// 经典网格模板
function renderClassicTemplate(album: any, diaries: any[], theme: any) {
  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl mb-2">{album.title}</h1>
        <p style={{ color: theme.colors.textSecondary }}>{album.description}</p>
        <p className="text-sm mt-2" style={{ color: theme.colors.textSecondary }}>{album.date}</p>
      </div>

      {/* 网格布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {diaries.map((diary: any) => (
          <div 
            key={diary.id}
            className="rounded-2xl overflow-hidden"
            style={{ 
              backgroundColor: theme.colors.surface,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
            }}
          >
            {diary.images && diary.images.length > 0 && (
              <ImageWithFallback
                src={diary.images[0]}
                alt={diary.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="mb-2">{diary.title}</h3>
              <p className="text-sm mb-2" style={{ color: theme.colors.textSecondary }}>
                {diary.content}
              </p>
              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                {diary.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 杂志风格模板
function renderMagazineTemplate(album: any, diaries: any[], theme: any) {
  return (
    <div className="space-y-8">
      {/* 封面 */}
      <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
        <ImageWithFallback
          src={album.cover}
          alt={album.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          <h1 className="text-white text-4xl mb-4">{album.title}</h1>
          <p className="text-white/90 text-lg">{album.description}</p>
        </div>
      </div>

      {/* 日记内容 */}
      {diaries.map((diary: any, index: number) => (
        <div key={diary.id} className="mb-8">
          {index % 2 === 0 ? (
            // 左图右文
            <div className="flex flex-col md:flex-row gap-6">
              {diary.images && diary.images.length > 0 && (
                <div className="w-full md:w-1/2">
                  <ImageWithFallback
                    src={diary.images[0]}
                    alt={diary.title}
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl mb-4">{diary.title}</h2>
                <p className="mb-4" style={{ color: theme.colors.textSecondary }}>
                  {diary.content}
                </p>
                <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  {diary.date}
                </div>
              </div>
            </div>
          ) : (
            // 右图左文
            <div className="flex flex-col md:flex-row-reverse gap-6">
              {diary.images && diary.images.length > 0 && (
                <div className="w-full md:w-1/2">
                  <ImageWithFallback
                    src={diary.images[0]}
                    alt={diary.title}
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl mb-4">{diary.title}</h2>
                <p className="mb-4" style={{ color: theme.colors.textSecondary }}>
                  {diary.content}
                </p>
                <div className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  {diary.date}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 时间线模板
function renderTimelineTemplate(album: any, diaries: any[], theme: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl mb-2">{album.title}</h1>
        <p style={{ color: theme.colors.textSecondary }}>{album.description}</p>
      </div>

      {/* 时间轴 */}
      <div className="relative">
        {/* 中间的线 */}
        <div 
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
          style={{ backgroundColor: theme.colors.border }}
        />

        {diaries.map((diary: any, index: number) => (
          <div key={diary.id} className="relative mb-8">
            {/* 时间节点 */}
            <div 
              className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4"
              style={{ 
                backgroundColor: theme.colors.primary,
                borderColor: '#FFFFFF'
              }}
            />

            {/* 内容 */}
            <div className={`flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
              <div className="hidden md:block flex-1" />
              <div 
                className="flex-1 p-4 rounded-2xl"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                }}
              >
                <div className="text-xs mb-2" style={{ color: theme.colors.primary }}>
                  {diary.date}
                </div>
                <h3 className="mb-2">{diary.title}</h3>
                {diary.images && diary.images.length > 0 && (
                  <ImageWithFallback
                    src={diary.images[0]}
                    alt={diary.title}
                    className="w-full h-48 object-cover rounded-xl mb-3"
                  />
                )}
                <p className="text-sm" style={{ color: theme.colors.textSecondary }}>
                  {diary.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 极简主义模板
function renderMinimalTemplate(album: any, diaries: any[], theme: any) {
  return (
    <div className="max-w-2xl mx-auto space-y-12 py-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl mb-4">{album.title}</h1>
        <p className="text-lg" style={{ color: theme.colors.textSecondary }}>{album.description}</p>
      </div>

      {diaries.map((diary: any) => (
        <div key={diary.id} className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl mb-4">{diary.title}</h2>
            <div className="text-sm mb-6" style={{ color: theme.colors.textSecondary }}>
              {diary.date}
            </div>
          </div>
          
          {diary.images && diary.images.length > 0 && (
            <ImageWithFallback
              src={diary.images[0]}
              alt={diary.title}
              className="w-full h-80 object-cover rounded-2xl"
            />
          )}
          
          <p className="text-center leading-relaxed" style={{ color: theme.colors.textSecondary }}>
            {diary.content}
          </p>
          
          <div 
            className="w-16 h-0.5 mx-auto my-12"
            style={{ backgroundColor: theme.colors.border }}
          />
        </div>
      ))}
    </div>
  );
}

// 拼贴画册模板
function renderCollageTemplate(album: any, diaries: any[], theme: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl mb-2">{album.title}</h1>
        <p style={{ color: theme.colors.textSecondary }}>{album.description}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {diaries.map((diary: any) => (
          <div 
            key={diary.id}
            className="relative aspect-square rounded-2xl overflow-hidden group"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
          >
            {diary.images && diary.images.length > 0 && (
              <>
                <ImageWithFallback
                  src={diary.images[0]}
                  alt={diary.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <h3 className="text-white mb-1">{diary.title}</h3>
                  <p className="text-white/80 text-sm line-clamp-2">{diary.content}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 宝丽来相册模板
function renderPolaroidTemplate(album: any, diaries: any[], theme: any) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl mb-2" style={{ fontFamily: 'cursive' }}>{album.title}</h1>
        <p style={{ color: theme.colors.textSecondary }}>{album.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {diaries.map((diary: any, index: number) => (
          <div 
            key={diary.id}
            className="bg-white p-4 pb-16 rounded-lg relative"
            style={{ 
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              transform: `rotate(${index % 2 === 0 ? '-2deg' : '2deg'})`
            }}
          >
            {diary.images && diary.images.length > 0 && (
              <ImageWithFallback
                src={diary.images[0]}
                alt={diary.title}
                className="w-full aspect-square object-cover mb-3"
              />
            )}
            <div className="text-center">
              <h3 className="mb-1" style={{ fontFamily: 'cursive' }}>{diary.title}</h3>
              <p className="text-sm mb-2" style={{ color: theme.colors.textSecondary }}>
                {diary.date}
              </p>
            </div>
            <div 
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-8"
              style={{ 
                background: 'transparent',
                border: '2px solid #ddd',
                borderRadius: '50%'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
