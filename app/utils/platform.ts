import { Platform } from "react-native";

// Helper to check if we're on a native platform
export const isNative = Platform.OS === "ios" || Platform.OS === "android";

// Helper to safely require native-only modules
export function safeRequire(modulePath: string) {
  if (isNative) {
    try {
      // Use a more compatible approach instead of eval(require)
      // This prevents Metro bundling issues
      const dynamicRequire = Function(
        "modulePath",
        "return require(modulePath)",
      );
      return dynamicRequire(modulePath);
    } catch (error) {
      console.error(`Failed to load module: ${modulePath}`, error);
      return null;
    }
  }
  return null;
}
