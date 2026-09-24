import React, { useState } from 'react';
import { Share2, Check, Copy, Link as LinkIcon } from 'lucide-react';

interface SocialShareBarProps {
  url?: string;
  title: string;
  summary?: string;
  variant?: 'inline' | 'floating' | 'card' | 'compact';
  className?: string;
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({
  url,
  title,
  summary = '',
  variant = 'inline',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getShareUrl = () => {
    if (url) return url;
    if (typeof window !== 'undefined') return window.location.href;
    return 'https://ncturismo.com.br';
  };

  const currentUrl = getShareUrl();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      showToast('Link do artigo copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=600');
  };

  const handleX = () => {
    const text = `${title} — via @NCTurismo`;
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=450');
  };

  const handleFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  const handleWhatsApp = () => {
    const text = `*${title}*\n\nConfira este artigo no Centro de Conhecimento da NC Turismo:\n${currentUrl}`;
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleInstagram = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      showToast('Link copiado! Cole no seu Story ou envie via Direct no Instagram.');
      setTimeout(() => setCopied(false), 3000);
    }
    // Open Instagram in new tab as fallback
    setTimeout(() => {
      window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');
    }, 600);
  };

  // SVGs for Brand Accuracy
  const LinkedInIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );

  const XIcon = () => (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
    </svg>
  );

  const InstagramIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );

  // Variant: COMPACT (for listing cards)
  if (variant === 'compact') {
    return (
      <div className={`relative flex items-center gap-1.5 ${className}`}>
        {/* Toast */}
        {toastMessage && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 px-3 py-1 bg-black/90 text-nc-orange text-[11px] font-medium rounded-lg whitespace-nowrap shadow-xl border border-nc-orange/30">
            {toastMessage}
          </div>
        )}

        <button
          onClick={handleLinkedIn}
          title="Compartilhar no LinkedIn"
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#0077b5] text-nc-warm/70 hover:text-white flex items-center justify-center transition-all"
        >
          <LinkedInIcon />
        </button>

        <button
          onClick={handleX}
          title="Compartilhar no X (Twitter)"
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-black text-nc-warm/70 hover:text-white flex items-center justify-center transition-all border border-transparent hover:border-white/20"
        >
          <XIcon />
        </button>

        <button
          onClick={handleFacebook}
          title="Compartilhar no Facebook"
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#1877f2] text-nc-warm/70 hover:text-white flex items-center justify-center transition-all"
        >
          <FacebookIcon />
        </button>

        <button
          onClick={handleInstagram}
          title="Compartilhar no Instagram"
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-nc-warm/70 hover:text-white flex items-center justify-center transition-all"
        >
          <InstagramIcon />
        </button>

        <button
          onClick={handleWhatsApp}
          title="Compartilhar no WhatsApp"
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#25D366] text-nc-warm/70 hover:text-white flex items-center justify-center transition-all"
        >
          <WhatsAppIcon />
        </button>

        <button
          onClick={handleCopyLink}
          title="Copiar Link"
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-nc-orange text-nc-warm/70 hover:text-nc-space flex items-center justify-center transition-all"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
        </button>
      </div>
    );
  }

  // Variant: FLOATING (dock on desktop screen)
  if (variant === 'floating') {
    return (
      <div className={`hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2 p-2.5 rounded-2xl bg-[#14151b]/95 border border-white/10 shadow-2xl backdrop-blur-md ${className}`}>
        
        {toastMessage && (
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/95 text-nc-orange text-xs font-medium rounded-xl whitespace-nowrap shadow-2xl border border-nc-orange/40 animate-fadeIn">
            {toastMessage}
          </div>
        )}

        <span className="text-[10px] font-mono uppercase tracking-widest text-nc-warm/40 mb-1">
          Share
        </span>

        {/* LinkedIn */}
        <button
          onClick={handleLinkedIn}
          title="Compartilhar no LinkedIn"
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#0077b5] text-nc-warm/80 hover:text-white flex items-center justify-center transition-all group relative"
        >
          <LinkedInIcon />
          <span className="absolute left-12 px-2 py-1 rounded bg-black text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
            LinkedIn
          </span>
        </button>

        {/* X */}
        <button
          onClick={handleX}
          title="Compartilhar no X"
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-black text-nc-warm/80 hover:text-white flex items-center justify-center transition-all group relative border border-transparent hover:border-white/20"
        >
          <XIcon />
          <span className="absolute left-12 px-2 py-1 rounded bg-black text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
            X (Twitter)
          </span>
        </button>

        {/* Facebook */}
        <button
          onClick={handleFacebook}
          title="Compartilhar no Facebook"
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#1877f2] text-nc-warm/80 hover:text-white flex items-center justify-center transition-all group relative"
        >
          <FacebookIcon />
          <span className="absolute left-12 px-2 py-1 rounded bg-black text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
            Facebook
          </span>
        </button>

        {/* Instagram */}
        <button
          onClick={handleInstagram}
          title="Compartilhar no Instagram"
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-nc-warm/80 hover:text-white flex items-center justify-center transition-all group relative"
        >
          <InstagramIcon />
          <span className="absolute left-12 px-2 py-1 rounded bg-black text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
            Instagram
          </span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          title="Compartilhar no WhatsApp"
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#25D366] text-nc-warm/80 hover:text-white flex items-center justify-center transition-all group relative"
        >
          <WhatsAppIcon />
          <span className="absolute left-12 px-2 py-1 rounded bg-black text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
            WhatsApp
          </span>
        </button>

        <div className="w-6 h-px bg-white/10 my-1" />

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          title="Copiar Link"
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-nc-orange text-nc-warm/80 hover:text-nc-space flex items-center justify-center transition-all group relative"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <LinkIcon size={16} />}
          <span className="absolute left-12 px-2 py-1 rounded bg-black text-[10px] text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
            {copied ? 'Copiado!' : 'Copiar Link'}
          </span>
        </button>

      </div>
    );
  }

  // Variant: CARD / BANNER (for end of article)
  if (variant === 'card') {
    return (
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171922] via-[#201815] to-[#171922] border border-white/10 shadow-2xl relative overflow-hidden ${className}`}>
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-nc-orange/10 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-nc-space/95 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-2xl border border-nc-orange/50 flex items-center gap-2 backdrop-blur-xl animate-bounce">
            <Check size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-nc-orange text-xs font-mono uppercase tracking-wider font-bold">
              <Share2 size={14} />
              <span>Compartilhe o Conhecimento</span>
            </div>
            <h4 className="text-lg sm:text-xl font-display font-bold text-white">
              Este conteúdo gerou valor para você?
            </h4>
            <p className="text-xs sm:text-sm text-nc-warm/70 max-w-md">
              Compartilhe com sua diretoria, gestores de viagens e lideranças que buscam otimizar SLA e governança.
            </p>
          </div>

          {/* Social Buttons Cluster */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            
            {/* LinkedIn */}
            <button
              onClick={handleLinkedIn}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-[#0077b5] text-nc-warm/90 hover:text-white border border-white/10 text-xs font-medium transition-all hover:scale-105 active:scale-95"
            >
              <LinkedInIcon />
              <span>LinkedIn</span>
            </button>

            {/* X (Twitter) */}
            <button
              onClick={handleX}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-black text-nc-warm/90 hover:text-white border border-white/10 text-xs font-medium transition-all hover:scale-105 active:scale-95"
            >
              <XIcon />
              <span>X</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebook}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-[#1877f2] text-nc-warm/90 hover:text-white border border-white/10 text-xs font-medium transition-all hover:scale-105 active:scale-95"
            >
              <FacebookIcon />
              <span>Facebook</span>
            </button>

            {/* Instagram */}
            <button
              onClick={handleInstagram}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-nc-warm/90 hover:text-white border border-white/10 text-xs font-medium transition-all hover:scale-105 active:scale-95"
            >
              <InstagramIcon />
              <span>Instagram</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-[#25D366] text-nc-warm/90 hover:text-white border border-white/10 text-xs font-medium transition-all hover:scale-105 active:scale-95"
            >
              <WhatsAppIcon />
              <span>WhatsApp</span>
            </button>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-nc-orange text-nc-space font-bold text-xs hover:bg-amber-400 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-nc-space" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copiar Link</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    );
  }

  // Default: INLINE BAR (top bar of article)
  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      
      {toastMessage && (
        <div className="absolute -bottom-10 right-0 z-50 px-3 py-1.5 bg-black/95 text-nc-orange text-xs font-medium rounded-xl whitespace-nowrap shadow-2xl border border-nc-orange/40">
          {toastMessage}
        </div>
      )}

      <span className="hidden sm:inline text-xs font-mono uppercase tracking-wider text-nc-warm/60 mr-1">
        Compartilhar:
      </span>

      {/* LinkedIn */}
      <button
        onClick={handleLinkedIn}
        title="Compartilhar no LinkedIn"
        className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#0077b5] text-nc-warm/75 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-transparent"
      >
        <LinkedInIcon />
      </button>

      {/* X */}
      <button
        onClick={handleX}
        title="Compartilhar no X (Twitter)"
        className="w-8 h-8 rounded-full bg-white/5 hover:bg-black text-nc-warm/75 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-white/20"
      >
        <XIcon />
      </button>

      {/* Facebook */}
      <button
        onClick={handleFacebook}
        title="Compartilhar no Facebook"
        className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#1877f2] text-nc-warm/75 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-transparent"
      >
        <FacebookIcon />
      </button>

      {/* Instagram */}
      <button
        onClick={handleInstagram}
        title="Compartilhar no Instagram"
        className="w-8 h-8 rounded-full bg-white/5 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-nc-warm/75 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-transparent"
      >
        <InstagramIcon />
      </button>

      {/* WhatsApp */}
      <button
        onClick={handleWhatsApp}
        title="Compartilhar no WhatsApp"
        className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#25D366] text-nc-warm/75 hover:text-white flex items-center justify-center transition-all border border-white/10 hover:border-transparent"
      >
        <WhatsAppIcon />
      </button>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        title="Copiar Link do Artigo"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-nc-warm/80 hover:text-white border border-white/10 text-xs font-semibold transition-all"
      >
        {copied ? (
          <>
            <Check size={13} className="text-emerald-400" />
            <span className="text-emerald-400 text-xs">Copiado!</span>
          </>
        ) : (
          <>
            <LinkIcon size={13} className="text-nc-orange" />
            <span className="hidden sm:inline">Copiar Link</span>
          </>
        )}
      </button>

    </div>
  );
};
