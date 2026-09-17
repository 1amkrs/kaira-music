import Foundation

public struct EQPreset: Identifiable, Hashable, Sendable {
    public var id: String { name }
    public let name: String
    public let gains: [Double] // 10 frequencies: 32Hz, 64Hz, 125Hz, 250Hz, 500Hz, 1kHz, 2kHz, 4kHz, 8kHz, 16kHz
}

@MainActor
public final class EqualizerEngine: ObservableObject {
    public static let shared = EqualizerEngine()
    
    @Published public var isEnabled: Bool = true
    @Published public var currentPreset: String = "Audiophile Flat"
    @Published public var gains: [Double] = Array(repeating: 0.0, count: 10) // in dB
    
    public static let frequencyLabels = ["32Hz", "64Hz", "125Hz", "250Hz", "500Hz", "1kHz", "2kHz", "4kHz", "8kHz", "16kHz"]
    
    public static let presets: [EQPreset] = [
        EQPreset(name: "Audiophile Flat", gains: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]),
        EQPreset(name: "Bass Boost", gains: [5.0, 4.5, 3.5, 2.0, 0.5, 0.0, 0.0, 0.0, 1.0, 1.5]),
        EQPreset(name: "Vocal Clarity", gains: [-1.0, -0.5, 0.0, 1.5, 3.0, 3.5, 2.5, 1.0, 0.5, 0.0]),
        EQPreset(name: "Electronic Club", gains: [4.5, 4.0, 2.0, 0.0, -1.0, 1.0, 2.0, 3.5, 4.0, 4.5]),
        EQPreset(name: "Acoustic Warmth", gains: [2.5, 2.0, 1.5, 1.0, 0.5, 0.5, 1.0, 1.5, 2.0, 2.5]),
        EQPreset(name: "Rock Dynamic", gains: [3.5, 2.5, 1.0, -0.5, -1.0, 0.5, 1.5, 2.5, 3.0, 3.5]),
        EQPreset(name: "Treble Air", gains: [-1.0, -1.0, 0.0, 0.0, 0.5, 1.0, 2.0, 3.5, 5.0, 6.0])
    ]
    
    public func applyPreset(_ preset: EQPreset) {
        self.currentPreset = preset.name
        self.gains = preset.gains
    }
    
    public func setGain(at index: Int, gainDb: Double) {
        guard index >= 0 && index < gains.count else { return }
        gains[index] = min(max(gainDb, -12.0), 12.0)
        currentPreset = "Custom"
    }
}
