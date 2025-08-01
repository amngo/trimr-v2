/**
 * Reusable animated container component using Framer Motion
 */

'use client'

import { motion, MotionProps } from 'framer-motion'
import { forwardRef } from 'react'
import { BaseComponentProps, AnimationVariants } from '@/types'
import { ANIMATION_VARIANTS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface AnimatedContainerProps extends BaseComponentProps {
  /**
   * Animation variant to use
   */
  variant?: keyof typeof ANIMATION_VARIANTS
  /**
   * Custom animation variants
   */
  customVariants?: AnimationVariants
  /**
   * Animation delay in seconds
   */
  delay?: number
  /**
   * Animation duration in seconds
   */
  duration?: number
  /**
   * Whether to animate only once when in view
   */
  once?: boolean
  /**
   * Amount of element that needs to be visible to trigger animation (0-1)
   */
  amount?: number
  /**
   * HTML element or motion component to render
   */
  as?: keyof JSX.IntrinsicElements | typeof motion.div
  /**
   * Additional motion props
   */
  motionProps?: Omit<MotionProps, 'variants' | 'initial' | 'animate' | 'whileInView'>
}

/**
 * AnimatedContainer component for consistent animations across the app
 */
export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
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
      as: Component = motion.div,
      motionProps,
      ...props
    },
    ref
  ) => {
    const variants = customVariants || ANIMATION_VARIANTS[variant]

    // Add duration and delay to variants
    const enhancedVarirants = {
      ...variants,
      visible: {
        ...variants.visible,
        transition: {
          duration,
          delay,
          ease: 'easeOut',
          ...variants.visible.transition,
        },
      },
    }

    return (
      <Component
        ref={ref}
        className={cn(className)}
        variants={enhancedVarirants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

AnimatedContainer.displayName = 'AnimatedContainer'

/**
 * Preset animated containers for common use cases
 */
export const FadeIn = (props: Omit<AnimatedContainerProps, 'variant'>) => (
  <AnimatedContainer variant="fadeIn" {...props} />
)

export const SlideUp = (props: Omit<AnimatedContainerProps, 'variant'>) => (
  <AnimatedContainer variant="slideUp" {...props} />
)

export const SlideDown = (props: Omit<AnimatedContainerProps, 'variant'>) => (
  <AnimatedContainer variant="slideDown" {...props} />
)

export const SlideLeft = (props: Omit<AnimatedContainerProps, 'variant'>) => (
  <AnimatedContainer variant="slideLeft" {...props} />
)

export const SlideRight = (props: Omit<AnimatedContainerProps, 'variant'>) => (
  <AnimatedContainer variant="slideRight" {...props} />
)

export const Scale = (props: Omit<AnimatedContainerProps, 'variant'>) => (
  <AnimatedContainer variant="scale" {...props} />
)

export const StaggerContainer = (props: Omit<AnimatedContainerProps, 'variant'>) => (
  <AnimatedContainer variant="staggerContainer" {...props} />
)