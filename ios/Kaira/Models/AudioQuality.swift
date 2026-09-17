import Foundation

public enum AudioQuality: String, Codable, CaseIterable, Identifiable {
    case hiRes192 = "HI_RES_192"
    case hiRes96 = "HI_RES_96"
    case losslessCD = "LOSSLESS_CD"
    case high320 = "HIGH_320"
    
    public var id: String { rawValue }
    
    public var displayName: String {
        switch self {
        case .hiRes192:
            return "24-bit / 192 kHz"
        case .hiRes96:
            return "24-bit / 96 kHz"
        case .losslessCD:
            return "16-bit / 44.1 kHz"
        case .high320:
            return "320 kbps High"
        }
    }
    
    public var badgeTitle: String {
        switch self {
        case .hiRes192, .hiRes96:
            return "Hi-Res Lossless"
        case .losslessCD:
            return "Lossless"
        case .high320:
            return "High Quality"
        }
    }
    
    public var shortLabel: String {
        switch self {
        case .hiRes192:
            return "192k"
        case .hiRes96:
            return "96k"
        case .losslessCD:
            return "CD"
        case .high320:
            return "320"
        }
    }
}
