import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface SocietyEvent {
  id: string;
  title: string;
  clubName: string;
  description: string;
  imageUrl: string | null;
}

const EVENTS: SocietyEvent[] = [
  {
    id: 'e1',
    title: 'Sausage Sizzle',
    clubName: 'CSESoc',
    description: 'Enjoy a sausage sizzle in the Quad where you can hang out with your friends.',
    imageUrl: null,
  },
  {
    id: 'e2',
    title: 'Tech Talk: Web3',
    clubName: 'CSESoc',
    description: 'Join industry leaders for an insightful discussion on the future of decentralized tech.',
    imageUrl: null,
  }
];

export default function EventsDiscoveryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const renderEventCard = ({ item }: { item: SocietyEvent }) => (
    <View className="flex-row bg-white rounded-[16px] p-3 mb-4 shadow-sm border border-gray-100">
      <View className="w-[100px] h-[120px] bg-[#E5E5E5] rounded-[12px] mr-4 items-center justify-center">
        <Text className="text-gray-400 text-xs">Image</Text>
      </View>
      <View className="flex-1 justify-between py-1">
        <View>
          <Text className="font-bold text-[18px] text-[#181716] leading-tight">
            {item.title}
          </Text>
          <Text className="text-[#FF635D] text-[12px] font-medium mb-1">
            {item.clubName}
          </Text>
          <Text className="text-[#181716] text-[12px] leading-tight" numberOfLines={3}>
            {item.description}
          </Text>
        </View>
        <TouchableOpacity 
          className="bg-[#FF635D] rounded-full py-2 items-center mt-2 w-4/5"
          onPress={() => router.push(`/societies/${item.id}`)}
        >
          <Text className="text-white text-[12px] font-bold">
            View Event
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FFDC00]">
      <View className="flex-1 px-4 pt-2">
        <View className="flex-row items-center justify-between mb-6 px-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="chevron-back" size={28} color="#181716" />
          </TouchableOpacity>
          <Text className="text-[24px] font-bold text-[#181716]">
            Society Events
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <View className="flex-1 bg-white rounded-[32px] p-4 shadow-md">
          <View className="flex-row items-center mb-6 space-x-3">
            <View className="flex-1 flex-row items-center border border-gray-300 rounded-full px-4 h-[44px]">
              <TextInput
                className="flex-1 text-[#181716] text-[14px]"
                placeholder="Search..."
                placeholderTextColor="#A0A0A0"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons name="search" size={20} color="#181716" />
            </View>
            <TouchableOpacity className="h-[44px] w-[44px] items-center justify-center">
              <Ionicons name="options-outline" size={26} color="#181716" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={EVENTS}
            keyExtractor={(item) => item.id}
            renderItem={renderEventCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}