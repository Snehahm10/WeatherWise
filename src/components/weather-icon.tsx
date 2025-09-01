import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Moon,
  CloudSun,
  CloudMoon,
  Thermometer,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  iconName: string;
}

export function WeatherIcon({ iconName, ...props }: WeatherIconProps) {
  const iconMap: { [key: string]: React.ElementType } = {
    sun: Sun,
    sunny: Sun,
    clear: Sun,
    cloud: Cloud,
    cloudy: Cloud,
    'partly cloudy': CloudSun,
    rain: CloudRain,
    rainy: CloudRain,
    snow: CloudSnow,
    snowy: CloudSnow,
    storm: CloudLightning,
    stormy: CloudLightning,
    moon: Moon,
    cloudsun: CloudSun,
    cloudmoon: CloudMoon,
  };

  const IconComponent = iconMap[iconName?.toLowerCase()] || Thermometer;

  return <IconComponent {...props} />;
}
