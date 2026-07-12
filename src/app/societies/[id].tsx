import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Pressable, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Users, CheckCircle2, Plus } from 'lucide-react-native';
import EventCard from '../../components/ui/EventCard';

export default function SocietyProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Quick mock lookup based on the parameter ID
  const societyDetails = {
    name: 'CSESoc (Computer Science Engineering)',
    category: 'Academic',
    members: '3,420 members',
    description: 'The primary student society for computing students at UNSW. We run weekly social events, technical workshops, industry networking nights, and hackathons to support your student life.',
    banner: 'https://unsplash.com',
    events: [
      {
        id: 'e1',
        title: 'Intro to React Native & Expo Workshop',
        date: 'Thursday, 16 July',
        time: '6:00 PM - 8:00 PM',
        location: 'UNSW Ainsworth Building G02',
        imageUri: 'https://unsplash.com'
      },
      {
        id: 'e2',
        title: 'Annual Winter Hackathon 2026',
        date: '24 July - 26 July',
        time: 'Starts 5:00 PM Friday',
        location: 'UNSW Roundhouse',
        imageUri: 'https://unsplash.com'
      }
    ]
  };

  return (
    <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
      {/* Header Banner Background */}
      <View className="relative h-56 bg-slate-900">
        <Image source={{ uri: societyDetails.banner }} className="w-full h-full opacity-80" />
        
        {/* Floating Back Navigation Button */}
        <Pressable 
          onPress={() => router.back()} 
          className="absolute top-4 left-4 bg-black/40 p-2.5 rounded-full active:bg-black/60"
        >
          <ArrowLeft size={20} color="#ffffff" />
        </Pressable>
      </View>

      {/* Main Container details */}
      <View className="px-4 -mt-6">
        <View className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
            {societyDetails.category}
          </Text>
          <Text className="text-slate-900 font-extrabold text-xl leading-snug mb-2">
            {societyDetails.name}
          </Text>
          
          <View className="flex-row items-center space-x-1.5 mb-4">
            <Users size={14} color="#64748b" />
            <Text className="text-slate-500 text-xs font-medium">{societyDetails.members}</Text>
          </View>

          {/* Join / Subscribe Primary Action Button */}
          <Pressable
            onPress={() => setIsSubscribed(!isSubscribed)}
            className={`w-full py-3 rounded-xl flex-row items-center justify-center space-x-2 ${
              isSubscribed ? 'bg-slate-100 border border-slate-200' : 'bg-slate-900'
            }`}
          >
            {isSubscribed ? (
              <>
                <CheckCircle2 size={16} color="#475569" />
                <Text className="text-slate-700 font-semibold text-sm">Joined Society</Text>
              </>
            ) : (
              <>
                <Plus size={16} color="#ffffff" />
                <Text className="text-white font-semibold text-sm">Join Society</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* About Section */}
        <View className="mt-5 px-1">
          <Text className="text-slate-900 font-bold text-base mb-2">About Us</Text>
          <Text className="text-slate-600 text-sm font-normal leading-relaxed">
            {societyDetails.description}
          </Text>
        </View>

        {/* Integrated Events Subsection List Feed */}
        <View className="mt-6 px-1 mb-8">
          <Text className="text-slate-900 font-bold text-base mb-4">Upcoming Events</Text>
          {societyDetails.events.map((item) => (
            <EventCard
              key={item.id}
              title={item.title}
              date={item.date}
              time={item.time}
              location={item.location}
              clubName={societyDetails.name}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
