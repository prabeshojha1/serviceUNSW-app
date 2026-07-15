import { SymbolView } from 'expo-symbols';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';

type SymbolName = ComponentProps<typeof SymbolView>['name'];

interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  defaultSettings: {
    classOffset: number; // minutes, -1 for none
    societyOffset: number;
    deadlineOffset: number;
  };
  onSave: (settings: { classOffset: number; societyOffset: number; deadlineOffset: number }) => void;
}

export function NotificationSettingsModal({
  visible,
  onClose,
  defaultSettings,
  onSave,
}: NotificationSettingsModalProps) {
  const [classOffset, setClassOffset] = useState(defaultSettings.classOffset);
  const [societyOffset, setSocietyOffset] = useState(defaultSettings.societyOffset);
  const [deadlineOffset, setDeadlineOffset] = useState(defaultSettings.deadlineOffset);

  const [activePicker, setActivePicker] = useState<'class' | 'society' | 'deadline' | null>(null);

  const options = [
    { value: -1, label: 'None (Disabled)' },
    { value: 0, label: 'At start of event' },
    { value: 10, label: '10 minutes before' },
    { value: 60, label: '1 hour before' },
    { value: 1440, label: '1 day before' },
  ];

  const getLabel = (offset: number) => {
    return options.find((opt) => opt.value === offset)?.label || 'None';
  };

  const handleSave = () => {
    onSave({
      classOffset,
      societyOffset,
      deadlineOffset,
    });
    onClose();
  };

  const renderPickerSection = (
    type: 'class' | 'society' | 'deadline',
    label: string,
    currentValue: number,
    setValue: (val: number) => void,
    icon: SymbolName,
    color: string
  ) => {
    const isOpen = activePicker === type;
    return (
      <View className="gap-2 bg-neutral-50 dark:bg-neutral-900 p-4 border border-neutral-100 dark:border-neutral-800 rounded-2xl">
        <Pressable
          onPress={() => setActivePicker(isOpen ? null : type)}
          className="flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <SymbolView name={icon} size={18} tintColor={color} />
            <Text className="text-sm font-bold text-neutral-900 dark:text-white">{label}</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Text className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
              {getLabel(currentValue)}
            </Text>
            <SymbolView
              name={{ ios: isOpen ? 'chevron.up' : 'chevron.down', android: isOpen ? 'arrow_drop_up' : 'arrow_drop_down', web: isOpen ? 'expand_less' : 'expand_more' }}
              size={14}
              tintColor="#888"
            />
          </View>
        </Pressable>

        {isOpen && (
          <View className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 gap-2">
            {options.map((opt) => (
              <Pressable
                key={opt.value}
                onPress={() => {
                  setValue(opt.value);
                  setActivePicker(null);
                }}
                className={`p-2.5 rounded-lg ${currentValue === opt.value ? 'bg-unsw-yellow' : 'active:bg-neutral-200 dark:active:bg-neutral-800'}`}
              >
                <Text
                  className={`text-xs ${currentValue === opt.value ? 'text-black font-bold' : 'text-neutral-700 dark:text-neutral-300'}`}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Default Notification Settings">
      <View className="gap-6">
        <Text className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Configure default notification offsets for newly subscribed events and timetable class schedules.
        </Text>

        <View className="gap-4">
          {renderPickerSection(
            'class',
            'Timetable Classes',
            classOffset,
            setClassOffset,
            { ios: 'book.closed.fill', android: 'menu_book', web: 'book' },
            '#0066cc'
          )}
          {renderPickerSection(
            'society',
            'Society Events',
            societyOffset,
            setSocietyOffset,
            { ios: 'person.2.fill', android: 'group', web: 'people' },
            '#e91e63'
          )}
          {renderPickerSection(
            'deadline',
            'Academic Deadlines',
            deadlineOffset,
            setDeadlineOffset,
            { ios: 'exclamationmark.triangle.fill', android: 'warning', web: 'warning' },
            '#8e44ad'
          )}
        </View>

        <View className="mt-4 pt-5 border-t border-neutral-100 dark:border-neutral-900">
          <Button title="Save Notification Settings" onPress={handleSave} variant="yellow" />
        </View>
      </View>
    </Modal>
  );
}