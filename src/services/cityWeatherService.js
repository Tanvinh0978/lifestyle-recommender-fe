import React, { useState, useRef, useEffect } from 'react';

export const VIETNAM_CITIES = [
  { id: 'hanoi', name: 'Hà Nội', temp: '24°C', weather: 'Dịu mát', icon: '🍃', desc: 'Trời thu mát mẻ, nắng nhẹ' },
  { id: 'hcm', name: 'TP. Hồ Chí Minh', temp: '31°C', weather: 'Nắng ấm', icon: '☀️', desc: 'Thời tiết ấm áp, thoáng đãng' },
  { id: 'danang', name: 'Đà Nẵng', temp: '26°C', weather: 'Mát mẻ', icon: '🌊', desc: 'Gió biển trong lành, dễ chịu' },
  { id: 'dalat', name: 'Đà Lạt', temp: '17°C', weather: 'Se lạnh', icon: '🧥', desc: 'Se lạnh về sáng và tối, lý tưởng phối layer' },
  { id: 'haiphong', name: 'Hải Phòng', temp: '23°C', weather: 'Mát mẻ', icon: '🍃', desc: 'Nhiệt độ dễ chịu, gió nhẹ' },
  { id: 'cantho', name: 'Cần Thơ', temp: '30°C', weather: 'Nắng ấm', icon: '☀️', desc: 'Ấm áp miền sông nước' },
  { id: 'nhatrang', name: 'Nha Trang', temp: '28°C', weather: 'Nắng biển', icon: '🏖️', desc: 'Nắng ráo chan hòa' }
];

export function getCityWeather(cityName) {
  if (!cityName) return VIETNAM_CITIES[0];
  const found = VIETNAM_CITIES.find(c => c.name.toLowerCase().includes(cityName.toLowerCase()) || cityName.toLowerCase().includes(c.name.toLowerCase()));
  return found || { id: 'custom', name: cityName, temp: '25°C', weather: 'Dịu mát', icon: '🌤️', desc: 'Nhiệt độ dễ chịu, thuận lợi ra ngoài' };
}
