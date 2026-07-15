import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock Data for the Society Profile
const SOCIETY_DATA = {
  id: 'compclub',
  name: 'compclub',
  category: 'Tech & Education',
  description: 'We are dedicated to teaching coding to children and the next generation of engineers. Join us to mentor students, develop teaching materials, and build a stronger technical community.',
  subscriberCount: 342,
  isSubscribed: false,
  socials: {
    website: 'https://example.com',
    instagram: '@example_ig',
    email: 'hello@example.com'
  },
  upcomingEvents: [
    {
      id: 'e1',
      title: 'Weekend Mentoring Session',
      date: 'Sat, 18 Jul',
      time: '10:00am - 12:00pm'
    },
    {
      id: 'e2',
      title: 'Python Curriculum Workshop',
      date: 'Wed, 22 Jul',
      time: '4:00pm - 5:30pm'
    }
  ]
};

export default function SocietyProfileScreen() {
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(SOCIETY_DATA.isSubscribed);

  return (
    <SafeAreaView className="flex-1 bg-[#FFDC00]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-2 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={28} color="#181716" />
        </TouchableOpacity>
        <Text className="text-[24px] font-clancy font-bold text-[#181716]">
          Society Profile
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView className="flex-1 bg-white" bounces={false}>
        {/* Large Image Banner Placeholder */}
        <View className="w-full h-[220px] bg-[#E5E5E5] items-center justify-center">
          <Text className="text-gray-500 font-roboto">Cover Image</Text>
        </View>

        <View className="p-6">
          {/* Title and Subscribe Row */}
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 pr-4">
              <Text className="font-clancy font-bold text-[28px] text-[#181716] leading-tight">
                {SOCIETY_DATA.name}
              </Text>
              <Text className="text-[#FF635D] text-[14px] font-medium mt-1">
                {SOCIETY_DATA.category}
              </Text>
            </View>

            {/* Subscribe Button */}
            <TouchableOpacity
              onPress={() => setIsSubscribed(!isSubscribed)}
              className={`px-4 py-2 rounded-full justify-center items-center ${
                isSubscribed ? 'bg-[#181716]' : 'bg-[#FFDC00]'
              }`}
            >
              <Text className={`font-roboto font-bold text-[14px] ${
                isSubscribed ? 'text-white' : 'text-[#181716]'
              }`}>
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-gray-500 text-[12px] mb-6">
            {SOCIETY_DATA.subscriberCount} Subscribers
          </Text>

          {/* Description */}
          <Text className="text-[16px] text-[#181716] leading-relaxed mb-8">
            {SOCIETY_DATA.description}
          </Text>

          {/* Contact & Social Links */}
          <Text className="font-clancy font-bold text-[20px] text-[#181716] mb-4">
            Connect
          </Text>
          <View className="flex-row space-x-4 mb-8">
            <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
              <Ionicons name="globe-outline" size={24} color="#181716" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
              <Ionicons name="logo-instagram" size={24} color="#181716" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
              <Ionicons name="mail-outline" size={24} color="#181716" />
            </TouchableOpacity>
          </View>

          {/* Upcoming Events List */}
          <View className="flex-row justify-between items-end mb-4">
            <Text className="font-clancy font-bold text-[20px] text-[#181716]">
              Upcoming Events
            </Text>
            <TouchableOpacity>
              <Text className="text-[#FF635D] text-[14px] font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          {SOCIETY_DATA.upcomingEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              className="bg-white border border-gray-200 rounded-[12px] p-4 mb-3 shadow-sm flex-row items-center justify-between"
              onPress={() => router.push({ pathname: '/societies/EventDetails', params: { id: event.id } })}
            >
              <View>
                <Text className="font-bold text-[16px] text-[#181716] mb-1">
                  {event.title}
                </Text>
                <Text className="text-gray-500 text-[12px]">
                  {event.date} • {event.time}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
            </TouchableOpacity>
          ))}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
