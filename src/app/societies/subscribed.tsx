import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Using a slimmed-down interface for the list
interface SubscribedSociety {
  id: string;
  name: string;
  category: string;
}

const INITIAL_SUBSCRIPTIONS: SubscribedSociety[] = [
  { id: '1', name: 'CSESoc', category: 'Faculty Society' },
  { id: '2', name: 'compclub', category: 'Tech & Education' },
];

export default function SubscribedSocietiesScreen() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);

  const handleUnsubscribe = (id: string) => {
    setSubscriptions(prev => prev.filter(soc => soc.id !== id));
  };

  const renderItem = ({ item }: { item: SubscribedSociety }) => (
    <View className="flex-row bg-white rounded-[16px] p-4 mb-3 shadow-sm border border-gray-100 items-center justify-between">
      <View className="flex-1">
        <Text className="font-clancy font-bold text-[18px] text-[#181716]">
          {item.name}
        </Text>
        <Text className="text-[#FF635D] text-[12px] font-medium mt-1">
          {item.category}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleUnsubscribe(item.id)}
        className="bg-gray-100 px-4 py-2 rounded-full"
      >
        <Text className="font-roboto font-bold text-[12px] text-[#181716]">
          Unfollow
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FFDC00]">
      <View className="flex-1 px-4 pt-2">
        <View className="flex-row items-center justify-between mb-6 px-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="chevron-back" size={28} color="#181716" />
          </TouchableOpacity>
          <Text className="text-[24px] font-clancy font-bold text-[#181716]">
            Following
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <View className="flex-1 bg-white rounded-t-[32px] p-4 shadow-md pt-6">
          {subscriptions.length > 0 ? (
            <FlatList
              data={subscriptions}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500 font-roboto">No subscriptions yet.</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}