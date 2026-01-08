import { LinearGradient } from "expo-linear-gradient";

export default function ScreenGradient({ children }) {
  return (
    <LinearGradient
      colors={[
        "rgba(1,147,224,0.25)", // top
        "rgba(1,147,224,0.08)", // mid
        "rgba(1,147,224,0.03)", // bottom (soft blue, not white)
      ]}
      locations={[0, 0.45, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
}
