import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import { Shield, Search, SlidersHorizontal, Calendar, CheckCircle2, Plus } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

// Force NativeWind to map className to style props for components
cssInterop(View, { className: 'style' });
cssInterop(Text, { className: 'style' });
cssInterop(TextInput, { className: 'style' });
cssInterop(Pressable, { className: 'style' });
cssInterop(FlatList, { className: 'style' });
cssInterop(Search, { className: 'style' });
cssInterop(SlidersHorizontal, { className: 'style' });
// Explicit TypeScript Interface for Type Safety
interface Society {
  id: string;
  name: string;
  category: 'Academic' | 'Social' | 'Sports' | 'Arts';
  description: string;
  logo: string;
  memberCount: number;
  isSubscribed: boolean;
}

// Initial Mock Data conforming to Person 3 specification guidelines
const MOCK_SOCIETIES: Society[] = [
  {
    id: '1',
    name: 'CSESoc (Computer Science Engineering)',
    category: 'Academic',
    description: 'The primary student society for computing students at UNSW.',
    logo: 'https://www.facebook.com/csesoc/videos/csesoc-logo/1851410461558584/',
    memberCount: 3420,
    isSubscribed: true,
  },
  {
    id: '2',
    name: 'UNSW Film Society',
    category: 'Arts',
    description: 'A community for cinema lovers, filmmakers, and casual viewers.',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq_UeDIBPasZH9zOMkuSCC7KLfx04mORN9XYs6x5lu3w&s=10',
    memberCount: 850,
    isSubscribed: false,
  },
  {
    id: '3',
    name: 'UNSW Motorsport Society',
    category: 'Sports',
    description: 'Organising fun, motorsport related activities for all!',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7v9ekRxva6Gq81ORhl2c8Q7G8DcsyCZA7LQcOrVz-FIsvW0QepunosaE&s=10',
    memberCount: 400,
    isSubscribed: true,
  },
];

export default function SocietyDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [societies, setSocieties] = useState<Society[]>(MOCK_SOCIETIES);

  const categories = ['All', 'Academic', 'Social', 'Sports', 'Arts'];

  // Toggle Subscription State (Triggers state for Person 2 Integration)
  const toggleSubscribe = (id: string) => {
    setSocieties(prev =>
      prev.map(soc =>
        soc.id === id ? { ...soc, isSubscribed: !soc.isSubscribed } : soc
      )
    );
  };

  // Filter Logic matching Search Bar + Filter Chips
  const filteredSocieties = useMemo(() => {
    return societies.filter(soc => {
      const matchesSearch = soc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            soc.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || soc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, societies]);

  return (
    <View className="flex-1 bg-slate-50 px-4 pt-4">
      {/* Search and Filter Row */}
      <View className="flex-row items-center space-x-2 mb-4">
        <View className="flex-1 flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
          <Search size={18} color="#64748b" className="mr-2" />
          <TextInput
            placeholder="Search societies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-slate-800 text-sm font-normal"
            placeholderTextColor="#94a3b8"
          />
        </View>
        <Pressable className="bg-white border border-slate-200 p-2.5 rounded-xl active:bg-slate-50">
          <SlidersHorizontal size={18} color="#334155" />
        </Pressable>
      </View>

      {/* Filter Chips Horizontally Scrollable */}
      <View className="mb-4">
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedCategory(item)}
              className={`mr-2 px-4 py-1.5 rounded-full border ${
                selectedCategory === item
                  ? 'bg-yellow-500 border-yellow-500'
                  : 'bg-white border-slate-200'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  selectedCategory === item ? 'text-slate-900' : 'text-slate-600'
                }`}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* Main Societies Feed */}
      <FlatList
        data={filteredSocieties}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Shield size={48} color="#cbd5e1" />
            <Text className="text-slate-400 mt-2 font-medium">No campus societies found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white border border-slate-100 rounded-2xl p-4 mb-3 shadow-sm flex-row items-center justify-between">
            {/* Navigatable Profile Area via Link */}
            <Link href={`/societies/${item.id}`} asChild>
              <Pressable className="flex-1 flex-row items-center space-x-3 mr-2">
                <Image
                  source={{ uri: item.logo }}
                  className="w-12 h-12 rounded-xl bg-slate-100"
                />
                <View className="flex-1">
                  <Text className="text-slate-900 font-bold text-sm leading-tight" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-slate-500 text-xs font-medium mb-0.5">
                    {item.category} • {item.memberCount} members
                  </Text>
                  <Text className="text-slate-600 text-xs font-normal" numberOfLines={1}>
                    {item.description}
                  </Text>
                </View>
              </Pressable>
            </Link>

            {/* Subscribe Action Button */}
            <Pressable
              onPress={() => toggleSubscribe(item.id)}
              className={`px-3 py-1.5 rounded-xl flex-row items-center space-x-1 ${
                item.isSubscribed ? 'bg-slate-100' : 'bg-slate-900'
              }`}
            >
              {item.isSubscribed ? (
                <>
                  <CheckCircle2 size={14} color="#475569" />
                  <Text className="text-slate-600 text-xs font-semibold">Joined</Text>
                </>
              ) : (
                <>
                  <Plus size={14} color="#ffffff" />
                  <Text className="text-white text-xs font-semibold">Join</Text>
                </>
              )}
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
