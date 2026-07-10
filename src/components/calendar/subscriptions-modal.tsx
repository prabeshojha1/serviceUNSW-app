import { useState } from 'react';
import { View, Text, Switch } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';

interface SubscriptionsModalProps {
  visible: boolean;
  onClose: () => void;
  subscribedSocieties: string[];
  onToggleSubscription: (societyName: string) => void;
}

export function SubscriptionsModal({
  visible,
  onClose,
  subscribedSocieties,
  onToggleSubscription,
}: SubscriptionsModalProps) {
  const [syncing, setSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);

  const societiesList = [
    { id: 'CSESoc', name: 'CSESoc (Computer Science & Engineering)', category: 'Engineering / Tech' },
    { id: 'DevSoc', name: 'DevSoc (UNSW Development Society)', category: 'Engineering / Tech' },
    { id: 'BSOC', name: 'BSOC (UNSW Business Society)', category: 'Business / Commerce' },
    { id: 'MathSoc', name: 'MathSoc (Mathematics Society)', category: 'Science / Mathematics' },
    { id: 'Arc', name: 'Arc (UNSW Student Life)', category: 'General / Campus Life' },
  ];

  const handleSync = () => {
    setSyncing(true);
    setSyncComplete(false);
    setTimeout(() => {
      setSyncing(false);
      setSyncComplete(true);
      setTimeout(() => {
        setSyncComplete(false);
      }, 3000);
    }, 1500);
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Society Calendar Subscriptions">
      <View className="gap-6">
        <Text className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Subscribe to society calendars to automatically show their campus events and workshop timetables directly inside your main calendar.
        </Text>

        {/* Societies List */}
        <View className="gap-3.5">
          {societiesList.map((soc) => {
            const isSubscribed = subscribedSocieties.includes(soc.id);
            return (
              <View
                key={soc.id}
                className="flex-row items-center justify-between p-3.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl"
              >
                <View className="flex-1 pr-3">
                  <Text className="text-sm font-bold text-neutral-950 dark:text-white mb-0.5">
                    {soc.id}
                  </Text>
                  <Text className="text-xs text-neutral-500 dark:text-neutral-400" numberOfLines={1}>
                    {soc.name}
                  </Text>
                  <Text className="text-[10px] font-semibold text-neutral-400 mt-1 dark:text-neutral-500">
                    {soc.category}
                  </Text>
                </View>
                <Switch
                  value={isSubscribed}
                  onValueChange={() => onToggleSubscription(soc.id)}
                  trackColor={{ false: '#d1d1d6', true: '#ffe600' }}
                  thumbColor={isSubscribed ? '#000' : '#f4f3f4'}
                />
              </View>
            );
          })}
        </View>

        {/* Sync Controls */}
        <View className="mt-4 pt-5 border-t border-neutral-100 dark:border-neutral-900 gap-3">
          <Button
            title={syncing ? 'Syncing...' : 'Sync Subscribed Calendars'}
            onPress={handleSync}
            variant="primary"
            loading={syncing}
          />

          {syncComplete && (
            <View className="flex-row items-center justify-center gap-1.5 bg-green-50 dark:bg-green-950/30 p-3 rounded-xl border border-green-200 dark:border-green-900/50">
              <SymbolView
                name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check' }}
                size={16}
                tintColor="#22c55e"
              />
              <Text className="text-xs font-bold text-green-700 dark:text-green-400">
                All society calendars synced successfully!
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
