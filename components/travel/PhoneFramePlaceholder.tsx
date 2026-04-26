import { Placeholder, type PlaceholderTone } from "./Placeholder";
import { Icon } from "./Icon";
import styles from "@/app/travel/travel.module.css";

interface PhoneFramePlaceholderProps {
  tone: PlaceholderTone;
  label: string;
  location: string;
  views: string;
  index: number;
}

export function PhoneFramePlaceholder({
  tone,
  label,
  location,
  views,
  index,
}: PhoneFramePlaceholderProps) {
  return (
    <div>
      <div
        style={{
          aspectRatio: "9 / 19.5",
          borderRadius: 34,
          background: "var(--ink)",
          padding: 8,
          boxShadow:
            "0 30px 60px -30px rgba(43,42,38,0.35), 0 10px 20px -10px rgba(43,42,38,0.2)",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 26,
            overflow: "hidden",
            background: "#111",
            position: "relative",
          }}
        >
          <Placeholder
            tone={tone}
            ratio="auto"
            style={{ height: "100%", aspectRatio: "unset" }}
            patternId={`reel-ph-${index}`}
          />
          <div
            style={{
              position: "absolute",
              top: 10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 80,
              height: 22,
              background: "#0a0a0a",
              borderRadius: 14,
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(251,247,240,0.92)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name="play" size={20} stroke={0} />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "100px 16px 18px",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.22) 65%, rgba(0,0,0,0) 100%)",
              color: "#fff",
              zIndex: 2,
            }}
          >
            <div
              className={styles.mono}
              style={{
                fontSize: 9,
                opacity: 0.85,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {location}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div
                className={styles.serif}
                style={{
                  fontSize: 14,
                  fontStyle: "italic",
                  opacity: 0.9,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {label}
              </div>
              <div
                className={styles.mono}
                style={{
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                }}
              >
                {views}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 8,
        }}
      >
        <div className={styles.serif} style={{ fontSize: 15, fontStyle: "italic" }}>
          {location}
        </div>
        <div className={styles.monoXs}>N° {String(index + 1).padStart(2, "0")}</div>
      </div>
    </div>
  );
}
