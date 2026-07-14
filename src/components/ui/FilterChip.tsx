import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export function FilterChip({ label, isActive, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 border ${
        isActive ? 'bg-[#FF635D] border-[#FF635D]' : 'bg-white border-gray-300'
      }`}
    >
      <Text className={`font-roboto font-bold text-[12px] ${
        isActive ? 'text-white' : 'text-[#181716]'
      }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}