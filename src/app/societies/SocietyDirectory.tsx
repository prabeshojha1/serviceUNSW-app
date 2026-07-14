import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView, 
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock Data for the Society Directory
const SOCIETIES = [
  {
    id: '1',
    name: 'CSESoc',
    category: 'Faculty Society',
    description: 'The official society for Computer Science and Software Engineering students at UNSW.',
    image: null,
  },
  {
    id: '2',
    name: 'PhotoClub',
    category: 'Hobby & Interest',
    description: 'Join a community of photography enthusiasts. We host weekly photowalks and workshops.',
    image: null,
  },
  {
    id: '3',
    name: 'Baking Society',
    category: 'Food & Lifestyle',
    description: 'Learn to bake, share recipes, and enjoy sweet treats with friends on campus.',
    image: null,
  },
];

export default function SocietyDirectoryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const renderSocietyCard = ({ item }: { item: typeof SOCIETIES[0] }) => (
    <View className="flex-row bg-white rounded-[16px] p-3 mb-4 shadow-sm border border-gray-100">
      {/* Image Placeholder */}
      <View className="w-[100px] h-[120px] bg-[#E5E5E5] rounded-[12px] mr-4 items-center justify-center">
        <Text className="text-gray-400 text-xs">Image</Text>
      </View>

      {/* Content Area */}
      <View className="flex-1 justify-between py-1">
        <View>
          <Text className="font-bold text-[18px] text-[#181716] leading-tight">
            {item.name}
          </Text>
          <Text className="text-[#FF635D] text-[12px] font-medium mb-1">
            {item.category}
          </Text>
          <Text className="text-[#181716] text-[12px] leading-tight" numberOfLines={3}>
            {item.description}
          </Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity 
          className="bg-[#FF635D] rounded-full py-2 items-center mt-2 w-4/5"
          onPress={() => router.push(`/societies/${item.id}`)}
        >
          <Text className="text-white text-[12px] font-bold">
            View Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FFDC00]">
      <View className="flex-1 px-4 pt-2">
        
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6 px-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="chevron-back" size={28} color="#181716" />
          </TouchableOpacity>
          <Text className="text-[24px] font-bold text-[#181716]">
            Societies
          </Text>
          <View style={{ width: 28 }} /> {/* Spacer for centering */}
        </View>

        {/* Main White Container (Insets content similar to screenshots) */}
        <View className="flex-1 bg-white rounded-[32px] p-4 shadow-md">
          
          {/* Search and Filter Row */}
          <View className="flex-row items-center mb-6 space-x-3">
            {/* Search Input */}
            <View className="flex-1 flex-row items-center border border-gray-300 rounded-full px-4 h-[44px]">
              <TextInput
                className="flex-1 text-[#181716] text-[14px]"
                placeholder="Search societies..."
                placeholderTextColor="#A0A0A0"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons name="search" size={20} color="#181716" />
            </View>

            {/* Filter Button */}
            <TouchableOpacity className="h-[44px] w-[44px] items-center justify-center">
              <Ionicons name="options-outline" size={26} color="#181716" />
            </TouchableOpacity>
          </View>

          {/* Societies List */}
          <FlatList
            data={SOCIETIES}
            keyExtractor={(item) => item.id}
            renderItem={renderSocietyCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}