import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Calendar, Clock, MapPin } from 'lucide-react-native';

interface EventCardProps {
  title: string;
  clubName: string;
  description?: string; // 🟡 Optional for flexibility
  date?: string;        // 🟡 Optional metadata
  time?: string;        // 🟡 Optional metadata
  location?: string;    // 🟡 Optional metadata
  onPress?: () => void;
}

export default function EventCard({
  title,
  clubName,
  description,
  date,
  time,
  location,
  onPress
}: EventCardProps) {
  return (
    <View className="bg-white rounded-[24px] p-4 mb-4 flex-row items-start shadow-sm border border-slate-50">
      {/* Figma Square Placeholder Left Side */}
      <View className="w-[84px] h-[100px] bg-zinc-200 rounded-lg items-center justify-center mr-4">
        <Text className="text-zinc-500 font-medium text-xs">Image</Text>
      </View>

      {/* Content Block Right Side */}
      <View className="flex-1 justify-between min-h-[100px]">
        <View>
          <Text className="text-slate-900 font-bold text-base mb-0.5 leading-snug">
            {title}
          </Text>
          <Text className="text-red-500 font-medium text-xs mb-1">
            {clubName}
          </Text>

          {/* Render description only if provided (e.g., on the Events screen) */}
          {description && (
            <Text className="text-slate-500 text-xs font-normal leading-normal mb-2" numberOfLines={2}>
              {description}
            </Text>
          )}

          {/* Render metadata icons layout only if they are passed (e.g., on the Profile screen) */}
          {(date || time || location) && (
            <View className="mt-1 space-y-1">
              {date && (
                <View className="flex-row items-center space-x-1.5">
                  <Calendar size={12} color="#64748b" />
                  <Text className="text-slate-500 text-[11px] font-medium">{date}</Text>
                </View>
              )}
              {time && (
                <View className="flex-row items-center space-x-1.5">
                  <Clock size={12} color="#64748b" />
                  <Text className="text-slate-500 text-[11px] font-medium">{time}</Text>
                </View>
              )}
              {location && (
                <View className="flex-row items-center space-x-1.5">
                  <MapPin size={12} color="#64748b" />
                  <Text className="text-slate-500 text-[11px] font-medium" numberOfLines={1}>{location}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Figma Pill Layout Button Action */}
        <Pressable
          onPress={onPress}
          className="bg-red-600 py-2.5 rounded-full items-center justify-center mt-3 active:bg-red-700"
        >
          <Text className="text-white font-bold text-xs">View Event</Text>
        </Pressable>
      </View>
    </View>
  );
}
