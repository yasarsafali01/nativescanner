import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { useAppTheme } from "../theme/ThemeContext";

const ToastContext = createContext(null);
const VISIBLE_MS = 3500;
const ANIM_MS = 200;

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  const hideTimer = useRef(null);

  const showToast = useCallback(
    (text) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setMessage(text);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: ANIM_MS, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: ANIM_MS, useNativeDriver: true }),
      ]).start();

      hideTimer.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0, duration: ANIM_MS, useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 16, duration: ANIM_MS, useNativeDriver: true }),
        ]).start(() => setMessage(null));
      }, VISIBLE_MS);
    },
    [opacity, translateY]
  );

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {message != null && <ToastBubble message={message} opacity={opacity} translateY={translateY} />}
    </ToastContext.Provider>
  );
}

function ToastBubble({ message, opacity, translateY }) {
  const { colors } = useAppTheme();
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.bubble,
        { backgroundColor: colors.text, opacity, transform: [{ translateY }] },
      ]}
    >
      <Text style={[styles.text, { color: colors.background }]}>{message}</Text>
    </Animated.View>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 100,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  text: { fontSize: 14, fontWeight: "700", textAlign: "center" },
});
