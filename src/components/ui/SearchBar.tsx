import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = "Search..." }: SearchBarProps) {
  return (
    <View className="flex-1 flex-row items-center border border-gray-300 rounded-full px-4 h-[44px] bg-white">
      <TextInput
        className="flex-1 text-[#181716] text-[14px]"
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        value={value}
        onChangeText={onChangeText}
      />
      <Ionicons name="search" size={20} color="#181716" />
    </View>
  );
}