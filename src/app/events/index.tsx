import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, SlidersHorizontal, ChevronLeft } from 'lucide-react-native';
import EventCard from '../../components/ui/EventCard';

export default function SocietyEventsFeed() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const MOCK_FIGMA_EVENTS = [
    { id: '1', title: 'Sausage Sizzle', clubName: 'Club name', description: 'Enjoy a sausage sizzle in the Quad where you can hang out with your friends.' },
    { id: '2', title: 'Sausage Sizzle', clubName: 'Club name', description: 'Enjoy a sausage sizzle in the Quad where you can hang out with your friends.' },
    { id: '3', title: 'Sausage Sizzle', clubName: 'Club name', description: 'Enjoy a sausage sizzle in the Quad where you can hang out with your friends.' },
  ];

  return (
    // Solid Yellow Outer Canvas Frame matching Figma Top Bar Background
    <View className="flex-1 bg-[#FFE600] pt-12">

      {/* Title Header Space Row */}
      <View className="flex-row items-center justify-between px-6 pb-6">
        <Pressable onPress={() => router.back()} className="p-1 active:opacity-60">
          <ChevronLeft size={24} color="#000000" strokeWidth={2.5} />
        </Pressable>
        <Text className="text-black font-extrabold text-2xl tracking-tight flex-1 text-center mr-6">
          Society Events
        </Text>
        <View className="w-6" /> {/* Balance layout spacing spacer */}
      </View>

      {/* Main Inner Component Canvas Frame (Rounded Top Nested Section) */}
      <View className="flex-1 bg-slate-50 rounded-t-[36px] px-5 pt-6 shadow-2xl">

        {/* Isolated Inline Figma Search Input Bar Layout */}
        <View className="flex-row items-center bg-white border border-slate-200 rounded-full px-4 py-3 mb-6 shadow-sm">
          <TextInput
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
            className="flex-1 text-slate-800 text-sm font-medium mr-2"
            placeholderTextColor="#94a3b8"
          />
          <Pressable className="mr-3 active:opacity-60">
            <Search size={20} color="#000000" />
          </Pressable>
          <View className="w-[1px] h-5 bg-slate-200 mr-3" />
          <Pressable className="active:opacity-60">
            <SlidersHorizontal size={20} color="#000000" />
          </Pressable>
        </View>

        {/* Dynamic Card Scroll View Section Container */}
        <FlatList
          data={MOCK_FIGMA_EVENTS}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <EventCard
              title={item.title}
              clubName={item.clubName}
              description={item.description}
              onPress={() => router.push({ pathname: '/societies/[id]', params: { id: item.id } })}
            />
          )}
        />
      </View>
    </View>
  );
}