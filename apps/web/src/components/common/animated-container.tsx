/**
 * Reusable animated container component using Framer Motion
 */

'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { BaseComponentProps } from '@/types';
import { ANIMATION_VARIANTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps extends BaseComponentProps {
  /**
   * Animation variant to use
   */
  variant?: keyof typeof ANIMATION_VARIANTS;
  /**
   * Custom animation variants
   */
  customVariants?: Variants;
  /**
   * Animation delay in seconds
   */
  delay?: number;
  /**
   * Animation duration in seconds
   */
  duration?: number;
  /**
   * Whether to animate only once when in view
   */
  once?: boolean;
  /**
   * Amount of element that needs to be visible to trigger animation (0-1)
   */
  amount?: number;
  /**
   * Additional motion props
   */
  motionProps?: Omit<
    HTMLMotionProps<'div'>,
    'variants' | 'initial' | 'animate' | 'whileInView'
  >;
}

/**
 * AnimatedContainer component for consistent animations across the app
 */
export const AnimatedContainer = forwardRef<
  HTMLDivElement,
  AnimatedContainerProps
>(
  (
    {
      children,
      className,
      variant = 'fadeIn',
      customVariants,
      delay = 0,
      duration = 0.5,
      once = true,
      amount = 0.1,
      motionProps,
      ...props
    },
    ref,
  ) => {
    const variants = customVariants || ANIMATION_VARIANTS[variant];

    // Add duration and delay to variants - use proper Framer Motion types
    const visibleVariant = variants.visible as Record<string, unknown>;
    const enhancedVariants: Variants = {
      ...variants,
      visible: {
        ...visibleVariant,
        transition: {
          duration,
          delay,
          ease: 'easeOut',
        },
      },
    };

    // Use motion.div directly instead of dynamic component
    const MotionComponent = motion.div;

    return (
      <MotionComponent
        ref={ref}
        className={cn(className)}
        variants={enhancedVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
        {...motionProps}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  },
);

AnimatedContainer.displayName = 'AnimatedContainer';

/**
 * Preset animated containers for common use cases
 */
export const FadeIn = (props: Omit<AnimatedContainerProps, 'variant'>) => (
  <AnimatedContainer variant="fadeIn" {...props} />
);

export const SlideUp = (props: Omit<AnimatedContainerProps, 'variant'>) => (
  <AnimatedContainer variant="slideUp" {...props} />
);

export const SlideDown = (props: Omit<AnimatedContainerProps, 'variant'>) => (
  <AnimatedContainer variant="slideDown" {...props} />
);

export const SlideLeft = (props: Omit<AnimatedContainerProps, 'variant'>) => (
  <AnimatedContainer variant="slideLeft" {...props} />
);

export const SlideRight = (props: Omit<AnimatedContainerProps, 'variant'>) => (
  <AnimatedContainer variant="slideRight" {...props} />
);

export const Scale = (props: Omit<AnimatedContainerProps, 'variant'>) => (
  <AnimatedContainer variant="scale" {...props} />
);

export const StaggerContainer = (
  props: Omit<AnimatedContainerProps, 'variant'>,
) => <AnimatedContainer variant="staggerContainer" {...props} />;
