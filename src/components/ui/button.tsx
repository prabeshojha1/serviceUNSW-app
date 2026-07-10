import { Pressable, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress?: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  // Base button styles
  let btnClasses = 'flex-row items-center justify-center rounded-2xl transition-all duration-200 ';
  
  // Base text styles
  let textClasses = 'font-semibold text-center ';

  // Variant styles
  if (variant === 'yellow') {
    btnClasses += 'bg-unsw-yellow active:bg-yellow-400 ';
    textClasses += 'text-black';
  } else if (variant === 'primary') {
    btnClasses += 'bg-black dark:bg-neutral-100 active:opacity-90 ';
    textClasses += 'text-white dark:text-black';
  } else if (variant === 'secondary') {
    btnClasses += 'bg-neutral-100 dark:bg-neutral-800 active:bg-neutral-200 dark:active:bg-neutral-700 ';
    textClasses += 'text-neutral-800 dark:text-neutral-200';
  } else if (variant === 'outline') {
    btnClasses += 'border border-neutral-300 dark:border-neutral-700 bg-transparent active:bg-neutral-50 dark:active:bg-neutral-900 ';
    textClasses += 'text-neutral-800 dark:text-neutral-200';
  } else if (variant === 'danger') {
    btnClasses += 'bg-red-600 active:bg-red-700 ';
    textClasses += 'text-white';
  }

  // Size styles
  if (size === 'sm') {
    btnClasses += 'px-3 py-2 gap-1.5';
    textClasses += 'text-xs';
  } else if (size === 'md') {
    btnClasses += 'px-5 py-3.5 gap-2';
    textClasses += 'text-sm';
  } else if (size === 'lg') {
    btnClasses += 'px-6 py-4.5 gap-2.5';
    textClasses += 'text-base';
  }

  if (disabled || loading) {
    btnClasses += ' opacity-50 ';
  }

  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
      className={`${btnClasses} ${className}`}
      style={({ pressed }) => pressed ? { transform: [{ scale: 0.98 }] } : {}}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#fff' : variant === 'yellow' ? '#000' : '#888'} 
        />
      ) : null}
      <Text className={textClasses}>{title}</Text>
    </Pressable>
  );
}
