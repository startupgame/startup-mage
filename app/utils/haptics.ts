import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

/**
 * Safely trigger impact haptic feedback based on platform
 * @param style Impact feedback style
 */
export const safeImpact = (
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium,
) => {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(style);
  }
};

/**
 * Safely trigger notification haptic feedback based on platform
 * @param type Notification feedback type
 */
export const safeNotification = (
  type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType
    .Success,
) => {
  if (Platform.OS !== "web") {
    Haptics.notificationAsync(type);
  }
};

/**
 * Safely trigger selection haptic feedback based on platform
 */
export const safeSelection = () => {
  if (Platform.OS !== "web") {
    Haptics.selectionAsync();
  }
};
