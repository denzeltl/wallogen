import { DevicePreset } from '@/types';

export const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: 'desktop_4k',
    name: '4K Desktop',
    category: 'desktop',
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
  },
  {
    id: 'desktop_qhd',
    name: '1440p QHD',
    category: 'desktop',
    width: 2560,
    height: 1440,
    aspectRatio: '16:9',
  },
  {
    id: 'desktop_ultrawide',
    name: 'Ultrawide 3440',
    category: 'desktop',
    width: 3440,
    height: 1440,
    aspectRatio: '21:9',
  },
  {
    id: 'desktop_8k',
    name: '8K UHD',
    category: 'desktop',
    width: 7680,
    height: 4320,
    aspectRatio: '16:9',
  },
  {
    id: 'mobile_iphone',
    name: 'iPhone 15 Pro Max',
    category: 'mobile',
    width: 1290,
    height: 2796,
    aspectRatio: '19.5:9',
  },
  {
    id: 'mobile_android',
    name: 'Android Full HD',
    category: 'mobile',
    width: 1080,
    height: 2400,
    aspectRatio: '20:9',
  },
  {
    id: 'tablet_ipad',
    name: 'iPad Pro 12.9"',
    category: 'tablet',
    width: 2048,
    height: 2732,
    aspectRatio: '4:3',
  },
  {
    id: 'square_1to1',
    name: 'Square Avatar',
    category: 'custom',
    width: 2048,
    height: 2048,
    aspectRatio: '1:1',
  },
  {
    id: 'custom',
    name: 'Custom Resolution',
    category: 'custom',
    width: 1920,
    height: 1080,
    aspectRatio: 'custom',
  },
];

export const DEFAULT_DEVICE_PRESET = DEVICE_PRESETS[0]; // 4K Desktop
