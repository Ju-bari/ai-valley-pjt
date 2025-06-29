/**
 * 마크다운 텍스트를 HTML로 변환하는 유틸리티 함수
 */
export const formatMarkdown = (text: string): string => {
  if (!text) return '';
  
  // 먼저 \n을 실제 줄바꿈으로 변환
  const processedText = text.replace(/\\n/g, '\n');
  
  return processedText
    .split('\n')
    .map((line, index) => {
      const trimmedLine = line.trim();
      
      // 빈 줄 처리
      if (!trimmedLine) {
        return '<br>';
      }
      
      // 헤딩 처리 (먼저 처리)
      if (trimmedLine.startsWith('### ')) {
        return `<h5 class="font-medium text-sm text-white/80 mt-3 mb-2">${trimmedLine.substring(4)}</h5>`;
      } else if (trimmedLine.startsWith('## ')) {
        return `<h4 class="font-semibold text-base text-white/90 mt-4 mb-2">${trimmedLine.substring(3)}</h4>`;
      } else if (trimmedLine.startsWith('# ')) {
        return `<h3 class="font-bold text-lg text-white mt-4 mb-2">${trimmedLine.substring(2)}</h3>`;
      }
      
      // 리스트 아이템 처리 (텍스트 처리 전에 먼저)
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        let listContent = trimmedLine.substring(2);
        
        // 리스트 내용에 대해서만 텍스트 포맷팅 적용
        listContent = formatInlineText(listContent);
        
        return `<div class="flex items-start gap-2 text-white/90 ml-4 mb-1"><span class="text-white/60 mt-1">•</span><span>${listContent}</span></div>`;
      }
      
      // 번호 리스트 처리
      const numberedListMatch = trimmedLine.match(/^(\d+)\.\s(.*)$/);
      if (numberedListMatch) {
        const [, number, content] = numberedListMatch;
        let listContent = content;
        
        // 리스트 내용에 대해서만 텍스트 포맷팅 적용
        listContent = formatInlineText(listContent);
        
        return `<div class="flex items-start gap-2 text-white/90 ml-4 mb-1"><span class="text-white/60 mt-1 font-mono text-sm">${number}.</span><span>${listContent}</span></div>`;
      }
      
      // 인용문 처리 (> 텍스트)
      if (trimmedLine.startsWith('> ')) {
        let quoteContent = trimmedLine.substring(2);
        
        // 인용문 내용에 대해서만 텍스트 포맷팅 적용
        quoteContent = formatInlineText(quoteContent);
        
        return `<blockquote class="border-l-4 border-white/30 pl-4 text-white/80 italic bg-white/5 py-2 rounded-r mb-2">${quoteContent}</blockquote>`;
      }
      
      // 구분선 처리
      if (trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') {
        return '<hr class="border-white/20 my-4">';
      }
      
      // 일반 텍스트 처리 (마지막에)
      let processedLine = formatInlineText(trimmedLine);
      
      return `<p class="text-white/90 leading-relaxed font-normal mb-2">${processedLine}</p>`;
    })
    .join('');
};

/**
 * 인라인 텍스트 포맷팅을 처리하는 헬퍼 함수
 */
const formatInlineText = (text: string): string => {
  return text
    // 볼드 텍스트 처리 (**텍스트**)
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    // 이탤릭 텍스트 처리 (*텍스트*)
    .replace(/\*(.*?)\*/g, '<em class="italic text-white/90">$1</em>')
    // 인라인 코드 처리 (`코드`)
    .replace(/`(.*?)`/g, '<code class="bg-white/10 text-white px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    // 링크 처리 [텍스트](URL)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-300 hover:text-blue-200 underline" target="_blank" rel="noopener noreferrer">$1</a>');
};

/**
 * 마크다운 텍스트를 일반 텍스트로 변환 (미리보기용)
 */
export const stripMarkdown = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/#{1,6}\s+/g, '') // 헤딩 제거
    .replace(/\*\*(.*?)\*\*/g, '$1') // 볼드 제거
    .replace(/\*(.*?)\*/g, '$1') // 이탤릭 제거
    .replace(/`(.*?)`/g, '$1') // 인라인 코드 제거
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 링크 제거
    .replace(/^[-*+]\s+/gm, '') // 리스트 마커 제거
    .replace(/^\d+\.\s+/gm, '') // 번호 리스트 마커 제거
    .replace(/^>\s+/gm, '') // 인용문 마커 제거
    .replace(/^---+$/gm, '') // 구분선 제거
    .replace(/\\n/g, '\n') // \n을 실제 줄바꿈으로 변환
    .replace(/\n\s*\n/g, '\n') // 빈 줄 정리
    .trim();
};