import { useEffect, useMemo, useRef, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'top bottom',
  scrollEnd = 'bottom center',
  stagger = 0.03,
  as: Tag = 'h2'
}: ScrollFloatProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const extractText = (node: ReactNode): string => {
      if (typeof node === 'string' || typeof node === 'number') {
        return String(node);
      }
      if (Array.isArray(node)) {
        return node.map(extractText).join('');
      }
      if (node && typeof node === 'object' && 'props' in node) {
        return extractText((node as any).props.children);
      }
      return '';
    };

    const text = extractText(children);
    // Split by words to prevent broken words across lines
    const words = text.split(' ');
    
    return words.map((word, wordIndex) => (
      <span key={wordIndex} className="word whitespace-nowrap inline-block">
        {word.split('').map((char, charIndex) => (
          <span className="char inline-block" key={charIndex}>
            {char}
          </span>
        ))}
        {wordIndex < words.length - 1 && <span className="char inline-block">&nbsp;</span>}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const charElements = el.querySelectorAll('.char');

    gsap.killTweensOf(charElements);

    gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        y: 50,
        rotateX: -90,
        transformOrigin: '50% 50% -50'
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === el) t.kill();
      });
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger, children]);

  return (
    <Tag ref={containerRef} className={`scroll-float ${containerClassName}`}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </Tag>
  );
};

export default ScrollFloat;
