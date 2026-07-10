import { Modal as RNModal, View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType={Platform.OS === 'web' ? 'fade' : 'slide'}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end md:justify-center items-center bg-black/60 p-4">
        {/* Backdrop press to close */}
        <Pressable className="absolute inset-0" onPress={onClose} />

        {/* Modal content box */}
        <View className="w-full max-w-md bg-white dark:bg-neutral-950 rounded-t-3xl md:rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden max-h-[85vh]">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/20">
            {title ? (
              <Text className="text-lg font-bold text-neutral-950 dark:text-white" numberOfLines={1}>
                {title}
              </Text>
            ) : (
              <View />
            )}
            <Pressable
              onPress={onClose}
              className="p-1 rounded-full active:bg-neutral-200 dark:active:bg-neutral-800 transition-colors"
            >
              <SymbolView
                name={{ ios: 'xmark.circle.fill', android: 'cancel', web: 'close' }}
                size={22}
                tintColor="#a3a3a3"
              />
            </Pressable>
          </View>

          {/* Scrollable Body */}
          <ScrollView className="p-6" contentContainerStyle={{ paddingBottom: 24 }}>
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}
