import SwiftUI

public struct QualityBadgeView: View {
    let quality: AudioQuality
    var compact: Bool = false
    
    public init(quality: AudioQuality, compact: Bool = false) {
        self.quality = quality
        self.compact = compact
    }
    
    public var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "waveform")
                .font(.system(size: compact ? 8 : 10, weight: .bold))
            Text(compact ? quality.shortLabel : quality.badgeTitle.uppercased())
                .font(.system(size: compact ? 9 : 10, weight: .bold, design: .monospaced))
        }
        .padding(.horizontal, compact ? 5 : 8)
        .padding(.vertical, compact ? 2 : 4)
        .foregroundColor(badgeColor)
        .background(
            RoundedRectangle(cornerRadius: 6, style: .continuous)
                .fill(badgeColor.opacity(0.12))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 6, style: .continuous)
                .stroke(badgeColor.opacity(0.28), lineWidth: 1)
        )
    }
    
    private var badgeColor: Color {
        switch quality {
        case .hiRes192, .hiRes96:
            return Color(red: 0.95, green: 0.75, blue: 0.25) // Warm Audiophile Gold
        case .losslessCD:
            return Color(red: 0.22, green: 0.74, blue: 0.97) // Lossless Cyan
        case .high320:
            return Color(red: 0.7, green: 0.7, blue: 0.7)
        }
    }
}
