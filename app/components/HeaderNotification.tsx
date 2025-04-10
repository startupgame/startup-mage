import React, { useEffect } from "react";
import { View, Text, Animated } from "react-native";
import { CheckCircle, AlertCircle } from "lucide-react-native";

interface HeaderNotificationProps {
  message: string;
  visible: boolean;
  type?: "success" | "error" | "info";
  onHide?: () => void;
  duration?: number;
}

export default function HeaderNotification({
  message,
  visible,
  type = "success",
  onHide = () => {},
  duration = 3000,
}: HeaderNotificationProps) {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideNotification();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible && opacity._value === 0) return null;

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-blue-500";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={18} color="white" />;
      case "error":
        return <AlertCircle size={18} color="white" />;
      default:
        return <CheckCircle size={18} color="white" />;
    }
  };

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
      className={`absolute top-0 left-0 right-0 z-50 mx-4 mt-2 rounded-lg shadow-lg ${getBgColor()}`}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center">
          {getIcon()}
          <Text className="ml-2 text-white font-medium">{message}</Text>
        </View>
      </View>
    </Animated.View>
  );
}
