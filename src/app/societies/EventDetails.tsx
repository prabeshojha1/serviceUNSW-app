import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EventDetailsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-[#FFDC00]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-2 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={28} color="#181716" />
        </TouchableOpacity>
        <Text className="text-[24px] font-clancy font-bold text-[#181716]">
          Event Details
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView className="flex-1 bg-white" bounces={false}>
        {/* Large Image Banner Placeholder */}
        <View className="w-full h-[300px] bg-[#E5E5E5] items-center justify-center">
          <Text className="text-gray-500 font-roboto">Image</Text>
        </View>

        {/* Content Body */}
        <View className="p-6">
          <Text className="font-clancy font-bold text-[28px] text-[#181716] mb-6">
            Sausage Sizzle
          </Text>

          {/* Icon Metadata Rows */}
          <View className="space-y-4 mb-8">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={20} color="#FF635D" />
              <Text className="ml-3 text-[16px] text-[#181716]">
                3:00pm - 4:00pm
              </Text>
            </View>
            <View className="flex-row items-center mt-3">
              <Ionicons name="location-outline" size={20} color="#FFDC00" />
              <Text className="ml-3 text-[16px] text-[#181716]">
                Quad
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-[16px] text-[#181716] leading-relaxed mb-10">
            Enjoy a sausage sizzle in the Quad where you can hang out with your friends.
          </Text>

          {/* Bottom Action Buttons */}
          <View className="flex-row justify-between mt-auto">
            <TouchableOpacity className="flex-1 bg-[#FF635D] rounded-full py-3 items-center mr-2">
              <Text className="text-white font-roboto font-bold text-[14px]">
                Save Event
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-[#FF635D] rounded-full py-3 items-center ml-2">
              <Text className="text-white font-roboto font-bold text-[14px]">
                Share Event
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
